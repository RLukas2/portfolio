import { motion, type Variants } from 'framer-motion';
import type { HTMLAttributes, ReactNode } from 'react';

interface AnimatedDivProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  loop?: boolean;
  variants: Variants;
}

export default function AnimatedDiv({ variants, className, children, loop }: AnimatedDivProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      transition={{ staggerChildren: 0.5 }}
      variants={variants}
      viewport={{ once: !loop }}
      whileInView="visible"
    >
      {children}
    </motion.div>
  );
}
