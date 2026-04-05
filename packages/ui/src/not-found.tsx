import type { ReactNode } from 'react';

export function NotFound(
  props: Readonly<{
    children?: ReactNode;
  }>,
) {
  return (
    <>
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
