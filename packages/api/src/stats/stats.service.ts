import { articles, articleViews, project, snippet, user } from '@xbrk/db/schema';
import { ValidationError } from '@xbrk/errors';
import { count, desc, sql } from 'drizzle-orm';
import type { AdminContext, DbClient } from '../shared/db';
import { reportError } from '../shared/errors';
import type { MonthlyData, RecentActivityItem } from './stats.schemas';
import { calculateStartDate, processMonthlyData, validateMonths } from './stats.schemas';

export async function monthlyUsers(
  db: DbClient,
  _admin: AdminContext,
  input?: { months?: number },
): Promise<MonthlyData[]> {
  try {
    const months = validateMonths(input?.months);
    const start = calculateStartDate(months);

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
    if (error instanceof ValidationError) {
      throw error;
    }
    reportError('stats.monthlyUsers', error);
    return [];
  }
}

export async function totalStats(db: DbClient, _admin: AdminContext) {
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
    reportError('stats.totalStats', error);
    return { users: 0, articles: 0, projects: 0, snippets: 0 };
  }
}

export async function recentActivity(db: DbClient, _admin: AdminContext, limit = 10): Promise<RecentActivityItem[]> {
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

    return combined.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit);
  } catch (error) {
    reportError('stats.recentActivity', error);
    return [];
  }
}

export async function monthlyBlogViews(
  db: DbClient,
  _admin: AdminContext,
  input?: { months?: number },
): Promise<MonthlyData[]> {
  try {
    const months = validateMonths(input?.months);
    const start = calculateStartDate(months);

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
    if (error instanceof ValidationError) {
      throw error;
    }
    reportError('stats.monthlyBlogViews', error);
    return [];
  }
}
