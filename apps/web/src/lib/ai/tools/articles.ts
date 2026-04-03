import { toolDefinition } from '@tanstack/ai';
import { db } from '@xbrk/db/client';
import { articles } from '@xbrk/db/schema';
import { and, desc, eq, ilike, or } from 'drizzle-orm';
import { z } from 'zod';

const ARTICLE_COLUMNS = {
  id: true,
  title: true,
  slug: true,
  description: true,
  tags: true,
  createdAt: true,
} as const;

const getArticlesDef = toolDefinition({
  name: 'getArticles',
  description:
    'Get all published articles from the database. Use this when the user wants to see all blog posts or browse articles.',
  inputSchema: z.object({}),
});

export const getArticles = getArticlesDef.server(async () => {
  const blogPosts = await db.query.articles.findMany({
    orderBy: desc(articles.createdAt),
    where: eq(articles.isDraft, false),
    columns: ARTICLE_COLUMNS,
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

export const searchArticles = searchArticlesDef.server(async ({ query }) => {
  const searchTerm = `%${query}%`;

  const blogPosts = await db.query.articles.findMany({
    orderBy: desc(articles.createdAt),
    where: and(
      eq(articles.isDraft, false),
      or(ilike(articles.title, searchTerm), ilike(articles.description, searchTerm)),
    ),
    columns: ARTICLE_COLUMNS,
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

export const recommendArticle = recommendArticleDef.server(async ({ id }) => {
  const article = await db.query.articles.findFirst({
    where: and(eq(articles.id, id), eq(articles.isDraft, false)),
    columns: ARTICLE_COLUMNS,
  });

  if (!article) {
    throw new Error(`Article with ID ${id} not found`);
  }

  return article;
});
