import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod/v4';
import { service } from '../schema/service.table';
import { validators } from './shared';

export const ServiceBaseSchema = z.object({
  title: validators.title,
  slug: validators.slug,
  description: validators.description,
  content: validators.content,
  thumbnail: validators.thumbnail,
  isDraft: validators.isDraft,
  stacks: validators.stacks,
});

export const CreateServiceSchema = createInsertSchema(service, {
  title: ServiceBaseSchema.shape.title,
  slug: ServiceBaseSchema.shape.slug,
  description: ServiceBaseSchema.shape.description,
  content: ServiceBaseSchema.shape.content,
  isDraft: ServiceBaseSchema.shape.isDraft,
})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .and(
    z.object({
      thumbnail: ServiceBaseSchema.shape.thumbnail,
    }),
  );

export const UpdateServiceSchema = createUpdateSchema(service, {
  id: z.uuid(),
  title: ServiceBaseSchema.shape.title,
  slug: ServiceBaseSchema.shape.slug,
  description: ServiceBaseSchema.shape.description,
  content: ServiceBaseSchema.shape.content,
  isDraft: ServiceBaseSchema.shape.isDraft,
})
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .and(
    z.object({
      thumbnail: ServiceBaseSchema.shape.thumbnail,
    }),
  );
