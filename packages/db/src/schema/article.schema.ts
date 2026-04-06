import { relations } from 'drizzle-orm';
import { type AnyPgColumn, pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod/v4';
import { validators } from '../lib/validation';
import { user } from './auth.schema';

/**
 * Relationship map:
 *
 * user ──< articles ──< comments ──< commentReactions
 *                  │         └──< comments (self-ref, replies)
 *                  └──< articleLikes
 *                  └──< articleViews
 *
 * articles   → author  : many-to-one  (articles.authorId → user.id)
 * articles   → comments: one-to-many
 * articles   → views   : one-to-many  (articleViews, one row per visit)
 * articles   → likes   : one-to-many  (articleLikes, keyed by hashed IP as visitorId)
 * comments   → parent  : self-ref     (comments.parentId → comments.id)
 * comments   → reactions: one-to-many (commentReactions)
 */

export const articles = pgTable('articles', (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  title: t.varchar({ length: 255 }).notNull(),
  slug: t.varchar({ length: 255 }).notNull().unique(),
  description: t.varchar({ length: 255 }),
  content: t.text(),
  imageUrl: t.varchar({ length: 255 }),
  isDraft: t.boolean().notNull().default(false),
  tags: t.text().array(),
  authorId: t
    .text()
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t.timestamp({ mode: 'date', withTimezone: true }).$onUpdate(() => new Date()),
}));

export const articleRelations = relations(articles, (t) => ({
  comments: t.many(comments),
  views: t.many(articleViews),
  author: t.one(user, {
    fields: [articles.authorId],
    references: [user.id],
  }),
}));

export const comments = pgTable('comments', (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  articleId: t
    .uuid()
    .references(() => articles.id, { onDelete: 'cascade' })
    .notNull(),
  userId: t
    .text()
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
  content: t.json().notNull(),
  parentId: t.uuid().references((): AnyPgColumn => comments.id, { onDelete: 'cascade' }),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t.timestamp().defaultNow().notNull(),
}));

export const commentReactions = pgTable('comment_reactions', (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  commentId: t
    .uuid()
    .references(() => comments.id, { onDelete: 'cascade' })
    .notNull(),
  userId: t
    .text()
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
  like: t.boolean().notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
}));

export const commentRelations = relations(comments, (t) => ({
  parent: t.one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
  children: t.many(comments),
  reactions: t.many(commentReactions),
  article: t.one(articles, {
    fields: [comments.articleId],
    references: [articles.id],
  }),
  user: t.one(user, {
    fields: [comments.userId],
    references: [user.id],
  }),
}));

export const articleLikes = pgTable('article_likes', (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  articleId: t
    .uuid()
    .references(() => articles.id, { onDelete: 'cascade' })
    .notNull(),
  visitorId: t.text().notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
}));

export const articleViews = pgTable('article_views', (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  articleId: t
    .uuid()
    .references(() => articles.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
}));

export const articleLikeRelations = relations(articleLikes, (t) => ({
  article: t.one(articles, {
    fields: [articleLikes.articleId],
    references: [articles.id],
  }),
}));

export const articleViewRelations = relations(articleViews, (t) => ({
  article: t.one(articles, {
    fields: [articleViews.articleId],
    references: [articles.id],
  }),
}));

export const ArticleBaseSchema = z.object({
  title: validators.title,
  slug: validators.slug,
  description: validators.description,
  content: validators.content,
  thumbnail: validators.thumbnail,
  isDraft: validators.isDraft,
  tags: validators.tags,
});

export const CreateArticleSchema = createInsertSchema(articles, {
  title: ArticleBaseSchema.shape.title,
  slug: ArticleBaseSchema.shape.slug,
  description: ArticleBaseSchema.shape.description,
  content: ArticleBaseSchema.shape.content,
  isDraft: ArticleBaseSchema.shape.isDraft,
  tags: ArticleBaseSchema.shape.tags,
  authorId: z.string(),
})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .and(
    z.object({
      thumbnail: ArticleBaseSchema.shape.thumbnail,
    }),
  );

export const UpdateArticleSchema = createUpdateSchema(articles, {
  id: z.uuid(),
  title: ArticleBaseSchema.shape.title,
  slug: ArticleBaseSchema.shape.slug,
  description: ArticleBaseSchema.shape.description,
  content: ArticleBaseSchema.shape.content,
  isDraft: ArticleBaseSchema.shape.isDraft,
  tags: ArticleBaseSchema.shape.tags,
})
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .and(
    z.object({
      thumbnail: ArticleBaseSchema.shape.thumbnail,
    }),
  );
