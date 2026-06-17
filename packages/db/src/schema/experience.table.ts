import { index, pgEnum, pgTable } from 'drizzle-orm/pg-core';

export const ExperienceType = {
  WORK: 'work',
  EDUCATION: 'education',
  VOLUNTEER: 'volunteer',
  CERTIFICATION: 'certification',
} as const;

export type ExperienceTypeValue = (typeof ExperienceType)[keyof typeof ExperienceType];

export const experienceTypeEnum = pgEnum('experience_type', ['work', 'education', 'volunteer', 'certification']);

export const experience = pgTable(
  'experience',
  (t) => ({
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
    updatedAt: t
      .timestamp({ mode: 'date', withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  }),
  (t) => [
    index('experience_type_idx').on(t.type),
    index('experience_is_draft_idx').on(t.isDraft),
    index('experience_start_date_idx').on(t.startDate),
    index('experience_created_at_idx').on(t.createdAt),
    index('experience_type_is_draft_idx').on(t.type, t.isDraft),
  ],
);
