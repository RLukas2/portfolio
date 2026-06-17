import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod/v4';
import { snippet } from '../schema/snippet.table';
import { validators } from './shared';

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
