import { authProviders } from '@xbrk/config';
import Callout from '@xbrk/ui/callout';
import { Card, CardContent, CardHeader, CardTitle } from '@xbrk/ui/card';
import SignInButton from '@xbrk/ui/sign-in-button';
import Logo from './logo';

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

export default function SignIn({
  onClick,
  disabled = false,
  error,
  errorDescription,
}: {
  onClick: (provider: string) => void;
  disabled?: boolean;
  error?: string;
  errorDescription?: string;
}) {
  const errorInfo = error ? ERROR_MESSAGES[error] || ERROR_MESSAGES.unknown_error : null;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Logo className="self-center" />
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
                  {authProviders.map((provider) => (
                    <SignInButton
                      disabled={disabled}
                      icon={provider.icon}
                      key={provider.provider}
                      label={provider.label}
                      onClick={() => onClick(provider.provider)}
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
