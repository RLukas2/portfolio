import { toolDefinition } from '@tanstack/ai';
import { db } from '@xbrk/db/client';
import { experience } from '@xbrk/db/schema';
import { and, desc, eq, ilike, or } from 'drizzle-orm';
import { z } from 'zod';

const EXPERIENCE_COLUMNS = {
  id: true,
  title: true,
  description: true,
  institution: true,
  type: true,
  startDate: true,
  endDate: true,
  isOnGoing: true,
} as const;

const getExperienceDef = toolDefinition({
  name: 'getExperience',
  description:
    'Get all published experience entries from the database. Use this when the user wants to see work history, education, or other experience.',
  inputSchema: z.object({}),
});

export const getExperience = getExperienceDef.server(async () => {
  const experienceList = await db.query.experience.findMany({
    orderBy: desc(experience.id),
    where: eq(experience.isDraft, false),
    columns: EXPERIENCE_COLUMNS,
  });
  return experienceList;
});

const searchExperienceDef = toolDefinition({
  name: 'searchExperience',
  description:
    'Search for experience entries based on title, description, institution, or type. Use this when the user asks about specific roles, companies, or types of experience.',
  inputSchema: z.object({
    query: z.string().describe('Search query - can be job titles, company names, or experience types'),
  }),
});

export const searchExperience = searchExperienceDef.server(async ({ query }) => {
  const searchTerm = `%${query.toLowerCase()}%`;

  const experienceList = await db.query.experience.findMany({
    orderBy: desc(experience.id),
    where: and(
      eq(experience.isDraft, false),
      or(
        ilike(experience.title, searchTerm),
        ilike(experience.description, searchTerm),
        ilike(experience.institution, searchTerm),
        ilike(experience.type, searchTerm),
      ),
    ),
    columns: EXPERIENCE_COLUMNS,
  });

  return experienceList;
});

const recommendExperienceDef = toolDefinition({
  name: 'recommendExperience',
  description:
    "Recommend a specific experience entry by ID. Use this when you want to highlight a particular experience that matches the user's interests or when they ask about a specific role.",
  inputSchema: z.object({
    id: z.string().describe('The ID of the experience to recommend'),
  }),
});

export const recommendExperience = recommendExperienceDef.server(async ({ id }) => {
  const exp = await db.query.experience.findFirst({
    where: and(eq(experience.id, id), eq(experience.isDraft, false)),
    columns: EXPERIENCE_COLUMNS,
  });

  if (!exp) {
    throw new Error(`Experience with ID ${id} not found`);
  }

  return exp;
});
