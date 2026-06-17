import { index, pgTable } from 'drizzle-orm/pg-core';
import { contentRenderingColumns } from './_columns';

export const snippet = pgTable(
  'snippet',
  (t) => ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    title: t.varchar({ length: 255 }).notNull(),
    slug: t.varchar({ length: 255 }).notNull().unique(),
    description: t.varchar({ length: 255 }),
    category: t.varchar({ length: 255 }),
    code: t.text(),
    ...contentRenderingColumns,
    isDraft: t.boolean().notNull().default(false),
    createdAt: t.timestamp().defaultNow().notNull(),
    updatedAt: t
      .timestamp({ mode: 'date', withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  }),
  (t) => [
    index('snippet_category_idx').on(t.category),
    index('snippet_is_draft_idx').on(t.isDraft),
    index('snippet_created_at_idx').on(t.createdAt),
  ],
);
