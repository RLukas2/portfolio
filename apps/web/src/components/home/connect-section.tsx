import { siteConfig, socialConfig } from '@xbrk/config';
import Icon from '@xbrk/ui/icon';
import { m, useInView } from 'framer-motion';
import { Mail } from 'lucide-react';
import { useRef } from 'react';

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const ConnectSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <m.section
      animate={isInView ? 'visible' : 'hidden'}
      className="relative w-full py-24 sm:py-32"
      id="connect"
      initial={false}
      ref={sectionRef}
      transition={{ duration: 0.5 }}
      variants={sectionVariants}
    >
      {/* Decorative gradient glow */}
      <div className="gradient-glow top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 opacity-20" />

      <m.div
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        className="relative mx-auto flex max-w-3xl flex-col items-center text-center"
        initial={false}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="font-heading text-5xl tracking-tight sm:text-6xl md:text-7xl">Let's talk</h2>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed sm:text-xl">
          I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
        </p>

        {/* Action Link */}
        <div className="mt-10">
          <a
            className="group relative inline-flex items-center gap-4 font-light text-2xl transition-colors hover:text-primary sm:text-3xl"
            href={`mailto:${siteConfig.links.mail}`}
          >
            {siteConfig.links.mail}
            <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-current">
              <Mail className="h-4 w-4 transition-transform group-hover:scale-110" />
            </span>
          </a>
        </div>

        {/* Social Links */}
        <div className="mt-16 flex items-center gap-6">
          {socialConfig.map((social) => (
            <a
              className="text-muted-foreground transition-colors hover:text-foreground"
              href={social.url}
              key={social.name}
              rel="noreferrer"
              target="_blank"
              title={social.name}
            >
              <Icon className="h-6 w-6" icon={social.icon} />
              <span className="sr-only">{social.name}</span>
            </a>
          ))}
        </div>
      </m.div>
    </m.section>
  );
};

export default ConnectSection;
