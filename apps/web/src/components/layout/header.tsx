import Logo from '@xbrk/shared/logo';
import { type NavItem, type UserType } from '@xbrk/types';
import Navbar from './navbar';

const Header = ({ links, user }: Readonly<{ links: NavItem[]; user: UserType }>) => {
  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Skip to content link for accessibility */}
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        href="#main-content"
      >
        Skip to main content
      </a>

      {/* Glass morphism background - enhanced for Apple-style feel */}
      <div className="absolute inset-0 bg-background/50 backdrop-blur-2xl border-b border-white/5 shadow-sm" />

      {/* Subtle gradient glow at the top */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent"
      />

      <div className="container relative lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
        <div className="flex h-16 items-center justify-between gap-6">
          <Logo className="transition-opacity hover:opacity-80" />
          <Navbar links={links} user={user} />
        </div>
      </div>
    </header>
  );
};

export default Header;
