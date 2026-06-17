import { index, pgTable } from 'drizzle-orm/pg-core';
import { contentRenderingColumns } from './_columns';

export const project = pgTable(
  'project',
  (t) => ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    title: t.varchar({ length: 255 }).notNull(),
    slug: t.varchar({ length: 255 }).notNull().unique(),
    description: t.varchar({ length: 255 }),
    content: t.text(),
    ...contentRenderingColumns,
    imageUrl: t.varchar({ length: 255 }),
    isFeatured: t.boolean().notNull().default(false),
    githubUrl: t.varchar({ length: 255 }),
    demoUrl: t.varchar({ length: 255 }),
    isDraft: t.boolean().notNull().default(false),
    stacks: t.text().array(),
    createdAt: t.timestamp().defaultNow().notNull(),
    updatedAt: t
      .timestamp({ mode: 'date', withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  }),
  (t) => [
    index('project_is_draft_idx').on(t.isDraft),
    index('project_is_featured_idx').on(t.isFeatured),
    index('project_created_at_idx').on(t.createdAt),
    index('project_is_draft_is_featured_idx').on(t.isDraft, t.isFeatured),
  ],
);
