import { integer, text } from 'drizzle-orm/pg-core';

export const contentRenderingColumns = {
  contentRendering: text('content_rendering'),
  contentRenderingVersion: integer('content_rendering_version').notNull().default(1),
};
