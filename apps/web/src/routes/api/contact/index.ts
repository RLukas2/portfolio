import { createFileRoute } from '@tanstack/react-router';
import { createSuccessResponse, handleApiError } from '@xbrk/api';
import { siteConfig } from '@xbrk/config';
import { RateLimitError, ServiceUnavailableError, ValidationError } from '@xbrk/errors';
import { Resend } from 'resend';
import { env } from '@/lib/env/server';
import { getClientIp, getRateLimitHeaders, rateLimiters } from '@/lib/server/rate-limit';
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
          return handleApiError(new ServiceUnavailableError('Email service is not configured'), request);
        }

        try {
          // Rate limiting check
          const clientIp = getClientIp(request);
          if (rateLimiters.contact.isRateLimited(clientIp)) {
            console.warn(`[Contact API] Rate limit exceeded for IP: ${clientIp}`);
            return handleApiError(
              new RateLimitError('Too many contact form submissions. Please try again later.'),
              request,
              getRateLimitHeaders(rateLimiters.contact, clientIp),
            );
          }

          const body = await request.json();

          // Validate request body with Zod
          const validationResult = contactApiSchema.safeParse(body);

          if (!validationResult.success) {
            return handleApiError(
              new ValidationError('Invalid input', {
                details: validationResult.error.flatten(),
              }),
              request,
            );
          }

          const { email, message, website } = validationResult.data;

          // Honeypot check - if website field is filled, it's likely a bot
          if (website && website.trim() !== '') {
            console.warn(`[Contact API] Honeypot triggered for IP: ${clientIp}`);
            // Return success to not alert the bot
            return createSuccessResponse({ success: true });
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
            return handleApiError(new ServiceUnavailableError('Failed to send email'), request);
          }

          return createSuccessResponse({ success: true, emailId: data?.id });
        } catch (error) {
          console.error('[Contact API] Unexpected error:', error);
          return handleApiError(error, request);
        }
      },
    },
  },
});
