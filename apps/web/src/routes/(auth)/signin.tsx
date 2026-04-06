import { createFileRoute, redirect, useSearch } from '@tanstack/react-router';
import SignIn from '@xbrk/shared/signin';
import { useState } from 'react';
import authClient from '@/lib/auth/client';

const REDIRECT_URL = '/';

export const Route = createFileRoute('/(auth)/signin')({
  component: AuthPage,
  beforeLoad: ({ context }) => {
    if (context.user) {
      throw redirect({
        to: REDIRECT_URL,
      });
    }
  },
  validateSearch: (search: Record<string, unknown>) => {
    return {
      error: search.error as string | undefined,
      error_description: search.error_description as string | undefined,
      message: search.message as string | undefined,
    };
  },
});

function AuthPage() {
  const { error, error_description, message } = useSearch({ from: '/(auth)/signin' });
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async (provider: string) => {
    setIsSigningIn(true);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: REDIRECT_URL,
      });
    } catch (err) {
      // Error will be handled by Better Auth's errorURL config
      console.error('Sign in error:', err);
      setIsSigningIn(false);
    }
  };

  return (
    <SignIn
      disabled={isSigningIn}
      error={error}
      errorDescription={error_description || message}
      onClick={handleSignIn}
    />
  );
}
