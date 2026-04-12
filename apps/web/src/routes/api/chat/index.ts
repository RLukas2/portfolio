import { chat, toServerSentEventsResponse } from '@tanstack/ai';
import { openaiText } from '@tanstack/ai-openai';
import { createFileRoute } from '@tanstack/react-router';
import { handleApiError } from '@xbrk/api';
import { siteConfig } from '@xbrk/config';
import { RateLimitError, ValidationError } from '@xbrk/errors';
import getTools from '@/lib/ai';
import { chatAbuseConfig, validateChatRequest } from '@/lib/ai/abuse-guard';
import { getClientIp, getRateLimitHeaders, rateLimiters } from '@/lib/server/rate-limit';

/**
 * AI Chat API Route
 *
 * Provides an AI-powered chatbot that can answer questions about the portfolio owner's
 * projects, services, articles, and experience.
 *
 * Features:
 * - Natural language conversation
 * - Project search and recommendations
 * - Article search and recommendations
 * - Experience/work history queries
 * - Service information and meeting booking
 *
 * The AI has access to tools for searching and retrieving portfolio content,
 * allowing it to provide specific, accurate information about projects and articles.
 *
 * @example
 * POST /api/chat
 * {
 *   "messages": [
 *     { "role": "user", "content": "What projects use React?" }
 *   ]
 * }
 *
 * @returns Server-sent events stream with AI responses
 */
export const Route = createFileRoute('/api/chat/')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // Rate limiting check
          const clientIp = getClientIp(request);
          if (rateLimiters.chat.isRateLimited(clientIp)) {
            console.warn(`[Chat API] Rate limit exceeded for IP: ${clientIp}`);
            return handleApiError(
              new RateLimitError('Too many chat requests. Please slow down.'),
              request,
              getRateLimitHeaders(rateLimiters.chat, clientIp),
            );
          }

          const { messages } = await request.json();

          // Validate and sanitize messages
          const validation = validateChatRequest(messages, chatAbuseConfig, {
            checkSuspiciousPatterns: true,
            sanitize: true,
          });

          if (!validation.valid) {
            console.warn(`[Chat API] Validation failed for IP ${clientIp}:`, validation.error);
            return handleApiError(
              new ValidationError(validation.error || 'Invalid chat request', {
                details: validation.details,
              }),
              request,
            );
          }

          // Use sanitized messages
          const sanitizedMessages = validation.sanitizedMessages || messages;

          const calendlyUrl = process.env.CALENDLY_URL || siteConfig.calendlyUrl || '';

          const serviceKnowledge = `
You are ${siteConfig.author.name}'s AI assistant. Here's information about ${siteConfig.author.name}'s services and background:

**About ${siteConfig.author.name}:**
- ${siteConfig.author.jobTitle}
- Email: ${siteConfig.author.email}
- Portfolio: ${siteConfig.url}
- GitHub: ${siteConfig.links.github}
- LinkedIn: ${siteConfig.links.linkedin}
- Twitter: ${siteConfig.links.twitter}
- Location: ${siteConfig.author.location}

**Technical Expertise:**
${siteConfig.author.knowsAbout?.map((skill) => `- ${skill}`).join('\n') || '- Full-stack Development'}

**Services Offered:**
1. **Web Application Development**: Custom full-stack web applications using modern technologies
2. **Frontend Development**: React-based user interfaces with TypeScript and modern styling
3. **Backend API Development**: RESTful APIs, GraphQL, tRPC implementations
4. **Technical Consulting**: Architecture review, code optimization, best practices
5. **Performance Optimization**: Web performance auditing and improvements
6. **Database Design**: PostgreSQL, schema design, optimization

${calendlyUrl ? `**Meeting Booking:**\nWhen someone wants to schedule a meeting or consultation, use Calendly at ${calendlyUrl}.\n` : ''}
**Available Tools and When to Use Them:**

**Project Tools:**
- getProjects: Use when user wants to see all projects or browse the portfolio
- searchProjects: Use when user asks about specific technologies (React, TypeScript, etc.), frameworks, or project types. This searches project titles, descriptions, and tech stacks.
- recommendProject: Use when you want to highlight a specific project by ID (after finding it via search)

**Article Tools:**
- getArticles: Use when user wants to see all blog posts or browse articles
- searchArticles: Use when user asks about specific topics, technologies, or concepts mentioned in articles. This searches article titles, descriptions, and tags.
- recommendArticle: Use when you want to highlight a specific article by ID (after finding it via search)

**Experience Tools:**
- getExperience: Use when user wants to see work history, education, or other experience
- searchExperience: Use when user asks about specific roles, companies, or types of experience
- recommendExperience: Use when you want to highlight a specific experience by ID (after finding it via search)

**Tool Usage Strategy:**
1. When users ask about specific technologies or topics, use the search tools first
2. If search returns results, you can then use recommend tools to highlight specific items
3. If users want to browse everything, use the get tools
4. Always provide context and explanations when showing results

Always be helpful, professional, and enthusiastic about ${siteConfig.author.name}'s work. Provide specific examples from their projects and articles when relevant. Direct users to specific URLs for more detailed information.
`;

          const tools = getTools();

          const stream = chat({
            adapter: openaiText('gpt-5-nano'),
            systemPrompts: [serviceKnowledge],
            messages: sanitizedMessages,
            tools,
          });

          return toServerSentEventsResponse(stream);
        } catch (error) {
          console.error('[Chat API] Error:', error);
          return handleApiError(error, request);
        }
      },
    },
  },
});
