import { createFileRoute } from '@tanstack/react-router';
import { siteConfig } from '@xbrk/config';
import { Resend } from 'resend';
import { env } from '@/lib/env/server';
import { createRateLimitResponse, getClientIp, rateLimiters } from '@/lib/server/rate-limit';
import { contactApiSchema } from '@/lib/validators';

/**
 * Sanitize text to prevent XSS and injection attacks
 */
function sanitizeText(text: string): string {
  return text
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .trim();
}

/**
 * Contact Form API Route
 *
 * Handles contact form submissions by sending emails via Resend.
 * The email is sent to the site owner with the visitor's message and reply-to address.
 *
 * Required environment variables:
 * - RESEND_API_KEY: API key for Resend service
 * - RESEND_FROM_EMAIL: Verified sender email address
 *
 * @example
 * POST /api/contact
 * {
 *   "email": "user@example.com",
 *   "message": "I'd like to discuss a project...",
 *   "website": "" // Honeypot field - should be empty
 * }
 *
 * @returns JSON response with email delivery status
 */
export const Route = createFileRoute('/api/contact/')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Check if email service is configured
        if (!(env.RESEND_API_KEY && env.RESEND_FROM_EMAIL)) {
          console.error('[Contact API] Email service not configured');
          return Response.json({ error: 'Email service is not configured' }, { status: 500 });
        }

        try {
          // Rate limiting check
          const clientIp = getClientIp(request);
          if (rateLimiters.contact.isRateLimited(clientIp)) {
            console.warn(`[Contact API] Rate limit exceeded for IP: ${clientIp}`);
            return createRateLimitResponse(rateLimiters.contact, clientIp);
          }

          const body = await request.json();

          // Validate request body with Zod
          const validationResult = contactApiSchema.safeParse(body);

          if (!validationResult.success) {
            return Response.json(
              {
                error: 'Invalid input',
                details: env.NODE_ENV === 'development' ? validationResult.error.flatten() : undefined,
              },
              { status: 400 },
            );
          }

          const { email, message, website } = validationResult.data;

          // Honeypot check - if website field is filled, it's likely a bot
          if (website && website.trim() !== '') {
            console.warn(`[Contact API] Honeypot triggered for IP: ${clientIp}`);
            // Return success to not alert the bot
            return Response.json({ success: true });
          }

          // Sanitize inputs
          const sanitizedEmail = sanitizeText(email);
          const sanitizedMessage = sanitizeText(message);

          const resend = new Resend(env.RESEND_API_KEY);

          const { data, error } = await resend.emails.send({
            from: env.RESEND_FROM_EMAIL as string,
            replyTo: sanitizedEmail,
            to: [siteConfig.links.mail],
            subject: 'Contact Message',
            text: sanitizedMessage,
          });

          if (error) {
            console.error('[Contact API] Resend error:', error);
            return Response.json(
              {
                error: 'Failed to send email',
                details: env.NODE_ENV === 'development' ? error : undefined,
              },
              { status: 500 },
            );
          }

          return Response.json({ success: true, data });
        } catch (error) {
          console.error('[Contact API] Unexpected error:', error);

          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          return Response.json(
            {
              error: 'Failed to process contact form',
              details: env.NODE_ENV === 'development' ? errorMessage : undefined,
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
