// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import
import * as Sentry from '@sentry/tanstackstart-react';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod/v4';
import { env } from '../env/server';

const RAINDROP_API_URL = 'https://api.raindrop.io/rest/v1';
export const PAGE_SIZE = 4;

// Internal helper — builds fetch options with the Raindrop access token.
// Not exposed as a server function to avoid creating an unnecessary HTTP endpoint.
function getRequestOptions(): RequestInit {
  return {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.RAINDROP_ACCESS_TOKEN}`,
    },
  };
}

export const getCollections = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const response = await fetch(`${RAINDROP_API_URL}/collections`, getRequestOptions());
    return await response.json();
  } catch (error) {
    Sentry.captureException(error);
    return null;
  }
});

export const getCollection = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      id: z.number(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const response = await fetch(`${RAINDROP_API_URL}/collection/${data.id}`, getRequestOptions());
      const collection = await response.json();
      return collection;
    } catch (error) {
      Sentry.captureException(error);
      return null;
    }
  });

export const getBookmarksByCollectionId = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      collectionId: z.number(),
      pageIndex: z.number().optional(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const params = new URLSearchParams({
        page: String(data.pageIndex ?? 0),
        perpage: String(PAGE_SIZE),
      });
      const response = await fetch(`${RAINDROP_API_URL}/raindrops/${data.collectionId}?${params}`, getRequestOptions());
      return await response.json();
    } catch (error) {
      Sentry.captureException(error);
      return [];
    }
  });
