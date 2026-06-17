import { useLocation } from '@tanstack/react-router';
import { type NavItem } from '@xbrk/config';
import { type User } from '@xbrk/db';
import { cn } from '@xbrk/ui';
import { useIsMobile } from '@xbrk/ui/hooks/use-mobile';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@xbrk/ui/navigation-menu';
import { Spinner } from '@xbrk/ui/spinner';
import { ThemeToggle } from '@xbrk/ui/theme-provider';
import { Suspense } from 'react';
import Link from '@/components/shared/link';
import { AvatarDropdown } from './avatar-dropdown';
import SearchCommand from './command-menu';

interface MainNavbarProps {
  links: NavItem[];
  user: User;
}

const NavBar = ({ links, user }: Readonly<MainNavbarProps>) => {
  const isMobile = useIsMobile();

  const activeLink = useLocation({
    select: (location) => links.find((link) => location.pathname.endsWith(link.href ?? '')),
  });

  return (
    <div className="flex flex-1 items-center justify-end gap-4 md:gap-6 lg:justify-between">
      <NavigationMenu aria-label="Main" className="hidden lg:flex" viewport={isMobile}>
        <NavigationMenuList className="gap-1">
          {links.map((link) => (
            <NavigationMenuItem key={link.title.trim()}>
              {link.content ? (
                <>
                  <NavigationMenuTrigger className="bg-transparent transition-colors hover:bg-muted/60">
                    {link.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-2 p-3 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {link.content.map((subItem) => (
                        <ListItem href={subItem.href} key={subItem.href.trim()} title={subItem.title}>
                          {subItem.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    'bg-transparent transition-all hover:bg-muted/60',
                    activeLink && link.href === activeLink.href && 'bg-muted/80 font-semibold text-foreground',
                    link.disabled && 'cursor-not-allowed opacity-60',
                  )}
                  target={link.href?.startsWith('http') ? '_blank' : '_self'}
                >
                  <Link to={link.href ?? '#'}>{link.title}</Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Desktop actions */}
      <div className="hidden items-center gap-2 lg:flex">
        {user && <AvatarDropdown user={user as User} />}
        <div className="flex items-center gap-1 rounded-2xl border border-border/50 bg-muted/30 p-1 backdrop-blur-sm">
          <Suspense fallback={<Spinner className="size-5" />}>
            <SearchCommand />
          </Suspense>
          <div aria-hidden="true" className="h-4 w-px bg-border/50" />
          <Suspense fallback={<Spinner className="size-5" />}>
            <ThemeToggle />
          </Suspense>
        </div>
      </div>

      {/* Mobile actions - just command menu */}
      <div className="flex items-center gap-2 lg:hidden">
        {user && <AvatarDropdown user={user as User} />}
        <Suspense fallback={<Spinner className="size-5" />}>
          <SearchCommand />
        </Suspense>
      </div>
    </div>
  );
};

function ListItem({ title, children, href, ...props }: React.ComponentPropsWithoutRef<'li'> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link className="group block rounded-lg p-3 transition-colors hover:bg-muted/60" to={href}>
          <div className="mb-1 font-medium text-sm leading-none transition-colors group-hover:text-foreground">
            {title}
          </div>
          <p className="line-clamp-2 text-muted-foreground text-xs leading-relaxed">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

export default NavBar;
