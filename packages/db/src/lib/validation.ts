import { z } from 'zod/v4';

/**
 * Shared validation utilities for database schemas
 */

// Common regex patterns
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Common field validators
export const validators = {
  title: z.string().min(1, 'Title is required').max(255, 'Title cannot exceed 255 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(255, 'Slug cannot exceed 255 characters')
    .regex(SLUG_REGEX, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().max(255, 'Description cannot exceed 255 characters').or(z.literal('')),
  content: z.string().or(z.literal('')),
  url: z.string().url().or(z.literal('')),
  urlWithMessage: (message: string) => z.string().url(message).max(255).or(z.literal('')),
  isDraft: z.boolean().or(z.literal(false)),
  thumbnail: z.string().describe('File upload for thumbnail'),
  tags: z.array(z.string()),
  stacks: z.array(z.string()),
  category: z.string().min(1, 'Category is required').max(255, 'Category cannot exceed 255 characters'),
  institution: z.string().max(255, 'Institution cannot exceed 255 characters').or(z.literal('')),
  date: z.string().or(z.literal('')),
  boolean: z.boolean().or(z.literal(false)),
};
