import { Image } from '@unpic/react';
import { cn } from '@xbrk/ui';
import Callout from '@xbrk/ui/callout';
import { File, Files, Folder } from '@xbrk/ui/files';
import type { Components } from 'hast-util-to-jsx-runtime';
import {
  type AnchorHTMLAttributes,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  lazy,
} from 'react';

/**
 * Custom React components for markdown elements.
 * These override the default HTML elements with styled versions.
 *
 * Type-safe using Components from hast-util-to-jsx-runtime.
 */
export const components: Components = {
  h1: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className={cn('mt-2 scroll-m-20 font-bold text-4xl tracking-tight', className)} {...props} />
  ),
  h2: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn('mt-10 scroll-m-28 border-b pb-1 font-semibold text-3xl tracking-tight first:mt-0', className)}
      {...props}
    />
  ),
  h3: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={cn('mt-8 scroll-m-28 font-semibold text-2xl tracking-tight', className)} {...props} />
  ),
  h4: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className={cn('mt-8 scroll-m-28 font-semibold text-xl tracking-tight', className)} {...props} />
  ),
  h5: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h5 className={cn('mt-8 scroll-m-20 font-semibold text-lg tracking-tight', className)} {...props} />
  ),
  h6: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h6 className={cn('mt-8 scroll-m-20 font-semibold text-base tracking-tight', className)} {...props} />
  ),
  a: ({ className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className={cn('font-medium underline underline-offset-4', className)}
      href={props.href as string}
      target={props.href?.startsWith('http') ? '_blank' : undefined}
      {...props}
    />
  ),
  p: ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn('leading-8 [&:not(:first-child)]:mt-6', className)} {...props} />
  ),
  ul: ({ className, ...props }: HTMLAttributes<HTMLElement>) => (
    <ul className={cn('my-6 ml-6 list-disc', className)} {...props} />
  ),
  ol: ({ className, ...props }: HTMLAttributes<HTMLElement>) => (
    <ol className={cn('my-6 ml-6 list-decimal', className)} {...props} />
  ),
  li: ({ className, ...props }: HTMLAttributes<HTMLElement>) => <li className={cn('mt-2', className)} {...props} />,
  blockquote: ({ className, ...props }: HTMLAttributes<HTMLElement>) => (
    <blockquote
      className={cn('my-6 border-l-4 pl-6 italic [&>*]:text-gray-800 dark:[&>*]:text-gray-300', className)}
      {...props}
    />
  ),
  img: ({ className, alt, src, width, height, ...props }: ImgHTMLAttributes<HTMLImageElement>) => (
    <Image
      alt={alt}
      className={cn('rounded-md border', className)}
      height={height as number}
      layout="constrained"
      src={src as string}
      width={width as number}
      {...props}
    />
  ),
  hr: ({ ...props }) => <hr className="my-4 md:my-8" {...props} />,
  table: ({ className, ...props }: HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn('w-full', className)} {...props} />
    </div>
  ),
  tr: ({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) => (
    <tr className={cn('m-0 border-t p-0 even:bg-muted', className)} {...props} />
  ),
  th: ({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        'border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right',
        className,
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn('border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right', className)}
      {...props}
    />
  ),
  pre: lazy(() => import('@xbrk/ui/code-block')),
  code: ({ className, ...props }: ComponentPropsWithoutRef<'code'>) => (
    <code className={cn('relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm', className)} {...props} />
  ),
  steps: ({ ...props }) => <div className="steps mb-12 ml-8 border-l pl-8" {...props} />,
  step: ({ className, ...props }: ComponentProps<'h3'>) => (
    <h3 className={cn('step mt-8 scroll-m-20 font-semibold text-lg tracking-tight', className)} {...props} />
  ),
  Image: lazy(() => import('@xbrk/ui/zoom-image')),
  callout: Callout,
  GridContainer: lazy(() => import('@xbrk/ui/grid-container')),
  LoadingSkeleton: lazy(() => import('@xbrk/ui/loading-skeleton')),
  ComponentPreview: lazy(() => import('@xbrk/ui/component-preview')),
  FolderTree: lazy(() => import('@xbrk/ui/folder-tree')),
  CodePlayground: lazy(() => import('@xbrk/ui/code-playground')),
  Youtube: lazy(() => import('@xbrk/ui/youtube')),
  files: Files,
  folder: Folder,
  file: File,
};
