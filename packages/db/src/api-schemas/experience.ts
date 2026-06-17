/** biome-ignore-all lint/style/noExportedImports: ExperienceType is used locally in z.enum AND re-exported for convenience */
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod/v4';
import { ExperienceType, type ExperienceTypeValue, experience } from '../schema/experience.table';
import { validators } from './shared';

export { ExperienceType, type ExperienceTypeValue };

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
  )
  .superRefine((data, ctx) => {
    if (data.isOnGoing && data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End date must be empty when ongoing',
        path: ['endDate'],
      });
    }
  });

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
  )
  .superRefine((data, ctx) => {
    if (data.isOnGoing && data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End date must be empty when ongoing',
        path: ['endDate'],
      });
    }
  });
