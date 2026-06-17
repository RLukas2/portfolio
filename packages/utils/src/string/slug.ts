const INVALID_CHARS = /[^\w\s-]/g;

export const generateSlug = (title: string): string => {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(INVALID_CHARS, '')
    .replace(/[\s_]+/g, ' ')
    .split('-')
    .join(' ')
    .split(' ')
    .filter(Boolean)
    .join('-');

  return slug;
};
