import { createFileRoute, redirect, useSearch } from '@tanstack/react-router';
import SignIn from '@xbrk/shared/signin';
import authClient from '@/lib/auth/client';

const DEFAULT_REDIRECT = '/dashboard';

/**
 * Validates and sanitizes the returnTo URL
 * Only allows internal paths (no external URLs)
 */
function getRedirectUrl(returnTo?: string): string {
  if (!returnTo) {
    return DEFAULT_REDIRECT;
  }

  try {
    // Remove any leading/trailing whitespace
    const path = returnTo.trim();

    // Must start with / and not be a protocol (http://, https://, //)
    if (!path.startsWith('/') || path.startsWith('//')) {
      return DEFAULT_REDIRECT;
    }

    // Whitelist: only allow internal paths, block auth routes
    if (path.startsWith('/signin') || path.startsWith('/signout')) {
      return DEFAULT_REDIRECT;
    }

    return path;
  } catch {
    return DEFAULT_REDIRECT;
  }
}

export const Route = createFileRoute('/(auth)/signin')({
  component: AuthPage,
  beforeLoad: ({ context, search }) => {
    if (context.user) {
      const redirectUrl = getRedirectUrl((search as { returnTo?: string }).returnTo);
      throw redirect({
        to: redirectUrl,
      });
    }
  },
  validateSearch: (search: Record<string, unknown>) => {
    return {
      error: search.error as string | undefined,
      error_description: search.error_description as string | undefined,
      message: search.message as string | undefined,
      returnTo: search.returnTo as string | undefined,
    };
  },
});

function AuthPage() {
  const { error, error_description, message, returnTo } = useSearch({ from: '/(auth)/signin' });

  const redirectUrl = getRedirectUrl(returnTo);

  return (
    <SignIn
      error={error}
      errorDescription={error_description || message}
      onClick={(provider) =>
        authClient.signIn.social({
          provider,
          callbackURL: redirectUrl,
        })
      }
    />
  );
}
