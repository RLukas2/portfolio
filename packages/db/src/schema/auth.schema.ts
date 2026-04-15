import { index, pgTable } from 'drizzle-orm/pg-core';

export const user = pgTable(
  'user',
  (t) => ({
    id: t.text().primaryKey(),
    name: t.text().notNull(),
    email: t.text().notNull().unique(),
    emailVerified: t.boolean().notNull().default(false),
    image: t.text(),
    role: t.text(),
    banned: t.boolean(),
    banReason: t.text(),
    banExpires: t.timestamp(),
    twitterHandle: t.text(),
    createdAt: t.timestamp().notNull(),
    updatedAt: t.timestamp().notNull(),
  }),
  (table) => [index('user_email_idx').on(table.email), index('user_role_idx').on(table.role)],
);

export const session = pgTable(
  'session',
  (t) => ({
    id: t.text().primaryKey(),
    token: t.text().notNull().unique(),
    expiresAt: t.timestamp().notNull(),
    ipAddress: t.text(),
    userAgent: t.text(),
    userId: t
      .text()
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    impersonatedBy: t.text(),
    createdAt: t.timestamp().notNull(),
    updatedAt: t.timestamp().notNull(),
  }),
  (table) => [
    index('session_token_idx').on(table.token),
    index('session_user_id_idx').on(table.userId),
    index('session_expires_at_idx').on(table.expiresAt),
  ],
);

export const account = pgTable(
  'account',
  (t) => ({
    id: t.text().primaryKey(),
    accountId: t.text().notNull(),
    providerId: t.text().notNull(),
    userId: t
      .text()
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    accessToken: t.text(),
    refreshToken: t.text(),
    idToken: t.text(),
    accessTokenExpiresAt: t.timestamp(),
    refreshTokenExpiresAt: t.timestamp(),
    scope: t.text(),
    password: t.text(),
    createdAt: t.timestamp().notNull(),
    updatedAt: t.timestamp().notNull(),
  }),
  (table) => [index('account_user_id_idx').on(table.userId)],
);

export const verification = pgTable(
  'verification',
  (t) => ({
    id: t.text().primaryKey(),
    identifier: t.text().notNull(),
    value: t.text().notNull(),
    expiresAt: t.timestamp().notNull(),
    createdAt: t.timestamp().notNull(),
    updatedAt: t.timestamp().notNull(),
  }),
  (table) => [
    index('verification_identifier_idx').on(table.identifier),
    index('verification_expires_at_idx').on(table.expiresAt),
  ],
);
