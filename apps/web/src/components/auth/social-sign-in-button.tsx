// biome-ignore lint/performance/noNamespaceImport: Sentry required import as namespace for correct stack traces
import * as Sentry from '@sentry/tanstackstart-react';
import { useLocation } from '@tanstack/react-router';
import { Button } from '@xbrk/ui/button';
import Icon from '@xbrk/ui/icon';
import { useState } from 'react';
import { toast } from 'sonner';
import authClient from '@/lib/auth/client';
import { AUTH_PROVIDERS, type AuthProvider } from '@/lib/constants/auth';

export default function SocialSignInButton() {
  const location = useLocation();
  const [loadingProvider, setLoadingProvider] = useState<AuthProvider | null>(null);

  const handleClick = async (provider: AuthProvider) => {
    if (loadingProvider) {
      return;
    }
    setLoadingProvider(provider);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: location.pathname,
      });
    } catch (error) {
      Sentry.captureException(error);
      toast.error('Sign in failed. Please try again.');
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {AUTH_PROVIDERS.map(({ provider, icon, label }) => (
        <Button
          aria-label="Sign in button"
          className="flex w-full gap-2"
          disabled={loadingProvider !== null}
          key={provider}
          onClick={() => handleClick(provider)}
          size="lg"
          variant="outline"
        >
          <Icon className="size-5" icon={icon} />
          {loadingProvider === provider ? 'Redirecting...' : label}
        </Button>
      ))}
    </div>
  );
}
