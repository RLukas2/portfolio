import { type ComponentProps, useCallback, useEffect, useRef, useState } from 'react';
import CopyButton from './copy-button';
import { getIconByLanguage } from './icon';
import { cn } from './lib/cn';
import { ScrollArea, ScrollBar } from './scroll-area';

type CodeBlockProps = {
  'data-lang'?: string;
  'data-language'?: string;
  figureClassName?: string;
} & ComponentProps<'pre'>;

export default function CodeBlock({
  title,
  className,
  figureClassName,
  'data-lang': dataLang,
  'data-language': dataLanguage,
  ref,
  children,
  ...rest
}: Readonly<CodeBlockProps>) {
  const lang = dataLang || dataLanguage;
  const Icon = getIconByLanguage(lang ?? '');
  const textInput = useRef<HTMLPreElement>(null);
  const [copyText, setCopyText] = useState('');

  const preRef = useCallback(
    (node: HTMLPreElement | null) => {
      textInput.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  useEffect(() => {
    if (textInput.current) {
      const text = textInput.current.textContent || '';
      setCopyText(text);
    }
  }, []);

  return (
    <figure
      className={cn(
        'not-prose group [&_pre]:!bg-transparent [&_code]:!bg-transparent relative my-6 overflow-hidden rounded-lg border bg-secondary/50 text-sm',
        figureClassName,
      )}
    >
      {title ? (
        <div className="flex flex-row items-center gap-2 border-b bg-muted/50 px-4 py-1.5">
          <div className="text-muted-foreground">
            <Icon className="size-3.5" />
          </div>
          <figcaption className="flex-1 truncate text-muted-foreground">{title}</figcaption>
          <CopyButton className="-me-2" value={copyText} />
        </div>
      ) : (
        <CopyButton className="absolute top-2 right-2 z-10" value={copyText} />
      )}

      <ScrollArea>
        <pre className={cn('!bg-transparent p-4 text-[13px]', className)} ref={preRef} {...rest}>
          {children}
        </pre>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </figure>
  );
}
