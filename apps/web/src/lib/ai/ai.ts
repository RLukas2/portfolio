import { toolDefinition } from '@tanstack/ai';
import { db } from '@xbrk/db/client';
import { articles, experience, project } from '@xbrk/db/schema';
import { and, desc, eq, ilike, or } from 'drizzle-orm';
import { z } from 'zod';

export interface ToolProject {
  demoUrl?: string | null;
  description?: string | null;
  githubUrl?: string | null;
  id: string;
  isFeatured: boolean;
  slug: string;
  stacks?: string[] | null;
  title: string;
}

export interface ToolArticle {
  createdAt: Date;
  description?: string | null;
  id: string;
  slug: string;
  tags?: string[] | null;
  title: string;
}

export interface ToolExperience {
  description?: string | null;
  endDate?: string | null;
  id: string;
  institution?: string | null;
  isOnGoing: boolean;
  startDate?: string | null;
  title: string;
  type: string | null;
}

const getProjectsDef = toolDefinition({
  name: 'getProjects',
  description:
    'Get all published projects from the database. Use this when the user wants to see all projects or browse the portfolio.',
  inputSchema: z.object({}),
});

const getProjects = getProjectsDef.server(async () => {
  const projects = await db.query.project.findMany({
    orderBy: desc(project.isFeatured),
    where: eq(project.isDraft, false),
    columns: {
      id: true,
      title: true,
      slug: true,
      description: true,
      stacks: true,
      githubUrl: true,
      demoUrl: true,
      isFeatured: true,
    },
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

const searchProjects = searchProjectsDef.server(async ({ query }) => {
  const searchTerm = `%${query}%`;

  const projects = await db.query.project.findMany({
    orderBy: desc(project.isFeatured),
    where: and(
      eq(project.isDraft, false),
      or(ilike(project.title, searchTerm), ilike(project.description, searchTerm)),
    ),
    columns: {
      id: true,
      title: true,
      slug: true,
      description: true,
      stacks: true,
      githubUrl: true,
      demoUrl: true,
      isFeatured: true,
    },
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

const recommendProject = recommendProjectDef.server(async ({ id }) => {
  const proj = await db.query.project.findFirst({
    where: and(eq(project.id, id), eq(project.isDraft, false)),
    columns: {
      id: true,
      title: true,
      slug: true,
      description: true,
      stacks: true,
      githubUrl: true,
      demoUrl: true,
      isFeatured: true,
    },
  });

  if (!proj) {
    throw new Error(`Project with ID ${id} not found`);
  }

  return proj;
});

const getArticlesDef = toolDefinition({
  name: 'getArticles',
  description:
    'Get all published articles from the database. Use this when the user wants to see all blog posts or browse articles.',
  inputSchema: z.object({}),
});

const getArticles = getArticlesDef.server(async () => {
  const blogPosts = await db.query.articles.findMany({
    orderBy: desc(articles.createdAt),
    where: eq(articles.isDraft, false),
    columns: {
      id: true,
      title: true,
      slug: true,
      description: true,
      tags: true,
      createdAt: true,
    },
  });
  return blogPosts;
});

const searchArticlesDef = toolDefinition({
  name: 'searchArticles',
  description:
    'Search for articles based on title, description, or tags. Use this when the user asks about specific topics or technologies mentioned in articles.',
  inputSchema: z.object({
    query: z.string().describe('Search query - can be article titles, descriptions, or tags'),
  }),
});

const searchArticles = searchArticlesDef.server(async ({ query }) => {
  const searchTerm = `%${query}%`;

  const blogPosts = await db.query.articles.findMany({
    orderBy: desc(articles.createdAt),
    where: and(
      eq(articles.isDraft, false),
      or(ilike(articles.title, searchTerm), ilike(articles.description, searchTerm)),
    ),
    columns: {
      id: true,
      title: true,
      slug: true,
      description: true,
      tags: true,
      createdAt: true,
    },
  });

  return blogPosts;
});

const recommendArticleDef = toolDefinition({
  name: 'recommendArticle',
  description:
    "Recommend a specific article by ID. Use this when you want to highlight a particular article that matches the user's interests or when they ask about a specific article.",
  inputSchema: z.object({
    id: z.string().describe('The ID of the article to recommend'),
  }),
});

const recommendArticle = recommendArticleDef.server(async ({ id }) => {
  const article = await db.query.articles.findFirst({
    where: and(eq(articles.id, id), eq(articles.isDraft, false)),
    columns: {
      id: true,
      title: true,
      slug: true,
      description: true,
      tags: true,
      createdAt: true,
    },
  });

  if (!article) {
    throw new Error(`Article with ID ${id} not found`);
  }

  return article;
});

const getExperienceDef = toolDefinition({
  name: 'getExperience',
  description:
    'Get all published experience entries from the database. Use this when the user wants to see work history, education, or other experience.',
  inputSchema: z.object({}),
});

const getExperience = getExperienceDef.server(async () => {
  const experienceList = await db.query.experience.findMany({
    orderBy: desc(experience.id),
    where: eq(experience.isDraft, false),
    columns: {
      id: true,
      title: true,
      description: true,
      institution: true,
      type: true,
      startDate: true,
      endDate: true,
      isOnGoing: true,
    },
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

const searchExperience = searchExperienceDef.server(async ({ query }) => {
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
    columns: {
      id: true,
      title: true,
      description: true,
      institution: true,
      type: true,
      startDate: true,
      endDate: true,
      isOnGoing: true,
    },
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

const recommendExperience = recommendExperienceDef.server(async ({ id }) => {
  const exp = await db.query.experience.findFirst({
    where: and(eq(experience.id, id), eq(experience.isDraft, false)),
    columns: {
      id: true,
      title: true,
      description: true,
      institution: true,
      type: true,
      startDate: true,
      endDate: true,
      isOnGoing: true,
    },
  });

  if (!exp) {
    throw new Error(`Experience with ID ${id} not found`);
  }

  return exp;
});

export default function getTools() {
  return [
    getProjects,
    searchProjects,
    recommendProject,
    getArticles,
    searchArticles,
    recommendArticle,
    getExperience,
    searchExperience,
    recommendExperience,
  ];
}
