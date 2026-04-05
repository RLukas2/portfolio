import { siteConfig, socialConfig } from '@xbrk/config';
import { cn } from '@xbrk/ui';
import Icon from '@xbrk/ui/icon';
import { motion } from 'framer-motion';
import Link from '@/components/shared/link';
import { FOOTER_LINKS } from '@/lib/constants/footer';

const CURRENT_YEAR = () => new Date().getFullYear();

const Footer = () => (
  <footer className="relative mt-20 border-t bg-grid print:hidden">
    {/* Decorative gradient */}
    <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />

    <div className="container py-12 lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 grid grid-cols-2 gap-8 md:grid-cols-4"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo and Description */}
        <div className="col-span-2 md:col-span-1">
          <h2 className="font-bold text-lg">{siteConfig.author.name}</h2>
          <p className="mt-3 text-muted-foreground text-xs leading-relaxed">
            A blog about software development, web technologies, and programming tutorials. Sharing knowledge and
            experiences to help developers grow.
          </p>
        </div>

        {/* Link Sections */}
        {FOOTER_LINKS.map((group) => (
          <div className="flex flex-col items-start gap-2" key={group.header}>
            <h3 className="font-semibold text-foreground text-sm">{group.header}</h3>
            {group.links.map(({ title, path }) => (
              <Link className="text-muted-foreground text-sm" href={path} key={path} variant="muted">
                {title}
              </Link>
            ))}
          </div>
        ))}
      </motion.div>

      {/* Horizontal divider */}
      <div className="my-8 border-border/50 border-t" />

      {/* Bottom Footer */}
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="flex flex-col items-center gap-2 text-center text-sm sm:flex-row sm:text-left">
          <p className="text-muted-foreground">
            © {CURRENT_YEAR()}{' '}
            <Link className="font-medium text-foreground" href="/" variant="nav">
              {siteConfig.author.name}
            </Link>
          </p>
          <span className="hidden text-muted-foreground sm:inline">•</span>
          <p className="text-muted-foreground">
            <Link
              className="text-muted-foreground"
              href="https://www.google.com/maps/place/Ho+Chi+Minh+City,+Vietnam"
              variant="muted"
            >
              Ho Chi Minh, Vietnam
            </Link>
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-3">
          {socialConfig.map((social) => (
            <a
              className={cn(
                'text-lg text-muted-foreground transition-colors hover:text-foreground',
                social.name === 'LinkedIn' && 'hover:text-[#0A66C2]',
                social.name === 'GitHub' && 'hover:text-foreground',
                social.name === 'Twitter' && 'hover:text-[#1DA1F2]',
              )}
              href={social.url}
              key={social.name}
              rel="noreferrer"
              target="_blank"
              title={social.name}
            >
              <Icon className="h-4 w-4" icon={social.icon} />
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
