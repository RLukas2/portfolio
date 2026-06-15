/**
 * Formats a date value into a human-readable string (e.g. "January 1, 2025").
 * Uses `en-US` locale with long month, numeric day and year.
 */
export function formatDate(input: string | number | Date): string {
  const date = new Date(input);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Generates a URL-safe slug from a title string.
 * Removes special characters, replaces spaces with hyphens,
 * collapses consecutive hyphens, and trims whitespace.
 * @example generateSlug("Hello, World!") // "hello-world"
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
};

/**
 * Strips common Markdown syntax from a string, returning plain text.
 * Handles: links, inline code, bold/italic, strikethrough, and HTML tags.
 */
export const stripMarkdown = (text: string): string => {
  return (
    text
      // Remove links [text](url) -> text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove inline code `code` -> code
      .replace(/`([^`]+)`/g, '$1')
      // Remove bold/italic **text** or *text* -> text
      .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')
      // Remove strikethrough ~~text~~ -> text
      .replace(/~~([^~]+)~~/g, '$1')
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Clean up extra whitespace
      .replace(/\s+/g, ' ')
      .trim()
  );
};

/**
 * Estimates reading time for a given content string.
 * Assumes an average reading speed of 200 words per minute.
 * Returns the result rounded up to the nearest minute.
 */
export const calculateReadingTime = (content: string) => {
  const wordsPerMinute = 200;
  const numberOfWords = content.split(/\s/g).length;
  return Math.ceil(numberOfWords / wordsPerMinute);
};
