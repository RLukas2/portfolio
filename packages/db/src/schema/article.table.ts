import { relations } from 'drizzle-orm';
import { type AnyPgColumn, index, pgTable, uniqueIndex } from 'drizzle-orm/pg-core';
import { contentRenderingColumns } from './_columns';
import { user } from './auth.table';

export const articles = pgTable(
  'articles',
  (t) => ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    title: t.varchar({ length: 255 }).notNull(),
    slug: t.varchar({ length: 255 }).notNull().unique(),
    description: t.varchar({ length: 255 }),
    content: t.text(),
    ...contentRenderingColumns,
    imageUrl: t.varchar({ length: 255 }),
    isDraft: t.boolean().notNull().default(false),
    tags: t.text().array(),
    authorId: t
      .text()
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: t.timestamp({ mode: 'date', withTimezone: true }).defaultNow().notNull(),
    updatedAt: t
      .timestamp({ mode: 'date', withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  }),
  (t) => [
    index('articles_author_id_idx').on(t.authorId),
    index('articles_is_draft_idx').on(t.isDraft),
    index('articles_created_at_idx').on(t.createdAt),
    index('articles_is_draft_created_at_idx').on(t.isDraft, t.createdAt),
  ],
);

export const articleRelations = relations(articles, (t) => ({
  comments: t.many(comments),
  views: t.many(articleViews),
  author: t.one(user, {
    fields: [articles.authorId],
    references: [user.id],
  }),
}));

export const comments = pgTable(
  'comments',
  (t) => ({
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
    updatedAt: t
      .timestamp({ mode: 'date', withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  }),
  (t) => [
    index('comments_article_id_idx').on(t.articleId),
    index('comments_user_id_idx').on(t.userId),
    index('comments_parent_id_idx').on(t.parentId),
  ],
);

export const commentReactions = pgTable(
  'comment_reactions',
  (t) => ({
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
  }),
  (t) => [
    index('comment_reactions_comment_id_idx').on(t.commentId),
    index('comment_reactions_user_id_idx').on(t.userId),
    uniqueIndex('comment_reactions_comment_id_user_id_idx').on(t.commentId, t.userId),
  ],
);

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

export const articleLikes = pgTable(
  'article_likes',
  (t) => ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    articleId: t
      .uuid()
      .references(() => articles.id, { onDelete: 'cascade' })
      .notNull(),
    visitorId: t.text().notNull(),
    createdAt: t.timestamp().defaultNow().notNull(),
  }),
  (t) => [
    index('article_likes_article_id_idx').on(t.articleId),
    uniqueIndex('article_likes_article_id_visitor_id_idx').on(t.articleId, t.visitorId),
  ],
);

export const articleViews = pgTable(
  'article_views',
  (t) => ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    articleId: t
      .uuid()
      .references(() => articles.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: t.timestamp().defaultNow().notNull(),
  }),
  (t) => [index('article_views_article_id_idx').on(t.articleId)],
);

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
