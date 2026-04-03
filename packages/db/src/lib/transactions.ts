import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { NeonHttpQueryResultHKT } from 'drizzle-orm/neon-http';
import type { PgTransaction } from 'drizzle-orm/pg-core';
import { db } from '../client';
import type * as schema from '../schema';

/**
 * Transaction utilities for database operations
 */

type Schema = typeof schema;
type TransactionClient = PgTransaction<NeonHttpQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>;

type TransactionCallback<T> = (tx: TransactionClient) => Promise<T>;

/**
 * Execute a function within a database transaction
 * Automatically rolls back on error
 *
 * @example
 * ```ts
 * const result = await withTransaction(async (tx) => {
 *   const article = await tx.insert(articles).values(data).returning();
 *   await tx.insert(articleViews).values({ articleId: article[0].id });
 *   return article[0];
 * });
 * ```
 */
export function withTransaction<T>(callback: TransactionCallback<T>): Promise<T> {
  return db.transaction(callback);
}

/**
 * Execute multiple operations in a transaction
 * Returns an array of results in the same order as operations
 *
 * @example
 * ```ts
 * const [article, view] = await executeInTransaction([
 *   (tx) => tx.insert(articles).values(articleData).returning(),
 *   (tx) => tx.insert(articleViews).values(viewData).returning(),
 * ]);
 * ```
 */
export function executeInTransaction<T extends unknown[]>(
  operations: {
    [K in keyof T]: TransactionCallback<T[K]>;
  },
): Promise<T> {
  return db.transaction(async (tx) => {
    const results = await Promise.all(operations.map((op) => op(tx)));
    return results as T;
  });
}
