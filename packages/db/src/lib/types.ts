/**
 * Inferred types from database tables
 * These types are automatically generated from the Drizzle schema definitions
 */

import type { articleLikes, articles, articleViews, commentReactions, comments } from '../schema/article.schema';
import type { account, session, user, verification } from '../schema/auth.schema';
import type { experience } from '../schema/experience.schema';
import type { guestbook } from '../schema/guestbook.schema';
import type { project } from '../schema/project.schema';
import type { service } from '../schema/service.schema';
import type { snippet } from '../schema/snippet.schema';

// Article types
export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;

export type CommentReaction = typeof commentReactions.$inferSelect;
export type NewCommentReaction = typeof commentReactions.$inferInsert;

export type ArticleLike = typeof articleLikes.$inferSelect;
export type NewArticleLike = typeof articleLikes.$inferInsert;

export type ArticleView = typeof articleViews.$inferSelect;
export type NewArticleView = typeof articleViews.$inferInsert;

// Auth types
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;

export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;

export type Verification = typeof verification.$inferSelect;
export type NewVerification = typeof verification.$inferInsert;

// Experience types
export type Experience = typeof experience.$inferSelect;
export type NewExperience = typeof experience.$inferInsert;

// Guestbook types
export type Guestbook = typeof guestbook.$inferSelect;
export type NewGuestbook = typeof guestbook.$inferInsert;

// Project types
export type Project = typeof project.$inferSelect;
export type NewProject = typeof project.$inferInsert;

// Service types
export type Service = typeof service.$inferSelect;
export type NewService = typeof service.$inferInsert;

// Snippet types
export type Snippet = typeof snippet.$inferSelect;
export type NewSnippet = typeof snippet.$inferInsert;
