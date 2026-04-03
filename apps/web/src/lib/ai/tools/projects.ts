import { toolDefinition } from '@tanstack/ai';
import { db } from '@xbrk/db/client';
import { project } from '@xbrk/db/schema';
import { and, desc, eq, ilike, or } from 'drizzle-orm';
import { z } from 'zod';

const PROJECT_COLUMNS = {
  id: true,
  title: true,
  slug: true,
  description: true,
  stacks: true,
  githubUrl: true,
  demoUrl: true,
  isFeatured: true,
} as const;

const getProjectsDef = toolDefinition({
  name: 'getProjects',
  description:
    'Get all published projects from the database. Use this when the user wants to see all projects or browse the portfolio.',
  inputSchema: z.object({}),
});

export const getProjects = getProjectsDef.server(async () => {
  const projects = await db.query.project.findMany({
    orderBy: desc(project.isFeatured),
    where: eq(project.isDraft, false),
    columns: PROJECT_COLUMNS,
  });
  return projects;
});

const searchProjectsDef = toolDefinition({
  name: 'searchProjects',
  description:
    'Search for projects based on technology stack, title, or description. Use this when the user asks about specific technologies, frameworks, or project types.',
  inputSchema: z.object({
    query: z.string().describe('Search query - can be technology names, project titles, or descriptions'),
  }),
});

export const searchProjects = searchProjectsDef.server(async ({ query }) => {
  const searchTerm = `%${query}%`;

  const projects = await db.query.project.findMany({
    orderBy: desc(project.isFeatured),
    where: and(
      eq(project.isDraft, false),
      or(ilike(project.title, searchTerm), ilike(project.description, searchTerm)),
    ),
    columns: PROJECT_COLUMNS,
  });

  return projects;
});

const recommendProjectDef = toolDefinition({
  name: 'recommendProject',
  description:
    "Recommend a specific project by ID. Use this when you want to highlight a particular project that matches the user's interests or when they ask about a specific project.",
  inputSchema: z.object({
    id: z.string().describe('The ID of the project to recommend'),
  }),
});

export const recommendProject = recommendProjectDef.server(async ({ id }) => {
  const proj = await db.query.project.findFirst({
    where: and(eq(project.id, id), eq(project.isDraft, false)),
    columns: PROJECT_COLUMNS,
  });

  if (!proj) {
    throw new Error(`Project with ID ${id} not found`);
  }

  return proj;
});
