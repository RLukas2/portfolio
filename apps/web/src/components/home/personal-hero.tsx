import { siteConfig, socialConfig } from '@xbrk/config';
import { cn } from '@xbrk/ui';
import { buttonVariants } from '@xbrk/ui/button';
import Icon from '@xbrk/ui/icon';
import { m } from 'framer-motion';
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
    {/* Ambient Text Background */}
    <m.div
      animate={{ y: [0, -20, 0] }}
      className="absolute top-[20%] left-0 -z-10 -translate-y-1/2"
      initial={{ y: 0 }}
      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 10, ease: 'easeInOut' }}
    >
      <span className="ambient-text pointer-events-none select-none whitespace-nowrap text-[20vw] leading-none">
        HELLO
      </span>
    </m.div>

    {/* Decorative gradient glow */}
    <div className="gradient-glow top-1/4 left-1/4 h-[500px] w-[500px]" />
    <div className="gradient-glow right-1/4 bottom-1/4 h-[400px] w-[400px] bg-[radial-gradient(circle,var(--glow-tertiary)_0%,transparent_70%)]" />

    {/* Main content */}
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center gap-8 py-8 sm:py-16">
      <m.div
        animate={{ opacity: 1, y: 0 }}
        className="fade-in z-10 flex max-w-3xl animate-in flex-col items-center gap-8 text-center duration-700"
        initial={false}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="flex flex-col items-center space-y-4">
          <m.p
            animate={{ opacity: 1, y: 0 }}
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.1 }}
          >
            Hi, I'm
          </m.p>
          <h1 className="font-bold font-heading text-5xl text-foreground tracking-tight sm:text-7xl lg:text-8xl">
            {siteConfig.author.name}
          </h1>
          <p className="max-w-[20ch] font-light text-2xl text-muted-foreground leading-snug sm:text-4xl">
            {siteConfig.author.jobTitle}
          </p>
        </div>

        <div className="space-y-6">
          <p className="max-w-[50ch] text-lg text-muted-foreground leading-relaxed">
            I'm a fourth-year Computer Science student at VNUHCM with practical experience in building backend systems
            through academic and personal projects.
          </p>

          <m.div
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              className={cn(buttonVariants({ size: 'lg', variant: 'default' }), 'group rounded-full')}
              to="/#featured-projects"
            >
              Explore my work
            </Link>
            <div className="flex gap-2">
              {socialConfig.map((social) => (
                <a
                  className="flex items-center justify-center rounded-full p-3 transition-colors hover:bg-muted"
                  href={social.url}
                  key={social.name}
                  rel="noreferrer"
                  target="_blank"
                  title={social.name}
                >
                  <Icon
                    className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground"
                    icon={social.icon}
                  />
                  <span className="sr-only">{social.name}</span>
                </a>
              ))}
            </div>
          </m.div>
        </div>
      </m.div>
    </div>
  </section>
);

export default PersonalHero;
