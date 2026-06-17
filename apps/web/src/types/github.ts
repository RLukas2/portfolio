export interface ContributionDay {
  contributionCount: number;
  date: string;
}

export interface ContributionWeeks {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
  weeks: ContributionWeeks[];
}

export interface ContributionsCollection {
  contributionCalendar: ContributionCalendar;
}

export interface GitHubUser {
  avatar_url: string;
  bio: string;
  created_at: string;
  followers: number;
  following: number;
  html_url: string;
  login: string;
  name: string;
  public_repos: number;
  updated_at: string;
}
