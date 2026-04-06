import { PostHogProvider } from '@posthog/react';
import { type QueryClient } from '@tanstack/react-query';
import { ClientOnly, createRootRouteWithContext, HeadContent, Scripts } from '@tanstack/react-router';
import { createIsomorphicFn } from '@tanstack/react-start';
import { DevtoolsComponent } from '@xbrk/shared/dev-tools';
import { ThemeProvider, useTheme } from '@xbrk/shared/theme-provider';
import { Toaster } from '@xbrk/ui/sonner';
import posthog from 'posthog-js';
import { CookieBanner } from '@/components/analytics/cookie-banner';
import { RouteProgress } from '@/components/shared/route-progress';
import { type AuthQueryResult, authQueryOptions } from '@/lib/auth/queries';
import { env } from '@/lib/env/client';
import printCss from '@/print.css?url';
import appCss from '@/style.css?url';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  user: AuthQueryResult;
}>()({
  beforeLoad: async ({ context }) => {
    try {
      const user = await context.queryClient.ensureQueryData({
        ...authQueryOptions(),
        revalidateIfStale: true,
      });
      return { user };
    } catch (error) {
      console.error('Error fetching user data:', error);
      return { user: null };
    }
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        name: 'theme-color',
        content: '#ffffff',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
        as: 'style',
        type: 'text/css',
      },
      {
        rel: 'stylesheet',
        href: printCss,
        media: 'print',
        type: 'text/css',
      },
      // Favicon links
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/favicon.svg',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      // Web App Manifest
      {
        rel: 'manifest',
        href: '/site.webmanifest',
      },
      // Preconnect to external domains for better performance
      {
        rel: 'preconnect',
        href: 'https://api.github.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'dns-prefetch',
        href: 'https://api.raindrop.io',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://cdn.jsdelivr.net',
        crossOrigin: 'anonymous',
      },
    ],
  }),
  staleTime: Number.POSITIVE_INFINITY,
  shellComponent: ({ children }) => {
    return (
      <ThemeProvider>
        <ShellComponent>{children}</ShellComponent>
      </ThemeProvider>
    );
  },
});

/// === PostHog ===

const initPostHog = createIsomorphicFn().client(() => {
  const VITE_POSTHOG_KEY = env.VITE_POSTHOG_KEY;
  const VITE_POSTHOG_HOST = env.VITE_POSTHOG_HOST;

  if (!(VITE_POSTHOG_KEY && VITE_POSTHOG_HOST)) {
    console.warn('PostHog is not initialized because VITE_POSTHOG_KEY or VITE_POSTHOG_HOST is not set');

    return;
  }

  posthog.init(VITE_POSTHOG_KEY, {
    api_host: VITE_POSTHOG_HOST,
    defaults: '2026-01-30',
    cookieless_mode: 'on_reject',
    disable_external_dependency_loading: true,
  });

  posthog.capture('my_custom_event', { property: 'value' });
});

initPostHog();

/// === Shell ===

function ShellComponent({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  return (
    <html className="scroll-smooth" lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>

      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <PostHogProvider client={posthog}>
          <RouteProgress />

          {children}

          <Toaster resolvedTheme={resolvedTheme} />

          {import.meta.env.DEV && <DevtoolsComponent />}

          <ClientOnly>
            <CookieBanner />
          </ClientOnly>

          <Scripts />
        </PostHogProvider>
      </body>
    </html>
  );
}
