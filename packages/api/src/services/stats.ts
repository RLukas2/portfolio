// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import
import * as Sentry from '@sentry/node';
import type { db as DB } from '@xbrk/db/client';
import { articles, articleViews, project, snippet, user } from '@xbrk/db/schema';
import { count, desc, sql } from 'drizzle-orm';

type DbClient = typeof DB;

const DEFAULT_MONTHS = 6;
const FIRST_DAY = 1;
const MIN_MONTHS = 1;
const MAX_MONTHS = 24;

interface MonthlyData {
  count: number;
  month: string;
}

/**
 * Validates the months parameter
 */
function validateMonths(months?: number): number {
  if (months === undefined) {
    return DEFAULT_MONTHS;
  }

  if (months < MIN_MONTHS || months > MAX_MONTHS) {
    throw new Error(`Months must be between ${MIN_MONTHS} and ${MAX_MONTHS}`);
  }

  return months;
}

/**
 * Calculates start date for a given number of months back
 */
function calculateStartDate(months: number): Date {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), FIRST_DAY));
  start.setUTCMonth(start.getUTCMonth() - (months - 1));
  return start;
}

/**
 * Processes monthly data into continuous range, filling gaps with zeros
 */
function processMonthlyData(result: { rows: Record<string, unknown>[] }, start: Date, months: number): MonthlyData[] {
  const monthCounts = new Map<string, number>();
  for (const row of result.rows as { month: string; count: number }[]) {
    monthCounts.set(row.month, Number(row.count));
  }

  const data: MonthlyData[] = [];
  const cursor = new Date(start);
  for (let i = 0; i < months; i += 1) {
    const key = `${cursor.getUTCFullYear()}-${String(cursor.getUTCMonth() + 1).padStart(2, '0')}`;
    data.push({ month: key, count: monthCounts.get(key) ?? 0 });
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }

  return data;
}

/**
 * Returns monthly new user registration counts for the given number of months.
 * Fills in zero for months with no registrations to ensure a continuous range.
 * @param input.months - Number of months to look back (default: 6, min: 1, max: 24).
 * @throws {Error} If months parameter is invalid
 */
export async function monthlyUsers(db: DbClient, input?: { months?: number }): Promise<MonthlyData[]> {
  try {
    const months = validateMonths(input?.months);
    const start = calculateStartDate(months);

    // Fetch monthly counts from DB
    const result = await db.execute(
      sql<{ month: string; count: number }>`
        SELECT to_char(date_trunc('month', ${user.createdAt}), 'YYYY-MM') AS month,
               COUNT(*)::int AS count
        FROM ${user}
        WHERE ${user.createdAt} >= ${start}
        GROUP BY 1
        ORDER BY 1
      `,
    );

    return processMonthlyData(result, start, months);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Months must be')) {
      throw error;
    }
    Sentry.captureException(error);
    console.error('[stats.monthlyUsers] Database error:', error);
    return [];
  }
}

/**
 * Returns total counts for users, articles, projects, and snippets.
 */
export async function totalStats(db: DbClient) {
  try {
    const [usersRes, articlesRes, projectsRes, snippetsRes] = await Promise.all([
      db.select({ count: count() }).from(user),
      db.select({ count: count() }).from(articles),
      db.select({ count: count() }).from(project),
      db.select({ count: count() }).from(snippet),
    ]);

    return {
      users: usersRes[0]?.count ?? 0,
      articles: articlesRes[0]?.count ?? 0,
      projects: projectsRes[0]?.count ?? 0,
      snippets: snippetsRes[0]?.count ?? 0,
    };
  } catch (error) {
    Sentry.captureException(error);
    console.error('[stats.totalStats] Database error:', error);
    return { users: 0, articles: 0, projects: 0, snippets: 0 };
  }
}

export interface RecentActivityItem {
  createdAt: Date;
  id: string;
  title: string;
  type: 'user' | 'article' | 'project';
  url: string;
}

/**
 * Returns a combined list of recent activity (users joining, articles created, projects created).
 */
export async function recentActivity(db: DbClient, limit = 10): Promise<RecentActivityItem[]> {
  try {
    const recentUsers = await db.query.user.findMany({
      orderBy: [desc(user.createdAt)],
      limit,
      columns: { id: true, name: true, createdAt: true },
    });

    const recentArticles = await db.query.articles.findMany({
      orderBy: [desc(articles.createdAt)],
      limit,
      columns: { id: true, title: true, createdAt: true },
    });

    const recentProjects = await db.query.project.findMany({
      orderBy: [desc(project.createdAt)],
      limit,
      columns: { id: true, title: true, createdAt: true },
    });

    const combined: RecentActivityItem[] = [
      ...recentUsers.map(
        (u) =>
          ({
            id: u.id,
            type: 'user',
            title: u.name,
            createdAt: u.createdAt,
            url: '/users',
          }) as RecentActivityItem,
      ),
      ...recentArticles.map(
        (a) =>
          ({
            id: a.id,
            type: 'article',
            title: a.title,
            createdAt: a.createdAt,
            url: `/blog/${a.id}/edit`,
          }) as RecentActivityItem,
      ),
      ...recentProjects.map(
        (p) =>
          ({
            id: p.id,
            type: 'project',
            title: p.title,
            createdAt: p.createdAt,
            url: `/projects/${p.id}/edit`,
          }) as RecentActivityItem,
      ),
    ];

    // Sort descending by createdAt and slice the total top N
    return combined.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit);
  } catch (error) {
    Sentry.captureException(error);
    console.error('[stats.recentActivity] Database error:', error);
    return [];
  }
}

/**
 * Returns monthly article view counts for the given number of months.
 * Fills in zero for months with no views to ensure a continuous range.
 * @param input.months - Number of months to look back (default: 6, min: 1, max: 24).
 * @throws {Error} If months parameter is invalid
 */
export async function monthlyBlogViews(db: DbClient, input?: { months?: number }): Promise<MonthlyData[]> {
  try {
    const months = validateMonths(input?.months);
    const start = calculateStartDate(months);

    // Fetch monthly aggregated views from DB by actual view timestamp
    const result = await db.execute(
      sql<{ month: string; count: number }>`
        SELECT to_char(date_trunc('month', ${articleViews.createdAt}), 'YYYY-MM') AS month,
               COUNT(*)::int AS count
        FROM ${articleViews}
        WHERE ${articleViews.createdAt} >= ${start}
        GROUP BY 1
        ORDER BY 1
      `,
    );

    return processMonthlyData(result, start, months);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Months must be')) {
      throw error;
    }
    Sentry.captureException(error);
    console.error('[stats.monthlyBlogViews] Database error:', error);
    return [];
  }
}
