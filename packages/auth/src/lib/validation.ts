/**
 * Validation utilities for auth configuration
 */

import { z } from 'zod/v4';

/**
 * Schema for social provider credentials
 */
const SocialProviderSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  clientSecret: z.string().min(1, 'Client secret is required'),
});

/**
 * Schema for initAuth options
 */
export const InitAuthOptionsSchema = z
  .object({
    baseUrl: z.string().url('Base URL must be a valid URL'),
    productionUrl: z.string().url('Production URL must be a valid URL'),
    trustedOrigins: z.array(z.string().url()).optional(),
    secret: z
      .string()
      .min(32, 'Secret must be at least 32 characters for security')
      .optional()
      .refine(
        (val) => {
          // In production, secret is required
          if (process.env.NODE_ENV === 'production') {
            return val !== undefined && val.length >= 32;
          }
          return true;
        },
        {
          message: 'Secret is required in production and must be at least 32 characters',
        },
      ),

    // GitHub OAuth
    githubClientId: z.string().optional(),
    githubClientSecret: z.string().optional(),

    // Twitter OAuth
    twitterClientId: z.string().optional(),
    twitterClientSecret: z.string().optional(),

    // Google OAuth
    googleClientId: z.string().optional(),
    googleClientSecret: z.string().optional(),

    // Facebook OAuth
    facebookClientId: z.string().optional(),
    facebookClientSecret: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Validate GitHub credentials if either is provided
    if (data.githubClientId || data.githubClientSecret) {
      const result = SocialProviderSchema.safeParse({
        clientId: data.githubClientId,
        clientSecret: data.githubClientSecret,
      });
      if (!result.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Both GitHub client ID and secret must be provided',
          path: ['githubClientId'],
        });
      }
    }

    // Validate Twitter credentials if either is provided
    if (data.twitterClientId || data.twitterClientSecret) {
      const result = SocialProviderSchema.safeParse({
        clientId: data.twitterClientId,
        clientSecret: data.twitterClientSecret,
      });
      if (!result.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Both Twitter client ID and secret must be provided',
          path: ['twitterClientId'],
        });
      }
    }

    // Validate Google credentials if either is provided
    if (data.googleClientId || data.googleClientSecret) {
      const result = SocialProviderSchema.safeParse({
        clientId: data.googleClientId,
        clientSecret: data.googleClientSecret,
      });
      if (!result.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Both Google client ID and secret must be provided',
          path: ['googleClientId'],
        });
      }
    }

    // Validate Facebook credentials if either is provided
    if (data.facebookClientId || data.facebookClientSecret) {
      const result = SocialProviderSchema.safeParse({
        clientId: data.facebookClientId,
        clientSecret: data.facebookClientSecret,
      });
      if (!result.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Both Facebook client ID and secret must be provided',
          path: ['facebookClientId'],
        });
      }
    }
  });

export type InitAuthOptions = z.infer<typeof InitAuthOptionsSchema>;

/**
 * Validates auth initialization options
 * @throws {z.ZodError} If validation fails
 */
export function validateAuthOptions(options: unknown): InitAuthOptions {
  return InitAuthOptionsSchema.parse(options);
}
