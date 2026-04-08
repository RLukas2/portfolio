import { z } from 'zod/v4';

/**
 * Validation schema for contact form submissions (client-side).
 *
 * Ensures email is valid and message is within acceptable length.
 *
 * @example
 * ```ts
 * const result = contactSchema.safeParse({
 *   email: 'user@example.com',
 *   message: 'Hello!'
 * });
 * ```
 */
export const contactSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  message: z
    .string()
    .trim()
    .min(2, { message: 'Message must be at least 2 characters' })
    .max(1000, { message: 'Message must be less than 1000 characters' }),
});

/**
 * Extended contact schema with honeypot field for server-side validation
 */
export const contactApiSchema = contactSchema.extend({
  website: z.string().optional(), // Honeypot field
});
