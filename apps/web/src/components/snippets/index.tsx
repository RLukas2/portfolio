import type { SnippetType } from '@xbrk/types';
import { Badge } from '@xbrk/ui/badge';
import { m, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Code2, TerminalSquare } from 'lucide-react';
import Link from '@/components/shared/link';
import EmptyState from '../shared/empty-state';
import { useState } from 'react';
import { cn } from '@xbrk/ui';

interface SnippetsProps {
  snippets: SnippetType[];
}

export default function Snippets({ snippets }: Readonly<SnippetsProps>) {
  const [activeSnippet, setActiveSnippet] = useState<SnippetType | null>(snippets.length > 0 ? snippets[0] : null);

  if (snippets.length === 0) {
    return <EmptyState message="No snippets found. Time to write some code!" />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 pb-24 h-full min-h-[600px]">
      {/* Left Column: List of Snippets */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2 max-h-[800px] scrollbar-hide">
         {snippets.map((snippet) => {
            const isActive = activeSnippet?.slug === snippet.slug;
            return (
              <button
                key={snippet.slug}
                onClick={() => setActiveSnippet(snippet)}
                className={cn(
                  "group relative flex flex-col text-left overflow-hidden rounded-2xl border p-5 transition-all duration-300 w-full",
                  isActive
                    ? "bg-primary/5 border-primary/20 shadow-sm"
                    : "bg-card/40 border-white/5 hover:bg-card/80 hover:border-white/10 backdrop-blur-md"
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                   <div className={cn(
                     "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                     isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                   )}>
                     <Code2 className="h-4 w-4" />
                   </div>
                   <h3 className={cn(
                     "font-medium transition-colors line-clamp-1 flex-1",
                     isActive ? "text-primary" : "text-foreground group-hover:text-primary"
                   )}>
                     {snippet.title}
                   </h3>
                </div>

                {snippet.description && (
                  <p className="line-clamp-2 text-muted-foreground text-sm leading-relaxed mb-4">{snippet.description}</p>
                )}

                <div className="mt-auto flex items-center justify-between">
                  <Badge variant="secondary" className={cn("text-xs font-mono", isActive ? "bg-primary/10" : "bg-muted/50")}>
                    {snippet.category}
                  </Badge>
                </div>
              </button>
            );
         })}
      </div>

      {/* Right Column: Code Viewer (macOS style window) */}
      <div className="w-full lg:w-2/3 h-full min-h-[600px] flex">
         <AnimatePresence mode="wait">
            {activeSnippet && (
               <m.div
                 key={activeSnippet.slug}
                 initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                 animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                 exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                 transition={{ duration: 0.3 }}
                 className="flex-1 flex flex-col rounded-2xl border border-white/10 bg-[#0d1117] overflow-hidden shadow-2xl glass-panel relative"
               >
                  {/* Window Chrome */}
                  <div className="h-12 border-b border-white/10 bg-[#161b22] flex items-center px-4 justify-between shrink-0">
                     <div className="flex gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500/80 border border-red-600/50" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500/80 border border-yellow-600/50" />
                        <div className="h-3 w-3 rounded-full bg-green-500/80 border border-green-600/50" />
                     </div>
                     <div className="flex-1 text-center font-mono text-xs text-muted-foreground/80 flex items-center justify-center gap-2">
                        <TerminalSquare className="h-3.5 w-3.5" />
                        {activeSnippet.title}
                     </div>
                     <Link
                       params={{ snippetId: activeSnippet.slug }}
                       to="/snippets/$snippetId"
                       className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                     >
                        Open <ArrowUpRight className="h-3 w-3" />
                     </Link>
                  </div>

                  {/* Code Area Placeholder (Content rendering handles the actual syntax highlighting on the detail page) */}
                  <div className="flex-1 p-6 sm:p-8 overflow-y-auto text-sm font-mono leading-loose text-muted-foreground/80 relative">
                     <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-gradient-to-b from-transparent via-background/5 to-background/20">
                        <div className="max-w-md space-y-4">
                           <Code2 className="h-12 w-12 mx-auto text-white/10" />
                           <h4 className="text-xl font-heading text-white/80">{activeSnippet.title}</h4>
                           <p className="text-sm text-white/50">{activeSnippet.description}</p>
                           <Link
                             params={{ snippetId: activeSnippet.slug }}
                             to="/snippets/$snippetId"
                             className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-sans font-medium text-sm mt-4"
                           >
                              View Full Snippet
                           </Link>
                        </div>
                     </div>
                  </div>
               </m.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
}
