// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import
import * as Sentry from '@sentry/tanstackstart-react';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod/v4';
import { env } from '../env/server';

const RAINDROP_API_URL = 'https://api.raindrop.io/rest/v1';
export const PAGE_SIZE = 4;

/**
 * Creates request options with Raindrop API authentication.
 * Internal helper for building fetch options with the access token.
 *
 * @returns Fetch request options with authorization headers
 */
function getRequestOptions(): RequestInit {
  return {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.RAINDROP_ACCESS_TOKEN}`,
    },
  };
}

/**
 * Server function to fetch all Raindrop collections.
 *
 * @returns Array of bookmark collections or null on error
 */
export const getCollections = createServerFn({ method: 'GET' }).handler(async () => {
  if (!env.RAINDROP_ACCESS_TOKEN) {
    Sentry.captureException(new Error('Raindrop access token is not set'));
    return null;
  }

  try {
    const response = await fetch(`${RAINDROP_API_URL}/collections`, getRequestOptions());

    if (!response.ok) {
      Sentry.captureException(new Error(`Raindrop API error: ${response.status}`));
      return null;
    }

    return await response.json();
  } catch (error) {
    Sentry.captureException(error);
    return null;
  }
});

/**
 * Server function to fetch a specific Raindrop collection by ID.
 *
 * @param id - The collection ID
 * @returns Collection data or null on error
 */
export const getCollection = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      id: z.number(),
    }),
  )
  .handler(async ({ data }) => {
    if (!env.RAINDROP_ACCESS_TOKEN) {
      Sentry.captureException(new Error('Raindrop access token is not set'));
      return null;
    }

    try {
      const response = await fetch(`${RAINDROP_API_URL}/collection/${data.id}`, getRequestOptions());

      if (!response.ok) {
        Sentry.captureException(new Error(`Raindrop API error: ${response.status}`));
        return null;
      }

      const collection = await response.json();
      return collection;
    } catch (error) {
      Sentry.captureException(error);
      return null;
    }
  });

/**
 * Server function to fetch bookmarks from a specific collection.
 * Supports pagination.
 *
 * @param collectionId - The collection ID
 * @param pageIndex - Page number for pagination (optional, defaults to 0)
 * @returns Array of bookmarks or empty array on error
 */
export const getBookmarksByCollectionId = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      collectionId: z.number(),
      pageIndex: z.number().optional(),
    }),
  )
  .handler(async ({ data }) => {
    if (!env.RAINDROP_ACCESS_TOKEN) {
      Sentry.captureException(new Error('Raindrop access token is not set'));
      return null;
    }

    try {
      const params = new URLSearchParams({
        page: String(data.pageIndex ?? 0),
        perpage: String(PAGE_SIZE),
      });
      const response = await fetch(`${RAINDROP_API_URL}/raindrops/${data.collectionId}?${params}`, getRequestOptions());

      if (!response.ok) {
        Sentry.captureException(new Error(`Raindrop API error: ${response.status}`));
        return [];
      }

      return await response.json();
    } catch (error) {
      Sentry.captureException(error);
      return [];
    }
  });
