import { Link } from '@tanstack/react-router';
import { siteConfig, socialConfig } from '@xbrk/config';
import Icon from '@xbrk/ui/icon';
import { motion, useInView } from 'framer-motion';
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
    <motion.section
      animate={isInView ? 'visible' : 'hidden'}
      className="w-full"
      id="connect"
      initial="hidden"
      ref={sectionRef}
      transition={{ duration: 0.5 }}
      variants={sectionVariants}
    >
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-card via-card to-muted/30 p-5 sm:rounded-3xl sm:p-8 md:p-12">
        {/* Background decoration */}
        <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-gradient-to-br from-violet-500/10 to-pink-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 blur-3xl" />

        <motion.div
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="relative flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="font-bold text-2xl tracking-tight sm:text-3xl md:text-4xl">Say Hi</h2>
          <p className="mt-4 max-w-lg text-muted-foreground leading-relaxed">
            I'm available for freelance projects and would love to explore potential collaborations. Feel free to reach
            out, and let's discuss how we can work together!
          </p>

          {/* Social links */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              className="group flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5 font-medium transition-all hover:border-foreground/20 hover:shadow-md"
              href={`mailto:${siteConfig.links.mail}`}
            >
              <Mail className="h-4 w-4 transition-colors group-hover:text-primary" />
              <span>Email</span>
            </a>

            {socialConfig.map((social) => (
              <a
                className="group flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5 font-medium transition-all hover:border-foreground/20 hover:shadow-md"
                href={social.url}
                key={social.name}
                rel="noreferrer"
                target="_blank"
              >
                <Icon className="h-4 w-4 transition-colors group-hover:text-primary" icon={social.icon} />
                <span>{social.name}</span>
              </a>
            ))}
          </div>

          {/* Guestbook mention */}
          <p className="mt-6 text-muted-foreground text-sm">
            Or leave a note in the{' '}
            <Link
              className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
              to="/guestbook"
            >
              guestbook
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ConnectSection;
