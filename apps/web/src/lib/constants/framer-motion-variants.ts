import type { Variants } from 'framer-motion';

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export const containerVariantsFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const itemVariantsDown: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const slideInWithFadeOut: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: 0.1, ease: 'backOut' },
  },
};

// Common animation states for simple fade-in effects
export const fadeIn = { opacity: 1 };
export const fadeOut = { opacity: 0 };
export const fadeInUp = { opacity: 1, y: 0 };
export const fadeOutDown = { opacity: 0, y: 20 };
export const fadeInScale = { opacity: 1, scale: 1 };
export const fadeOutScale = { opacity: 0, scale: 0.98 };
