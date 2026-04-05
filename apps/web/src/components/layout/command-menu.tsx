import type { DialogProps } from '@radix-ui/react-dialog';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { siteConfig, socialConfig } from '@xbrk/config';
import { useTheme } from '@xbrk/shared/theme-provider';
import { Badge } from '@xbrk/ui/badge';
import { Button } from '@xbrk/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@xbrk/ui/command';
import Icon from '@xbrk/ui/icon';
import {
  Code,
  CommandIcon,
  File,
  FileText,
  FolderKanban,
  Laptop,
  Loader2,
  type LucideIcon,
  Moon,
  Sun,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { navbarLinks } from '@/lib/constants/navbar';
import { queryKeys } from '@/lib/query-keys';
import { $search } from '@/lib/server';

const truncate = (text: string, max = 60) => (text.length > max ? `${text.slice(0, max)}...` : text);

/**
 * Array of rotating placeholder messages for the command menu input.
 * Provides helpful tips and keyboard shortcuts to guide users.
 */
const PLACEHOLDER_MESSAGES = [
  'Type a command or search...',
  'Press Cmd/Ctrl + K anytime to access this menu',
  'Use arrow keys to navigate',
  'Press Enter to select an option',
  'Search for articles, projects, or snippets',
];

export default function CommandMenu({ ...props }: Readonly<DialogProps>) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const { setTheme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Rotate placeholder text every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % PLACEHOLDER_MESSAGES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!open) {
      setSearchQuery('');
      setDebouncedQuery('');
    }
  }, [open]);

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: queryKeys.search.query(debouncedQuery),
    queryFn: () => $search({ data: { query: debouncedQuery } }),
    enabled: debouncedQuery.length >= 2,
  });

  const hasSearchResults =
    searchResults &&
    (searchResults.articles.length > 0 || searchResults.projects.length > 0 || searchResults.snippets.length > 0);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((currentOpen) => !currentOpen);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button className="size-8 cursor-pointer px-0" onClick={() => setOpen(true)} size="sm" variant="ghost" {...props}>
        <CommandIcon className="size-5" strokeWidth="1.5" />
      </Button>

      <CommandDialog onOpenChange={setOpen} open={open}>
        <CommandInput
          onValueChange={setSearchQuery}
          placeholder={PLACEHOLDER_MESSAGES[placeholderIndex]}
          value={searchQuery}
        />
        <CommandList>
          <CommandEmpty>
            {isSearching ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </div>
            ) : (
              'No results found.'
            )}
          </CommandEmpty>

          {hasSearchResults && (
            <>
              {searchResults.articles.length > 0 && (
                <CommandGroup heading="Articles">
                  {searchResults.articles.map((article) => (
                    <CommandItem
                      className="group"
                      key={article.id}
                      onSelect={() => {
                        runCommand(() =>
                          navigate({
                            to: '/blog/$articleId',
                            params: { articleId: article.slug },
                          }),
                        );
                      }}
                      value={`article-${article.slug}`}
                    >
                      <div className="transition-transform duration-200 group-hover:-rotate-12">
                        <FileText className="mr-2 h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span>{article.title}</span>
                        {article.description && (
                          <span className="text-muted-foreground text-xs">{truncate(article.description)}</span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {searchResults.projects.length > 0 && (
                <CommandGroup heading="Projects">
                  {searchResults.projects.map((project) => (
                    <CommandItem
                      className="group"
                      key={project.id}
                      onSelect={() => {
                        runCommand(() =>
                          navigate({
                            to: '/projects/$projectId',
                            params: { projectId: project.slug },
                          }),
                        );
                      }}
                      value={`project-${project.slug}`}
                    >
                      <div className="transition-transform duration-200 group-hover:-rotate-12">
                        <FolderKanban className="mr-2 h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span>{project.title}</span>
                        {project.description && (
                          <span className="text-muted-foreground text-xs">{truncate(project.description)}</span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {searchResults.snippets.length > 0 && (
                <CommandGroup heading="Snippets">
                  {searchResults.snippets.map((snippet) => (
                    <CommandItem
                      className="group"
                      key={snippet.id}
                      onSelect={() => {
                        runCommand(() =>
                          navigate({
                            to: '/snippets/$snippetId',
                            params: { snippetId: snippet.slug },
                          }),
                        );
                      }}
                      value={`snippet-${snippet.slug}`}
                    >
                      <div className="transition-transform duration-200 group-hover:-rotate-12">
                        <Code className="mr-2 h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span>{snippet.title}</span>
                        {snippet.description && (
                          <span className="text-muted-foreground text-xs">{truncate(snippet.description)}</span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              <CommandSeparator />
            </>
          )}

          <CommandGroup heading="General">
            <CommandItem
              className="group"
              onSelect={() => window.open(siteConfig.links.githubRepo, '_blank', 'noopener,noreferrer')}
            >
              <div className="transition-transform duration-200 group-hover:-rotate-12">
                <Code className="mr-2 h-4 w-4" />
              </div>
              Source code
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Links">
            {navbarLinks.map((link) =>
              link.content ? (
                link.content.map((subLink) => (
                  <MenuCommandItem
                    currentPath={location.pathname}
                    href={subLink.href}
                    icon={subLink.icon}
                    key={subLink.href}
                    onSelect={() => {
                      runCommand(() =>
                        navigate({
                          href: subLink.href,
                        }),
                      );
                    }}
                    value={subLink.title}
                  />
                ))
              ) : (
                <MenuCommandItem
                  currentPath={location.pathname}
                  href={link.href}
                  icon={link.icon}
                  key={link.href}
                  onSelect={() => {
                    runCommand(() =>
                      navigate({
                        href: link.href ?? '#',
                      }),
                    );
                  }}
                  value={link.title}
                />
              ),
            )}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Social">
            {socialConfig.map((social) => (
              <CommandItem
                className="group"
                key={social.name}
                onSelect={() => {
                  window.open(social.url, '_blank', 'noopener,noreferrer');
                }}
              >
                <div className="transition-transform duration-200 group-hover:-rotate-12">
                  <Icon className="mr-2 h-4 w-4" icon={social.icon} />
                </div>
                {social.name}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Theme">
            <CommandItem className="group" onSelect={() => runCommand(() => setTheme('light'))}>
              <div className="transition-transform duration-200 group-hover:-rotate-12">
                <Sun className="mr-2 h-4 w-4" />
              </div>
              Light
            </CommandItem>
            <CommandItem className="group" onSelect={() => runCommand(() => setTheme('dark'))}>
              <div className="transition-transform duration-200 group-hover:-rotate-12">
                <Moon className="mr-2 h-4 w-4" />
              </div>
              Dark
            </CommandItem>
            <CommandItem className="group" onSelect={() => runCommand(() => setTheme('auto'))}>
              <div className="transition-transform duration-200 group-hover:-rotate-12">
                <Laptop className="mr-2 h-4 w-4" />
              </div>
              System
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

interface MenuCommandProps {
  currentPath?: string;
  href?: string;
  icon?: LucideIcon;
  onSelect?: (value: string) => void;
  value: string;
}

const MenuCommandItem = ({ value, icon, href, currentPath, onSelect }: MenuCommandProps) => {
  const IconComponent = icon || File;
  const isActive = href && currentPath === href;

  return (
    <CommandItem className="group" onSelect={onSelect} value={value}>
      <div className="transition-transform duration-200 group-hover:-rotate-12">
        <IconComponent className="mr-2 h-4 w-4" />
      </div>
      <span>{value}</span>
      {isActive && (
        <Badge className="ml-auto" variant="secondary">
          You are here
        </Badge>
      )}
    </CommandItem>
  );
};
