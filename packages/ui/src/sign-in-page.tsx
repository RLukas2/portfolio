import type { ReactNode } from 'react';
import Callout from './callout';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { type IconName, resolveIcon } from './icon';
import SignInButton from './sign-in-button';

interface SignInProvider {
  icon: IconName;
  id: string;
  label: string;
}

const ERROR_MESSAGES: Record<string, { title: string; description: string }> = {
  access_denied: {
    title: 'Access Denied',
    description: 'You denied access to your account. Please try again if this was a mistake.',
  },
  oauth_error: {
    title: 'OAuth Error',
    description: 'There was a problem connecting to the authentication provider.',
  },
  callback_error: {
    title: 'Callback Error',
    description: 'There was an error processing the authentication callback.',
  },
  server_error: {
    title: 'Server Error',
    description: 'An error occurred on the server. Please try again later.',
  },
  unknown_error: {
    title: 'Authentication Error',
    description: 'An unexpected error occurred during authentication.',
  },
};

interface SignInPageProps {
  disabled?: boolean;
  error?: string;
  errorDescription?: string;
  logo?: ReactNode;
  onClick: (provider: string) => void;
  providers: SignInProvider[];
}

export default function SignInPage({
  disabled = false,
  error,
  errorDescription,
  logo,
  onClick,
  providers,
}: SignInPageProps) {
  const errorInfo = error ? ERROR_MESSAGES[error] || ERROR_MESSAGES.unknown_error : null;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {logo && <div className="self-center">{logo}</div>}

        <div className="flex flex-col gap-6">
          {errorInfo && (
            <Callout variant="error">
              <p className="font-semibold">{errorInfo.title}</p>
              <p className="text-sm">{errorDescription || errorInfo.description}</p>
            </Callout>
          )}

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome back</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  {providers.map((provider) => (
                    <SignInButton
                      disabled={disabled}
                      icon={resolveIcon(provider.icon)}
                      key={provider.id}
                      label={provider.label}
                      onClick={() => onClick(provider.id)}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
