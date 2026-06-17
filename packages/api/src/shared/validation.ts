const BASE64_REGEX = /^[A-Za-z0-9+/=]+$/;
const MIN_SEARCH_QUERY_LENGTH = 2;
const MAX_SEARCH_QUERY_LENGTH = 200;

export function isValidBase64(str: string): boolean {
  if (!str?.trim()) {
    return false;
  }
  return BASE64_REGEX.test(str);
}

export function validateSearchQuery(query: string): { valid: boolean; error?: string } {
  if (!query?.trim()) {
    return { valid: false, error: 'Search query cannot be empty' };
  }

  if (query.length < MIN_SEARCH_QUERY_LENGTH) {
    return {
      valid: false,
      error: `Search query must be at least ${MIN_SEARCH_QUERY_LENGTH} characters`,
    };
  }

  if (query.length > MAX_SEARCH_QUERY_LENGTH) {
    return {
      valid: false,
      error: `Search query must not exceed ${MAX_SEARCH_QUERY_LENGTH} characters`,
    };
  }

  return { valid: true };
}

export function escapeSearchTerm(term: string): string {
  return term.replace(/[%_\\]/g, (char) => `\\${char}`);
}
