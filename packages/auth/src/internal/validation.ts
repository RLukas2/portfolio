import { z } from 'zod/v4';
import { PROVIDER_CONFIGS } from './providers';

const SocialProviderSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  clientSecret: z.string().min(1, 'Client secret is required'),
});

export const InitAuthOptionsSchema = z
  .object({
    baseUrl: z.string().url('Base URL must be a valid URL'),
    productionUrl: z.string().url('Production URL must be a valid URL'),
    secret: z
      .string()
      .min(32, 'Secret must be at least 32 characters for security')
      .optional()
      .refine(
        (val) => {
          if (process.env.NODE_ENV === 'production') {
            return val !== undefined && val.length >= 32;
          }
          return true;
        },
        {
          message: 'Secret is required in production and must be at least 32 characters',
        },
      ),

    githubClientId: z.string().optional(),
    githubClientSecret: z.string().optional(),

    twitterClientId: z.string().optional(),
    twitterClientSecret: z.string().optional(),

    googleClientId: z.string().optional(),
    googleClientSecret: z.string().optional(),

    facebookClientId: z.string().optional(),
    facebookClientSecret: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    for (const config of PROVIDER_CONFIGS) {
      const idValue = data[config.clientIdField];
      const secretValue = data[config.clientSecretField];

      if (idValue || secretValue) {
        const result = SocialProviderSchema.safeParse({
          clientId: idValue,
          clientSecret: secretValue,
        });
        if (!result.success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Both ${config.key} client ID and secret must be provided`,
            path: [config.clientIdField],
          });
        }
      }
    }
  });

export type InitAuthOptions = z.infer<typeof InitAuthOptionsSchema>;

export function validateAuthOptions(options: unknown): InitAuthOptions {
  return InitAuthOptionsSchema.parse(options);
}
