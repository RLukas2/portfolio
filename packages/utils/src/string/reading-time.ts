const WORDS_REGEX = /\s+/;

export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const numberOfWords = content.split(WORDS_REGEX).filter(Boolean).length;
  return Math.ceil(numberOfWords / wordsPerMinute);
};
