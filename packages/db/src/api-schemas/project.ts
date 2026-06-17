import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod/v4';
import { project } from '../schema/project.table';
import { validators } from './shared';

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
