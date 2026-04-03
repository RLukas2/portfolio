import { pgEnum, pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod/v4';
import { validators } from '../lib/validation';

/**
 * Standalone table — no foreign key relations.
 * `type` is a pg enum (`experience_type`) with values: work, education, volunteer, certification.
 * `isOnGoing` indicates the experience has no end date yet.
 */

export const ExperienceType = {
  WORK: 'work',
  EDUCATION: 'education',
  VOLUNTEER: 'volunteer',
  CERTIFICATION: 'certification',
} as const;

export type ExperienceTypeValue = (typeof ExperienceType)[keyof typeof ExperienceType];

export const experienceTypeEnum = pgEnum('experience_type', ['work', 'education', 'volunteer', 'certification']);

export const experience = pgTable('experience', (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  title: t.varchar({ length: 255 }).notNull(),
  description: t.varchar({ length: 255 }),
  imageUrl: t.varchar({ length: 255 }),
  startDate: t.date({ mode: 'string' }),
  endDate: t.date({ mode: 'string' }),
  institution: t.varchar({ length: 255 }),
  url: t.varchar({ length: 255 }),
  type: experienceTypeEnum('type').default(ExperienceType.WORK),
  isDraft: t.boolean().notNull().default(false),
  isOnGoing: t.boolean().notNull().default(false),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t.timestamp({ mode: 'date', withTimezone: true }).$onUpdate(() => new Date()),
}));

export const ExperienceBaseSchema = z.object({
  title: validators.title,
  description: validators.description,
  startDate: validators.date,
  endDate: validators.date,
  institution: validators.institution,
  url: validators.url,
  type: z.enum([ExperienceType.WORK, ExperienceType.EDUCATION, ExperienceType.VOLUNTEER, ExperienceType.CERTIFICATION]),
  isDraft: validators.isDraft,
  isOnGoing: validators.boolean,
  thumbnail: validators.thumbnail,
});

export const CreateExperienceSchema = createInsertSchema(experience, {
  title: ExperienceBaseSchema.shape.title,
  description: ExperienceBaseSchema.shape.description,
  startDate: ExperienceBaseSchema.shape.startDate,
  endDate: ExperienceBaseSchema.shape.endDate,
  institution: ExperienceBaseSchema.shape.institution,
  url: ExperienceBaseSchema.shape.url,
  type: ExperienceBaseSchema.shape.type,
  isDraft: ExperienceBaseSchema.shape.isDraft,
  isOnGoing: ExperienceBaseSchema.shape.isOnGoing,
})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .and(
    z.object({
      thumbnail: ExperienceBaseSchema.shape.thumbnail,
    }),
  );

export const UpdateExperienceSchema = createUpdateSchema(experience, {
  id: z.uuid(),
  title: ExperienceBaseSchema.shape.title,
  description: ExperienceBaseSchema.shape.description,
  startDate: ExperienceBaseSchema.shape.startDate,
  endDate: ExperienceBaseSchema.shape.endDate,
  institution: ExperienceBaseSchema.shape.institution,
  url: ExperienceBaseSchema.shape.url,
  type: ExperienceBaseSchema.shape.type,
  isDraft: ExperienceBaseSchema.shape.isDraft,
  isOnGoing: ExperienceBaseSchema.shape.isOnGoing,
})
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .and(
    z.object({
      thumbnail: ExperienceBaseSchema.shape.thumbnail,
    }),
  );
