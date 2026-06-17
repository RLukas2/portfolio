import type { NavItem } from '@xbrk/config';
import { cn } from '@xbrk/ui';
import { ChevronRight } from 'lucide-react';
import { forwardRef, type ReactNode } from 'react';
import Link from '@/components/shared/link';

interface MobileNavProps {
  children?: ReactNode;
  items: NavItem[];
  onItemClick?: () => void;
}

const MobileNav = forwardRef<HTMLDivElement, MobileNavProps>(({ items, children, onItemClick }, ref) => (
  <div
    className="slide-in-from-top-8 fixed inset-0 top-20 z-50 animate-in overflow-auto bg-background/95 p-4 backdrop-blur-md"
    id="mobile-menu"
    ref={ref}
  >
    <div className="rounded-2xl border bg-card p-2 shadow-xl">
      <nav aria-label="Mobile" className="flex flex-col gap-1">
        {items.map((item) =>
          item.content ? (
            <div key={item.title}>
              <div className="px-3 py-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                {item.title}
              </div>
              {item.content.map((subItem) => (
                <Link
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl px-3 py-3 font-medium transition-colors hover:bg-muted',
                    subItem.disabled && 'cursor-not-allowed opacity-60',
                  )}
                  key={subItem.href}
                  onClick={onItemClick}
                  to={subItem.disabled ? '#' : subItem.href}
                >
                  <span>{subItem.title}</span>
                  <ChevronRight aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          ) : (
            <Link
              className={cn(
                'flex w-full items-center justify-between rounded-xl px-3 py-3 font-medium transition-colors hover:bg-muted',
                item.disabled && 'cursor-not-allowed opacity-60',
              )}
              key={item.href}
              onClick={onItemClick}
              to={item.disabled ? '#' : (item.href ?? '#')}
            >
              <span>{item.title}</span>
              <ChevronRight aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
            </Link>
          ),
        )}
      </nav>
      {children}
    </div>
  </div>
));

MobileNav.displayName = 'MobileNav';

export default MobileNav;
