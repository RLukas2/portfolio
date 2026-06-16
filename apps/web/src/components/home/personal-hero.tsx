import { siteConfig, socialConfig } from '@xbrk/config';
import { cn } from '@xbrk/ui';
import { buttonVariants } from '@xbrk/ui/button';
import Icon from '@xbrk/ui/icon';

import { m } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import Link from '@/components/shared/link';

const PersonalHero = () => (
  <section aria-label="Hero section" className="relative min-h-[calc(100vh-80px)]" id="hero">
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center gap-12 py-8 sm:py-16 text-center">
      <m.div
        animate={{ opacity: 1, y: 0 }}
        className="z-10 flex max-w-4xl flex-col items-center gap-8"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div>
          <m.div
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/50 px-4 py-1.5 font-medium text-sm backdrop-blur-md shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.1 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Available for new opportunities
          </m.div>
          <h1 className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text font-bold font-heading text-5xl text-transparent leading-[1.1] tracking-tight sm:text-7xl lg:text-[5.5rem]">
            Crafting premium <br className="hidden sm:block"/> digital experiences.
          </h1>
        </div>

        <p className="max-w-2xl text-xl text-muted-foreground leading-relaxed sm:text-2xl">
          I'm {siteConfig.author.name}, a software engineer focused on building fast, accessible, and beautiful web applications with modern technologies.
        </p>

        <m.div
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex flex-col items-center justify-center gap-4 sm:flex-row w-full sm:w-auto"
          initial={{ opacity: 0, y: 10 }}
          transition={{ delay: 0.3 }}
        >
          <Link className={cn(buttonVariants({ size: 'xl', variant: 'shadow' }), 'group w-full sm:w-auto rounded-full px-8')} to="/#featured-projects">
            View My Work
            <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link className={cn(buttonVariants({ size: 'xl', variant: 'outline' }), 'group w-full sm:w-auto rounded-full px-8 bg-background/50 backdrop-blur-sm border-white/10 hover:bg-background/80')} to="/about">
            More About Me
          </Link>
        </m.div>

        <m.div
          animate={{ opacity: 1 }}
          className="mt-8 flex justify-center gap-4"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.5 }}
        >
          {socialConfig.map((social) => (
            <a
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/5 bg-background/30 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-white/20 hover:bg-background/50"
              href={social.url}
              key={social.name}
              rel="noreferrer"
              target="_blank"
            >
              <Icon
                className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground"
                icon={social.icon}
              />
              <span className="sr-only">{social.name}</span>
            </a>
          ))}
        </m.div>
      </m.div>
    </div>
  </section>
);

export default PersonalHero;
