import { pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod/v4';
import { validators } from '../lib/validation';

/**
 * Standalone table — no foreign key relations.
 * `stacks` is a text array of technology names associated with the service offering.
 */
export const service = pgTable('service', (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  title: t.varchar({ length: 255 }).notNull(),
  slug: t.varchar({ length: 255 }).notNull().unique(),
  description: t.varchar({ length: 255 }),
  content: t.text(),
  imageUrl: t.varchar({ length: 255 }),
  isDraft: t.boolean().notNull().default(false),
  stacks: t.text().array(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t.timestamp({ mode: 'date', withTimezone: true }).$onUpdate(() => new Date()),
}));

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
