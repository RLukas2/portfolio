import { AlertTriangle } from 'lucide-react';
import { Button } from './button';
import { Separator } from './separator';

// Type for custom app errors
interface AppError extends Error {
  code: string;
  metadata?: Record<string, unknown>;
  statusCode: number;
}

// Type guard to check if error is AppError
function isAppError(error: unknown): error is AppError {
  return error !== null && typeof error === 'object' && 'code' in error && 'statusCode' in error && 'message' in error;
}

interface DefaultCatchBoundaryProps {
  error?: Error | { message?: string };
  reset?: () => void;
}

export function DefaultCatchBoundary({ error, reset }: DefaultCatchBoundaryProps) {
  // Check if it's a known error type using type guard
  const errorCode = isAppError(error) ? error.code : 'UNKNOWN_ERROR';
  const statusCode = isAppError(error) ? error.statusCode : 500;

  const handleRetry = () => {
    if (reset) {
      reset();
    } else {
      window.location.reload();
    }
  };

  return (
    <>
      {/* Glitch styles */}
      <style>
        {`
          @keyframes glitch {
            0%, 100% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
          }
          
          @keyframes glitch-top {
            0%, 100% { clip-path: polygon(0% 0%, 100% 0%, 100% 33%, 0% 33%); transform: translate(0); }
            20% { clip-path: polygon(0% 0%, 100% 0%, 100% 30%, 0% 30%); transform: translate(-3px, 0); }
            40% { clip-path: polygon(0% 0%, 100% 0%, 100% 35%, 0% 35%); transform: translate(3px, 0); }
            60% { clip-path: polygon(0% 0%, 100% 0%, 100% 28%, 0% 28%); transform: translate(-2px, 0); }
            80% { clip-path: polygon(0% 0%, 100% 0%, 100% 32%, 0% 32%); transform: translate(2px, 0); }
          }
          
          @keyframes glitch-bottom {
            0%, 100% { clip-path: polygon(0% 67%, 100% 67%, 100% 100%, 0% 100%); transform: translate(0); }
            20% { clip-path: polygon(0% 70%, 100% 70%, 100% 100%, 0% 100%); transform: translate(3px, 0); }
            40% { clip-path: polygon(0% 65%, 100% 65%, 100% 100%, 0% 100%); transform: translate(-3px, 0); }
            60% { clip-path: polygon(0% 72%, 100% 72%, 100% 100%, 0% 100%); transform: translate(2px, 0); }
            80% { clip-path: polygon(0% 68%, 100% 68%, 100% 100%, 0% 100%); transform: translate(-2px, 0); }
          }
          
          .glitch-container {
            position: relative;
            animation: glitch 2.0s infinite;
          }
          
          .glitch-container::before,
          .glitch-container::after {
            content: attr(data-text);
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
          }
          
          .glitch-container::before {
            animation: glitch-top 0.4s infinite;
            color: #ff00ff;
            z-index: -1;
          }
          
          .glitch-container::after {
            animation: glitch-bottom 0.4s infinite;
            color: #00ffff;
            z-index: -2;
          }
        `}
      </style>

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

        {/* Dev mode: Show stack trace */}
        {error instanceof Error && error.stack && (
          <details className="mt-4 w-full">
            <summary className="cursor-pointer rounded-lg bg-muted p-4 font-medium hover:bg-muted/80">
              🐛 Error Details
            </summary>
            <pre className="mt-2 overflow-auto rounded-lg bg-muted p-4 text-xs">{error.stack}</pre>
          </details>
        )}
      </div>
    </>
  );
}
