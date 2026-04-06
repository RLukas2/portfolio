// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import
import * as Sentry from '@sentry/tanstackstart-react';
import type { ContributionCalender, ContributionDay, ContributionsCollection, GitHubUser } from '@xbrk/types';
import { formatISO, subDays } from 'date-fns';
import { env } from '../env/server';

const GITHUB_API_BASE_URL = 'https://api.github.com' as const;
const GITHUB_GRAPHQL_API_URL = 'https://api.github.com/graphql' as const;
const DAYS_TO_FETCH = 30 as const;

/**
 * Creates headers for GitHub API requests.
 * Includes authorization token if available in environment.
 *
 * @returns Headers object for fetch requests
 */
function createGithubHeaders() {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (env.GITHUB_ACCESS_TOKEN) {
    headers.Authorization = `Bearer ${env.GITHUB_ACCESS_TOKEN}`;
  }

  return headers;
}

/**
 * Fetches GitHub user statistics including repository count and total stars.
 *
 * Retrieves user profile data and repository information from GitHub API.
 * Filters out forked repositories and calculates total stars across owned repos.
 *
 * @returns Object containing user data, repo count, and stars count, or null on error
 *
 * @example
 * ```ts
 * const stats = await getGithubStats();
 * if (stats) {
 *   console.log(`${stats.repos} repos with ${stats.starsCount} stars`);
 * }
 * ```
 */
async function getGithubStats() {
  const GITHUB_USERNAME = env.GITHUB_USERNAME;

  if (!GITHUB_USERNAME) {
    return null;
  }

  try {
    const headers = createGithubHeaders();
    const userUrl = `${GITHUB_API_BASE_URL}/users/${GITHUB_USERNAME}`;
    const reposUrl = `${userUrl}/repos?per_page=100`;

    const [userResponse, reposResponse] = await Promise.all([
      fetch(userUrl, { headers }),
      fetch(reposUrl, { headers }),
    ]);

    if (!(userResponse.ok && reposResponse.ok)) {
      Sentry.captureException(
        new Error(`GitHub API error: User ${userResponse.status}, Repos ${reposResponse.status}`),
      );
      return null;
    }

    const user = (await userResponse.json()) as GitHubUser;
    const myRepos = (await reposResponse.json()) as Array<{
      fork: boolean;
      stargazers_count: number;
    }>;

    const filteredRepos = myRepos.filter((repo) => !repo.fork);
    const starsCount = filteredRepos.reduce((acc, curr) => acc + curr.stargazers_count, 0);

    return { user, repos: filteredRepos.length, starsCount };
  } catch (error) {
    Sentry.captureException(error);
    return null;
  }
}

export interface ContributionCountByDay {
  Friday: number;
  Monday: number;
  Saturday: number;
  Sunday: number;
  Thursday: number;
  Tuesday: number;
  Wednesday: number;
}

/**
 * Contribution count for a specific day of the week.
 */
export interface ContributionCountByDayOfWeek {
  count: number;
  day: string;
}

/**
 * Aggregated contribution data.
 */
export interface Contributions {
  contributionCountByDayOfWeek: ContributionCountByDayOfWeek[];
  contributionsByLast30Days: ContributionDay[];
}

/**
 * Fetches GitHub contribution activity for the last 30 days.
 *
 * Queries GitHub GraphQL API to retrieve contribution calendar data
 * and calculates productivity metrics by day of the week.
 *
 * @returns Object containing contribution data and day-of-week statistics
 *
 * @example
 * ```ts
 * const activities = await getGithubActivities();
 * console.log(activities.contributionsByLast30Days);
 * ```
 */
async function getGithubActivities() {
  const GITHUB_USERNAME = env.GITHUB_USERNAME;

  if (!GITHUB_USERNAME) {
    return {
      contributionsByLast30Days: [],
      contributionCountByDayOfWeek: [],
    };
  }

  const contributions: Contributions = {
    contributionsByLast30Days: [],
    contributionCountByDayOfWeek: [],
  };

  const now = new Date();
  const from = formatISO(subDays(now, DAYS_TO_FETCH));
  const to = formatISO(now);
  const q = {
    query: `
    query userInfo($LOGIN: String!, $FROM: DateTime!, $TO: DateTime!) {
              user(login: $LOGIN) {
                name
                contributionsCollection(from: $FROM, to: $TO) {
                  contributionCalendar {
                    weeks {
                      contributionDays {
                        contributionCount
                        date
                      }
                    }
                  }
                }
              }
            }
          `,
    variables: {
      LOGIN: GITHUB_USERNAME,
      FROM: from,
      TO: to,
    },
  };

  const response = await fetch(GITHUB_GRAPHQL_API_URL, {
    method: 'POST',
    body: JSON.stringify(q),
    headers: createGithubHeaders(),
  });

  if (!response.ok) {
    Sentry.captureException(new Error(`GitHub GraphQL API error: ${response.status}`));
    return contributions;
  }

  const apiResponse = await response.json();
  if (apiResponse.errors) {
    Sentry.captureException(new Error(`GitHub GraphQL errors: ${JSON.stringify(apiResponse.errors)}`));
    return contributions;
  }

  const contributionsCollection: ContributionsCollection = apiResponse.data.user.contributionsCollection;

  const contributionWeeks = contributionsCollection.contributionCalendar.weeks;

  for (const week of contributionWeeks) {
    for (const { date, contributionCount } of week.contributionDays) {
      contributions.contributionsByLast30Days.push({
        date,
        contributionCount,
      });
    }
  }

  contributions.contributionCountByDayOfWeek = calculateMostProductiveDayOfWeek(
    contributionsCollection.contributionCalendar,
  );

  return contributions;
}

/**
 * Calculates the most productive day of the week based on contribution data.
 *
 * Aggregates contribution counts by day of the week and returns them
 * in chronological order (Monday through Sunday).
 *
 * @param contributionCalendar - GitHub contribution calendar data
 * @returns Array of day-of-week contribution counts sorted chronologically
 */
function calculateMostProductiveDayOfWeek(
  contributionCalendar: ContributionCalender,
): { day: string; count: number }[] {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const contributionCountByDayOfWeek: ContributionCountByDay = {
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
  };

  for (const week of contributionCalendar.weeks) {
    for (const day of week.contributionDays) {
      const date = new Date(day.date);
      const dayOfWeek = daysOfWeek[date.getUTCDay()] as keyof ContributionCountByDay;
      contributionCountByDayOfWeek[dayOfWeek] += day.contributionCount;
    }
  }

  const sortedData = Object.entries(contributionCountByDayOfWeek)
    .sort((a, b) => daysOfWeek.indexOf(a[0]) - daysOfWeek.indexOf(b[0]))
    .map(([day, count]) => ({ day, count }));

  const sunday = sortedData.shift();

  if (sunday) {
    sortedData.push(sunday);
  }

  return sortedData;
}

export { getGithubActivities, getGithubStats };
