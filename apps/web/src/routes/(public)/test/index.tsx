import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(public)/test/')({
  component: RouteComponent,
});

function BombComponent(): never {
  throw new Error('Test error boundary!');
}

function RouteComponent() {
  return <BombComponent />;
}
