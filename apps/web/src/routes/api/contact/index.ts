import { createFileRoute } from '@tanstack/react-router';
import { siteConfig } from '@xbrk/config';
import { Resend } from 'resend';
import { env } from '@/lib/env/server';

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
 *   "message": "I'd like to discuss a project..."
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
          const body = (await request.json()) as {
            email?: string;
            message?: string;
          };
          const { email, message } = body;

          // Validate required fields
          if (!(message && email)) {
            return Response.json({ error: 'Missing required fields: email and message are required' }, { status: 400 });
          }

          const resend = new Resend(env.RESEND_API_KEY);

          const { data, error } = await resend.emails.send({
            from: env.RESEND_FROM_EMAIL as string,
            replyTo: email,
            to: [siteConfig.links.mail],
            subject: 'Contact Message',
            text: message,
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
