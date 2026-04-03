import { siFacebook, siLinkedin, siX, siYcombinator } from 'simple-icons';

export const SOCIAL_SHARE_PLATFORMS = [
  {
    name: 'Twitter',
    icon: siX,
    getUrl: (url: string, text: string) => `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
  },
  {
    name: 'Facebook',
    icon: siFacebook,
    getUrl: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${url}`,
  },
  {
    name: 'LinkedIn',
    icon: siLinkedin,
    getUrl: (url: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
  },
  {
    name: 'Hacker News',
    icon: siYcombinator,
    getUrl: (url: string) => `https://news.ycombinator.com/submitlink?u=${url}`,
  },
] as const;
