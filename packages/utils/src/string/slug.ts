const SPECIAL_CHARS = /[^\w\s-]/g;
const WHITESPACE_OR_HYPHENS = /[\s_-]+/g;
const LEADING_HYPHENS = /^-+/;
const TRAILING_HYPHENS = /-+$/;

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(SPECIAL_CHARS, '')
    .replace(WHITESPACE_OR_HYPHENS, '-')
    .replace(LEADING_HYPHENS, '')
    .replace(TRAILING_HYPHENS, '');
};
