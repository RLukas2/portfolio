import { chat, toServerSentEventsResponse } from '@tanstack/ai';
import { openaiText } from '@tanstack/ai-openai';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { authMiddleware } from '@/lib/auth/middleware';

/**
 * AI assistance types for blog post creation
 */
type AssistType = 'title' | 'description' | 'tags' | 'content' | 'outline' | 'expand';

/**
 * Context information provided to the AI for generating content
 */
interface AssistContext {
  /** Current blog post content (for context) */
  currentContent?: string;
  /** Blog post description */
  description?: string;
  /** Text selected by user for expansion */
  selectedText?: string;
  /** Existing tags */
  tags?: string[];
  /** Blog post title */
  title?: string;
  /** Main topic or subject */
  topic?: string;
}

const assistContextSchema = z.object({
  topic: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  currentContent: z.string().optional(),
  selectedText: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const requestSchema = z.object({
  type: z.enum(['title', 'description', 'tags', 'content', 'outline', 'expand']),
  context: assistContextSchema,
});

// Content preview limits for context
const CONTENT_PREVIEW_LENGTH = 500;
const SHORT_CONTENT_PREVIEW_LENGTH = 300;

// Token limits for AI responses
const MAX_TOKENS_LONG = 2000;
const MAX_TOKENS_SHORT = 500;

/**
 * System prompts for each assistance type
 * These define the AI's role and output format for each task
 */
const SYSTEM_PROMPTS: Record<AssistType, string> = {
  title:
    'You are a creative blog title generator. Generate 5 compelling, SEO-friendly blog post titles based on the given topic. Make them engaging, clear, and attention-grabbing. Each title should be on a new line and numbered.',
  description:
    'You are an expert at writing concise, compelling blog post descriptions. Write a 2-3 sentence description that summarizes the article and entices readers. Make it SEO-friendly and engaging. Max characters: 255.',
  tags: 'You are a technical content tagger. Based on the blog post topic and content, suggest 5-8 relevant tags. Focus on technologies, frameworks, concepts, and topics. Return ONLY the tags as a comma-separated list (e.g., "React, TypeScript, Web Development").',
  content:
    'You are a technical blog writer specializing in software development and web technologies. Write detailed, informative, and engaging content in MDX format. Use proper markdown formatting with headers, code blocks, lists, and emphasis where appropriate. Focus on clarity, technical accuracy, and practical examples.',
  outline:
    'You are a content strategist. Create a detailed blog post outline with main sections and subsections. Format as markdown with ## for main sections and - for bullet points under each section.',
  expand:
    'You are a technical writer. Expand the selected text with more detail, examples, and explanations. Maintain the same tone and style. Write in MDX format with proper markdown formatting.',
};

/**
 * Builds the user prompt based on assistance type and context
 *
 * @param type - The type of assistance requested
 * @param context - Context information for generating the prompt
 * @returns Formatted prompt string for the AI
 */
function buildUserPrompt(type: AssistType, context: AssistContext): string {
  switch (type) {
    case 'title':
      return `Generate 5 blog post title ideas for: ${context.topic}`;
    case 'description': {
      const contentContext = context.currentContent
        ? `\n\nContext from the article:\n${context.currentContent.slice(0, CONTENT_PREVIEW_LENGTH)}...`
        : '';
      return `Write a compelling description for a blog post titled "${context.title}"${contentContext}`;
    }
    case 'tags': {
      const contentPreview = context.currentContent
        ? `\nContent preview: ${context.currentContent.slice(0, SHORT_CONTENT_PREVIEW_LENGTH)}...`
        : '';
      return `Suggest relevant tags for:\nTitle: ${context.title}\nDescription: ${context.description}${contentPreview}`;
    }
    case 'content': {
      const titlePart = context.title ? `\nTitle: ${context.title}` : '';
      const descPart = context.description ? `\nDescription: ${context.description}` : '';
      return `Write a complete blog post about: ${context.topic}${titlePart}${descPart}`;
    }
    case 'outline': {
      const titlePart = context.title ? `\nTitle: ${context.title}` : '';
      const descPart = context.description ? `\nDescription: ${context.description}` : '';
      return `Create a detailed outline for a blog post:\nTopic: ${context.topic}${titlePart}${descPart}`;
    }
    case 'expand':
      return `Expand this section with more detail:\n\n${context.selectedText}`;
    default:
      return '';
  }
}

/**
 * AI Blog Assist API Route
 *
 * Provides AI-powered assistance for blog post creation including:
 * - Title generation
 * - Description writing
 * - Tag suggestions
 * - Content generation
 * - Outline creation
 * - Text expansion
 *
 * Protected by authentication middleware - requires valid session.
 *
 * @example
 * POST /api/ai/blog-assist
 * {
 *   "type": "title",
 *   "context": { "topic": "React Server Components" }
 * }
 *
 * @returns Server-sent events stream with AI-generated content
 */
export const Route = createFileRoute('/api/ai/blog-assist/')({
  server: {
    middleware: [authMiddleware],
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();

          // TanStack AI sends { messages, data } where data contains our custom fields
          const payload = body.data ?? body;

          // Validate request body
          const validation = requestSchema.safeParse(payload);
          if (!validation.success) {
            return new Response(
              JSON.stringify({
                error: 'Invalid request',
                details: validation.error.format(),
              }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              },
            );
          }

          const { type, context } = validation.data;

          const userPrompt = buildUserPrompt(type, context);
          const maxTokens = type === 'content' || type === 'expand' ? MAX_TOKENS_LONG : MAX_TOKENS_SHORT;

          const stream = chat({
            adapter: openaiText('gpt-4o-mini'),
            systemPrompts: [SYSTEM_PROMPTS[type]],
            messages: [{ role: 'user', content: userPrompt }],
            maxTokens,
          });

          return toServerSentEventsResponse(stream);
        } catch (error) {
          console.error('AI blog assist error:', error);

          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          const details = process.env.NODE_ENV === 'development' ? errorMessage : undefined;

          return new Response(
            JSON.stringify({
              error: 'Failed to generate content',
              details,
            }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            },
          );
        }
      },
    },
  },
});
