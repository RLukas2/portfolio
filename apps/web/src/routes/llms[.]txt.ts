import { createFileRoute } from '@tanstack/react-router';
import { siteConfig, socialConfig } from '@xbrk/config';

export const Route = createFileRoute('/llms.txt')({
  server: {
    handlers: {
      GET: () => {
        const socialLinks = socialConfig.map((social) => `- ${social.name}: ${social.url}`).join('\n');

        const content = `# ${siteConfig.title} - Portfolio

> ${siteConfig.description}

## About

Hello, World!

## Pages

- Home: ${siteConfig.url}/

## Contact

- Email: ${siteConfig.author.email}
- Website: ${siteConfig.author.url}
${socialLinks}
`;

        return new Response(content, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
          },
        });
      },
    },
  },
});
