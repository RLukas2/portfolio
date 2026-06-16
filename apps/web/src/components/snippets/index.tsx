import type { SnippetType } from '@xbrk/types';
import { Badge } from '@xbrk/ui/badge';
import { formatDate } from '@xbrk/utils';
import { AnimatePresence, m } from 'framer-motion';
import { ArrowUpRight, Calendar, Code2 } from 'lucide-react';
import { useState } from 'react';
import Link from '@/components/shared/link';
import { containerVariants, itemVariants } from '@/lib/constants/framer-motion-variants';
import EmptyState from '../shared/empty-state';

interface SnippetsProps {
  snippets: SnippetType[];
}

export default function Snippets({ snippets }: Readonly<SnippetsProps>) {
  const [hoveredSnippet, setHoveredSnippet] = useState<SnippetType | null>(null);

  if (snippets.length === 0) {
    return <EmptyState message="No snippets found. Time to write some code!" />;
  }

  return (
    <div className="relative mt-8 flex flex-col gap-8 lg:flex-row">
      {/* List Content */}
      <m.div
        animate="visible"
        className="flex w-full flex-col gap-6 lg:w-1/2"
        initial="hidden"
        variants={containerVariants}
      >
        {snippets.map((snippet) => (
          <m.div key={snippet.slug} variants={itemVariants}>
            <Link
              className="group flex flex-col gap-2 border-border/50 border-b py-4 no-underline last:border-0"
              onMouseEnter={() => setHoveredSnippet(snippet)}
              onMouseLeave={() => setHoveredSnippet(null)}
              params={{
                snippetId: snippet.slug,
              }}
              to="/snippets/$snippetId"
            >
              {/* Header */}
              <div className="mb-1 flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <Calendar className="h-4 w-4" />
                  {formatDate(snippet.updatedAt ?? snippet.createdAt)}
                </span>
                <Badge className="shrink-0" variant="secondary">
                  {snippet.category}
                </Badge>
              </div>

              {/* Title */}
              <h3 className="font-heading text-2xl transition-colors group-hover:text-primary">{snippet.title}</h3>

              {/* Description */}
              {snippet.description && (
                <p className="line-clamp-2 text-lg text-muted-foreground">{snippet.description}</p>
              )}
            </Link>
          </m.div>
        ))}
      </m.div>

      {/* Hover Preview Panel (Sticky on right) */}
      <div className="glassmorphism pointer-events-none sticky top-24 hidden h-[calc(100vh-120px)] overflow-hidden rounded-2xl p-2 lg:block lg:w-1/2">
        <AnimatePresence mode="wait">
          {hoveredSnippet ? (
            <m.div
              animate={{ opacity: 1, scale: 1 }}
              className="relative flex h-full w-full flex-col overflow-hidden rounded-xl bg-background/50"
              exit={{ opacity: 0, scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.95 }}
              key={hoveredSnippet.slug}
              transition={{ duration: 0.3 }}
            >
              <div className="flex h-full w-full flex-col gap-6 p-10">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Code2 className="h-5 w-5" />
                  <span className="font-medium text-sm uppercase tracking-wider">Preview</span>
                </div>
                <h3 className="font-heading text-4xl text-foreground leading-tight">{hoveredSnippet.title}</h3>
                <p className="text-muted-foreground text-xl leading-relaxed">{hoveredSnippet.description}</p>
                <div className="mt-auto flex items-center justify-between border-border/50 border-t pt-6 text-muted-foreground">
                  <span>Category: {hoveredSnippet.category}</span>
                  <span className="flex items-center gap-1">
                    Click to view <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </m.div>
          ) : (
            <m.div
              animate={{ opacity: 1 }}
              className="flex h-full w-full items-center justify-center rounded-xl border-2 border-border/50 border-dashed bg-muted/20"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key="empty"
            >
              <span className="font-medium text-lg text-muted-foreground">Hover over a snippet to preview</span>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
