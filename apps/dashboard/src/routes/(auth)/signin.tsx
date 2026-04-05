import { createFileRoute, redirect } from '@tanstack/react-router';
import SignIn from '@xbrk/shared/signin';
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
});

function AuthPage() {
  return (
    <SignIn
      onClick={(provider) =>
        authClient.signIn.social({
          provider,
          callbackURL: REDIRECT_URL,
        })
      }
    />
  );
}
