import { Slot } from '@radix-ui/react-slot';
import { cn } from '@xbrk/ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { type ComponentProps } from 'react';

const buttonVariants = cva(
  "group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-lg border border-transparent bg-clip-padding font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-md hover:scale-[1.02] hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]',
        destructive:
          'bg-destructive text-white shadow-md hover:scale-[1.02] hover:bg-destructive/90 hover:shadow-lg focus-visible:ring-destructive/20 active:scale-[0.98] dark:bg-destructive/60 dark:focus-visible:ring-destructive/40',
        outline:
          'border border-border/50 bg-background/50 shadow-sm backdrop-blur-sm hover:scale-[1.02] hover:border-foreground/20 hover:bg-accent hover:text-accent-foreground hover:shadow-md active:scale-[0.98] dark:bg-white/5 dark:hover:bg-white/10',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:scale-[1.02] hover:bg-secondary/80 hover:shadow-md active:scale-[0.98]',
        ghost:
          'hover:scale-[1.02] hover:bg-accent/80 hover:text-accent-foreground active:scale-[0.98] dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:text-primary/80 hover:underline',
        shadow:
          'border border-secondary-foreground bg-background shadow-[3px_3px_rgb(0_0_0_/_20%)] hover:scale-[1.02] hover:bg-primary hover:text-primary-foreground hover:shadow-[4px_4px_rgb(0_0_0_/_30%)] active:scale-[0.98] active:shadow-[2px_2px_rgb(0_0_0_/_20%)] dark:shadow-[3px_3px_rgb(255_255_255_/_40%)] dark:active:shadow-[2px_2px_rgb(255_255_255_/_40%)] dark:hover:shadow-[4px_4px_rgb(255_255_255_/_50%)]',
      },
      size: {
        default: 'h-10 px-5 py-2.5 has-[>svg]:px-4',
        xs: 'h-8 gap-1 rounded-lg px-2 has-[>svg]:px-3',
        sm: 'h-9 gap-1.5 rounded-lg px-4 has-[>svg]:px-3',
        lg: 'h-12 rounded-xl px-8 has-[>svg]:px-6',
        icon: 'size-10 rounded-xl',
        'icon-sm': 'size-9 rounded-lg',
        'icon-lg': 'size-11 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return <Comp className={cn(buttonVariants({ variant, size, className }))} data-slot="button" {...props} />;
}

export { Button, buttonVariants };
