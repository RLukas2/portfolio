import { pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod/v4';
import { validators } from '../lib/validation';

/**
 * Standalone table — no foreign key relations.
 * `category` groups snippets for filtering (e.g. "React", "CSS").
 * `code` stores raw source code as plain text.
 */
export const snippet = pgTable('snippet', (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  title: t.varchar({ length: 255 }).notNull(),
  slug: t.varchar({ length: 255 }).notNull().unique(),
  description: t.varchar({ length: 255 }),
  category: t.varchar({ length: 255 }),
  code: t.text(),
  isDraft: t.boolean().notNull().default(false),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t.timestamp({ mode: 'date', withTimezone: true }).$onUpdate(() => new Date()),
}));

export const SnippetBaseSchema = z.object({
  title: validators.title,
  slug: validators.slug,
  description: validators.description,
  category: validators.category,
  code: validators.content,
  isDraft: validators.isDraft,
});

export const CreateSnippetSchema = createInsertSchema(snippet, {
  title: SnippetBaseSchema.shape.title,
  slug: SnippetBaseSchema.shape.slug,
  description: SnippetBaseSchema.shape.description,
  category: SnippetBaseSchema.shape.category,
  code: SnippetBaseSchema.shape.code,
  isDraft: SnippetBaseSchema.shape.isDraft,
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateSnippetSchema = createUpdateSchema(snippet, {
  id: z.uuid(),
  title: SnippetBaseSchema.shape.title,
  slug: SnippetBaseSchema.shape.slug,
  description: SnippetBaseSchema.shape.description,
  category: SnippetBaseSchema.shape.category,
  code: SnippetBaseSchema.shape.code,
  isDraft: SnippetBaseSchema.shape.isDraft,
}).omit({
  createdAt: true,
  updatedAt: true,
});
