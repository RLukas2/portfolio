import { Link } from '@tanstack/react-router';
import { Button } from '@xbrk/ui/button';
import { PlusCircle } from 'lucide-react';
import React from 'react';

interface EmptyStateProps {
  actionLabel?: string;
  actionLink?: string;
  description: string;
  icon?: React.ReactNode;
  title: string;
}

export function EmptyState({ title, description, actionLabel, actionLink, icon }: EmptyStateProps) {
  return (
    <div className="fade-in-50 flex animate-in flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 p-8 text-center duration-500">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon ?? <PlusCircle className="h-8 w-8" />}
      </div>
      <h3 className="mb-2 font-semibold text-xl tracking-tight">{title}</h3>
      <p className="mb-6 max-w-sm text-muted-foreground text-sm">{description}</p>
      {actionLabel && actionLink && (
        <Link to={actionLink}>
          <Button variant="default">{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}
