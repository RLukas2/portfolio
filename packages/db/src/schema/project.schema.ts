import { pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod/v4';
import { validators } from '../lib/validation';

/**
 * Standalone table — no foreign key relations.
 * `isFeatured` controls display priority on the public portfolio page.
 * `stacks` is a text array of technology names (e.g. ["React", "TypeScript"]).
 */
export const project = pgTable('project', (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  title: t.varchar({ length: 255 }).notNull(),
  slug: t.varchar({ length: 255 }).notNull().unique(),
  description: t.varchar({ length: 255 }),
  content: t.text(),
  imageUrl: t.varchar({ length: 255 }),
  isFeatured: t.boolean().notNull().default(false),
  githubUrl: t.varchar({ length: 255 }),
  demoUrl: t.varchar({ length: 255 }),
  isDraft: t.boolean().notNull().default(false),
  stacks: t.text().array(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t.timestamp({ mode: 'date', withTimezone: true }).$onUpdate(() => new Date()),
}));

export const ProjectBaseSchema = z.object({
  title: validators.title,
  slug: validators.slug,
  description: validators.description,
  content: validators.content,
  thumbnail: validators.thumbnail,
  githubUrl: validators.urlWithMessage('Please enter a valid GitHub URL'),
  demoUrl: validators.urlWithMessage('Please enter a valid demo URL'),
  isFeatured: validators.boolean,
  isDraft: validators.isDraft,
  stacks: validators.stacks,
});

export const CreateProjectSchema = createInsertSchema(project, {
  title: ProjectBaseSchema.shape.title,
  slug: ProjectBaseSchema.shape.slug,
  description: ProjectBaseSchema.shape.description,
  content: ProjectBaseSchema.shape.content,
  githubUrl: ProjectBaseSchema.shape.githubUrl,
  demoUrl: ProjectBaseSchema.shape.demoUrl,
  isFeatured: ProjectBaseSchema.shape.isFeatured,
  isDraft: ProjectBaseSchema.shape.isDraft,
})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .and(
    z.object({
      thumbnail: ProjectBaseSchema.shape.thumbnail,
    }),
  );

export const UpdateProjectSchema = createUpdateSchema(project, {
  id: z.uuid(),
  title: ProjectBaseSchema.shape.title,
  slug: ProjectBaseSchema.shape.slug,
  description: ProjectBaseSchema.shape.description,
  content: ProjectBaseSchema.shape.content,
  githubUrl: ProjectBaseSchema.shape.githubUrl,
  demoUrl: ProjectBaseSchema.shape.demoUrl,
  isFeatured: ProjectBaseSchema.shape.isFeatured,
  isDraft: ProjectBaseSchema.shape.isDraft,
})
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .and(
    z.object({
      thumbnail: ProjectBaseSchema.shape.thumbnail,
    }),
  );
