import { relations } from 'drizzle-orm';
import { index, pgTable } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

/**
 * Relationship map:
 *
 * user ──< guestbook
 *
 * guestbook → user: many-to-one (guestbook.userId → user.id)
 */

export const guestbook = pgTable(
  'guestbook',
  (t) => ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    userId: t
      .text()
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    message: t.text().notNull(),
    createdAt: t.timestamp().defaultNow().notNull(),
    updatedAt: t.timestamp().defaultNow().notNull(),
  }),
  (table) => [index('guestbook_user_id_idx').on(table.userId), index('guestbook_created_at_idx').on(table.createdAt)],
);

export const guestbookRelations = relations(guestbook, (t) => ({
  user: t.one(user, {
    fields: [guestbook.userId],
    references: [user.id],
  }),
}));
