import { index, pgTable } from 'drizzle-orm/pg-core';
import { contentRenderingColumns } from './_columns';

export const service = pgTable(
  'service',
  (t) => ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    title: t.varchar({ length: 255 }).notNull(),
    slug: t.varchar({ length: 255 }).notNull().unique(),
    description: t.varchar({ length: 255 }),
    content: t.text(),
    ...contentRenderingColumns,
    imageUrl: t.varchar({ length: 255 }),
    isDraft: t.boolean().notNull().default(false),
    stacks: t.text().array(),
    createdAt: t.timestamp().defaultNow().notNull(),
    updatedAt: t
      .timestamp({ mode: 'date', withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  }),
  (t) => [index('service_is_draft_idx').on(t.isDraft), index('service_created_at_idx').on(t.createdAt)],
);
