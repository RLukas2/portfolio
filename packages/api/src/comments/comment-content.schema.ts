import { z } from 'zod/v4';

const baseJSONContent = z.object({
  type: z.string().optional(),
  attrs: z.record(z.any(), z.any()).optional(),
  marks: z
    .array(
      z.object({
        type: z.string(),
        attrs: z.record(z.any(), z.any()).optional(),
      }),
    )
    .optional(),
  text: z.string().optional(),
});

export const JSONContentSchema: z.ZodType<z.infer<typeof baseJSONContent>> = baseJSONContent.extend({
  content: z.array(z.lazy(() => JSONContentSchema)).optional(),
});
