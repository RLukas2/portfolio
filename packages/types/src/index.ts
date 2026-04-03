import {
  type articles,
  type commentReactions,
  type comments,
  type experience,
  type guestbook,
  type project,
  type service,
  type snippet,
  type user,
} from '@xbrk/db/schema';
import type { SimpleIcon } from 'simple-icons';

/// === Site Configuration ===
export interface SiteConfig {
  author: {
    name: string;
    email: string;
    url: string;
    handle: string;
    jobTitle?: string;
    location?: string;
    knowsAbout?: string[];
  };
  description: string;
  keywords: string;
  links: {
    mail: string;
    twitter?: string;
    github: string;
    githubRepo: string;
    linkedin?: string;
  };
  name: string;
  title: string;
  url: string;
}

export interface Social {
  icon: SimpleIcon;
  name: string;
  url: string;
  username?: string;
}

/// === Navigation ===

export interface NavItem {
  content?: ContentNavItem[];
  description?: string;
  disabled?: boolean;
  href?: string;
  title: string;
}

export interface ContentNavItem extends NavItem {
  href: string;
}

/// === Auth ===

export interface AuthProvider {
  icon: SimpleIcon;
  label: string;
  provider: string;
}

/// === Schemas from DB ===

export type ProjectType = typeof project.$inferSelect;
export type ExperienceType = typeof experience.$inferSelect;
export type SnippetType = typeof snippet.$inferSelect;
export type ArticleType = typeof articles.$inferSelect;
export type CommentType = typeof comments.$inferSelect;
export type UserType = typeof user.$inferSelect;
export type CommentReactionType = typeof commentReactions.$inferSelect;
export type GuestbookType = typeof guestbook.$inferSelect;
export type ServiceType = typeof service.$inferSelect;

/// === Articles ===

export interface CommentWithRelations {
  comment: CommentType;
  dislikesCount: number;
  likesCount: number;
  repliesCount: number;
  user: UserType | null;
  userReaction: CommentReactionType | null;
}

/// === Contributions Dashboard ===

export interface ContributionCalender {
  weeks: ContributionWeeks[];
}

export interface ContributionWeeks {
  contributionDays: ContributionDay[];
}

export interface ContributionDay {
  contributionCount: number;
  date: string;
}

export interface ContributionsCollection {
  contributionCalendar: ContributionCalender;
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

/// === Uses Data ===

export interface UseData {
  description: string;
  icon: SimpleIcon;
  link: string;
  name: string;
}

/// === Misc ===

export interface TOC {
  depth: number;
  title: string;
  url: string;
}

export interface Collection {
  _id: string;
  count: number;
  description: string;
  slug: string;
  title: string;
}
