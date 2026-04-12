import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { Button } from '@xbrk/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@xbrk/ui/card';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';

export const Route = createFileRoute('/(auth)/error')({
  component: AuthErrorPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      error: (search.error as string) || 'unknown_error',
      message: search.message as string | undefined,
    };
  },
});

const ERROR_MESSAGES: Record<string, { title: string; description: string }> = {
  access_denied: {
    title: 'Access Denied',
    description: 'You denied access to your account. Please try again if this was a mistake.',
  },
  oauth_error: {
    title: 'OAuth Error',
    description: 'There was a problem connecting to the authentication provider. Please try again.',
  },
  callback_error: {
    title: 'Callback Error',
    description: 'There was an error processing the authentication callback.',
  },
  unknown_error: {
    title: 'Authentication Error',
    description: 'An unexpected error occurred during authentication. Please try again.',
  },
};

function AuthErrorPage() {
  const navigate = useNavigate();
  const { error, message } = useSearch({ from: '/(auth)/error' });

  const errorInfo = ERROR_MESSAGES[error] || ERROR_MESSAGES.unknown_error;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Card className="border-destructive/50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-xl">{errorInfo.title}</CardTitle>
            <CardDescription className="text-base">{errorInfo.description}</CardDescription>
            {message && <p className="mt-2 text-muted-foreground text-sm">Details: {message}</p>}
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button
              className="w-full"
              onClick={() =>
                navigate({
                  to: '/signin',
                  search: { error: undefined, error_description: undefined, message: undefined, returnTo: undefined },
                })
              }
              variant="default"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Button>
            <Button className="w-full" onClick={() => navigate({ to: '/' })} variant="outline">
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
