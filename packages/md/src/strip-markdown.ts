export const stripMarkdown = (text: string): string => {
  return text
    .replace(/\[([^[\]]+)\]\(([^()\s]+)\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};
