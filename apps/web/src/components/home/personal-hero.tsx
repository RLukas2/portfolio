import { siteConfig, socialConfig } from '@xbrk/config';
import { cn } from '@xbrk/ui';
import { buttonVariants } from '@xbrk/ui/button';
import Icon from '@xbrk/ui/icon';
import { LazyImage } from '@xbrk/ui/lazy-image';
import { m } from 'framer-motion';
import { ChevronDownIcon } from 'lucide-react';
import Link from '@/components/shared/link';

/**
 * PersonalHero Component
 *
 * Main hero section for the home page featuring:
 * - Personal introduction with name, job title, and tagline
 * - Call-to-action buttons for navigation
 * - Social media links
 * - Profile avatar with decorative effects
 *
 * Uses direct Tailwind classes for layout (no Container component abstraction).
 * Layout already provides container, so this component uses flex layout directly.
 *
 * @returns Hero section with introduction, CTAs, social links, and avatar
 */
const PersonalHero = () => (
  <section aria-label="Hero section" className="relative min-h-[calc(100vh-80px)]" id="hero">
    {/* Background gradient - decorative radial gradients for visual appeal */}
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 45% 50%, rgba(151, 92, 246, 0.1) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 50% 50% at 60% 40%, rgba(251, 191, 36, 0.06) 0%, transparent 60%)',
        }}
      />
    </div>

    {/* Main content - uses direct Tailwind flex classes instead of Container component */}
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center gap-8 py-8 sm:py-16 lg:flex-row lg:gap-16">
      {/* Left side - Content */}
      <m.div
        animate={{ opacity: 1, x: 0 }}
        className="fade-in slide-in-from-left-8 flex max-w-2xl animate-in flex-col gap-6 text-center duration-700 lg:w-1/2 lg:text-left"
        initial={false}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Greeting + Name */}
        <div>
          <p className="mb-2 text-lg text-muted-foreground">Hey, I'm</p>
          <h1 className="font-bold font-heading text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {siteConfig.author.name}
          </h1>
          <p className="mt-2 font-medium text-2xl text-muted-foreground sm:text-3xl">{siteConfig.author.jobTitle}</p>
        </div>

        {/* Personal tagline */}
        <p className="text-lg text-muted-foreground leading-relaxed sm:text-xl">
          I'm a fourth-year Computer Science student at VNUHCM with practical experience in building backend systems
          through academic and personal projects.
        </p>

        {/* CTAs - Call-to-action buttons for navigation */}
        <m.div
          animate={{ opacity: 1, y: 0 }}
          className="fade-in slide-in-from-bottom-4 mt-2 flex animate-in flex-col items-center justify-center gap-4 fill-mode-both delay-300 duration-700 sm:flex-row lg:justify-start"
          initial={false}
          transition={{ delay: 0.4 }}
        >
          <Link className={cn(buttonVariants({ size: 'lg', variant: 'shadow' }), 'group')} to="/#featured-projects">
            View My Work
            <ChevronDownIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link className={buttonVariants({ size: 'lg', variant: 'outline' })} to="/about">
            More About Me
          </Link>
        </m.div>

        {/* Social links - Links to social media profiles */}
        <m.div
          animate={{ opacity: 1 }}
          className="fade-in flex animate-in justify-center gap-2 fill-mode-both delay-500 duration-700 lg:justify-start"
          initial={false}
          transition={{ delay: 0.6 }}
        >
          {socialConfig.map((social) => (
            <a
              className="group rounded-lg border bg-card p-2.5 transition-all hover:border-foreground/20 hover:shadow-md"
              href={social.url}
              key={social.name}
              rel="noreferrer"
              target="_blank"
            >
              <Icon
                className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground"
                icon={social.icon}
              />
              <span className="sr-only">{social.name}</span>
            </a>
          ))}
        </m.div>
      </m.div>

      {/* Right side - Avatar with decorative effects */}
      <m.div
        animate={{ opacity: 1, scale: 1 }}
        className="fade-in zoom-in-90 relative hidden animate-in fill-mode-both delay-200 duration-700 lg:block lg:w-2/5"
        initial={false}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Glow effect - Optional decorative gradient glow behind avatar */}
        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-500/20 via-cyan-500/15 to-sky-400/10 blur-2xl" />

        {/* Main image container - Avatar with border and backdrop blur */}
        <div className="relative rounded-full border border-black/10 bg-gradient-to-br from-white/10 to-white/5 p-2.5 shadow-2xl backdrop-blur-sm dark:border-white/10 dark:from-white/5 dark:to-white/[0.02]">
          <div className="overflow-hidden rounded-full">
            <LazyImage
              alt={siteConfig.author.name}
              height={512}
              imageClassName="object-cover transition-all duration-500 w-full h-full"
              priority={true}
              src="/images/avatar.jpg"
              width={512}
            />
          </div>
        </div>
      </m.div>
    </div>
  </section>
);

export default PersonalHero;
