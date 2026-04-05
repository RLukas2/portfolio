import { Frown } from 'lucide-react';

interface EmptyStateProps {
  message: string;
}

/**
 * Empty State Component
 * This component displays a message indicating that there is no data available.
 */
const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div className="my-4 flex flex-col items-center justify-center space-y-3 py-8">
      <Frown className="size-12 text-muted-foreground" />
      <p className="text-center text-muted-foreground">{message}</p>
    </div>
  );
};

export default EmptyState;
