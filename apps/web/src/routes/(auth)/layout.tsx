import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)')({
  beforeLoad: ({ context, location }) => {
    // Allow access to signin page without authentication
    if (location.pathname === '/signin') {
      return;
    }

    if (!context.user) {
      throw redirect({
        to: '/signin',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: LayoutComponent,
});

function LayoutComponent() {
  return (
    <main className="container mx-auto flex-1 py-6 md:py-10 lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
      <Outlet />
    </main>
  );
}
