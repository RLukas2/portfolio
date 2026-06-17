// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import
import * as Sentry from '@sentry/node';
import { del, put } from '@vercel/blob';
import { HttpError, InternalServerError, ValidationError } from '@xbrk/errors';
import { generateSlug } from '@xbrk/utils';
import { isValidBase64 } from '../shared/validation';

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const allowedDomains = new Set(['vercel-blob.com', 'blob.vercel-storage.com']);

export async function uploadImage(folder: string, image: string, slug: string): Promise<string> {
  try {
    if (!image?.trim()) {
      throw new ValidationError('Invalid image: empty string provided');
    }

    if (!isValidBase64(image)) {
      throw new ValidationError('Invalid base64 format');
    }

    const imageSize = Buffer.byteLength(image, 'base64');
    if (imageSize > MAX_IMAGE_SIZE) {
      throw new ValidationError(
        `Image exceeds maximum allowed size of ${MAX_IMAGE_SIZE / 1024 / 1024}MB (got ${(imageSize / 1024 / 1024).toFixed(2)}MB)`,
      );
    }

    const safeSlug = generateSlug(slug);
    const fileName = `${safeSlug}-${Date.now()}.avif`;
    const imageBuffer = Buffer.from(image, 'base64');
    const path = `${folder}/${fileName}`;

    const { url } = await put(path, imageBuffer, {
      access: 'public',
      contentType: 'image/avif',
    });
    return url;
  } catch (_error) {
    if (_error instanceof HttpError) {
      throw _error;
    }
    Sentry.captureException(_error);
    throw new InternalServerError('Failed to upload image', { cause: _error as Error });
  }
}

export async function deleteFile(url: string): Promise<void> {
  try {
    if (!url?.trim()) {
      throw new ValidationError('Invalid URL: empty string provided');
    }

    const urlObj = new URL(url);
    if (!allowedDomains.has(urlObj.hostname)) {
      throw new ValidationError('URL does not belong to an allowed storage domain');
    }

    await del(url);
  } catch (_error) {
    if (_error instanceof HttpError) {
      throw _error;
    }
    Sentry.captureException(_error);
    throw new InternalServerError('Failed to delete file', { cause: _error as Error });
  }
}
