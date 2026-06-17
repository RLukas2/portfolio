const LINK = /\[([^[\]]+)\]\(([^()\s]+)\)/g;
const INLINE_CODE = /`([^`]+)`/g;
const BOLD_ITALIC = /\*{1,2}([^*]+)\*{1,2}/g;
const STRIKETHROUGH = /~~([^~]+)~~/g;
const HTML_TAG = /<[^>]*>/g;

export const stripMarkdown = (text: string): string => {
  let result = text
    .replace(LINK, '$1')
    .replace(INLINE_CODE, '$1')
    .replace(BOLD_ITALIC, '$1')
    .replace(STRIKETHROUGH, '$1');

  // Repeatedly strip HTML tags to handle nested/broken markup (e.g. <<b>script>)
  let prev: string;
  do {
    prev = result;
    result = result.replace(HTML_TAG, '');
  } while (result !== prev);

  // Strip any remaining angle brackets
  result = result.replace(/[<>]/g, '');

  return result.replace(/\s+/g, ' ').trim();
};
