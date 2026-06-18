import { isHttpError } from '@xbrk/errors';
import { AlertTriangle } from 'lucide-react';
import { Button } from './button';
import { GLITCH_STYLES } from './internal/glitch-styles';
import { Separator } from './separator';

interface DefaultCatchBoundaryProps {
  debug?: boolean;
  error?: Error | { message?: string };
  reset?: () => void;
}

export function DefaultCatchBoundary({ error, reset, debug = false }: DefaultCatchBoundaryProps) {
  const errorCode = isHttpError(error) ? error.code : 'UNKNOWN_ERROR';
  const statusCode = isHttpError(error) ? error.statusCode : 500;
  const metadata = isHttpError(error) ? error.metadata : undefined;

  const handleRetry = () => {
    if (reset) {
      reset();
    } else {
      window.location.reload();
    }
  };

  return (
    <>
      <style>{GLITCH_STYLES}</style>

      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 px-4">
        {/* Glitch animation */}
        <h1 className="glitch-container font-black text-7xl leading-tight tracking-tight sm:text-9xl" data-text="Error">
          Error
        </h1>

        <h2 className="animate-pulse text-center font-semibold text-xl sm:text-2xl">Oops! Something went wrong.</h2>

        <Separator />

        {/* Error code badge */}
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <span className="font-mono text-muted-foreground text-sm">
            {errorCode} ({statusCode})
          </span>
        </div>

        <p className="max-w-2xl text-center text-base text-zinc-600 leading-relaxed dark:text-zinc-400">
          {error?.message || 'An unexpected error occurred. Please try again later.'}
        </p>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button onClick={handleRetry} size="lg">
            Try Again
          </Button>
        </div>

        {/* Dev mode only: Show stack trace and metadata */}
        {debug && error instanceof Error && error.stack && (
          <details className="mt-4 w-full">
            <summary className="cursor-pointer rounded-lg bg-muted p-4 font-medium hover:bg-muted/80">
              🐛 Error Details
            </summary>
            <div className="mt-2 space-y-2">
              {metadata && Object.keys(metadata).length > 0 && (
                <div className="overflow-auto rounded-lg bg-muted p-4">
                  <div className="mb-2 font-semibold text-sm">Metadata:</div>
                  <pre className="text-xs">{JSON.stringify(metadata, null, 2)}</pre>
                </div>
              )}
              <pre className="overflow-auto rounded-lg bg-muted p-4 text-xs">{error.stack}</pre>
            </div>
          </details>
        )}
      </div>
    </>
  );
}
