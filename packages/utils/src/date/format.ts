export function formatDate(input: string | number | Date, locale = 'en-US'): string {
  const date = new Date(input);
  return date.toLocaleDateString(locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
