import type { ReactNode } from 'react';
import { GLITCH_STYLES } from './internal/glitch-styles';

export function NotFound(
  props: Readonly<{
    children?: ReactNode;
  }>,
) {
  return (
    <>
      <style>{GLITCH_STYLES}</style>
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <h1
          className="glitch-container mb-6 font-black text-7xl leading-tight tracking-tight sm:text-9xl"
          data-text="404"
        >
          404
        </h1>
        <h2 className="mb-3 animate-pulse text-center font-semibold text-xl sm:text-2xl">
          {props.children ?? 'Oops! This page went on vacation without telling us. 🏖️'}
        </h2>
        <p className="max-w-2xl text-center text-base text-zinc-600 leading-relaxed dark:text-zinc-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
    </>
  );
}
