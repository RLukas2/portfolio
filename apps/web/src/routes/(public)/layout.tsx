import { createFileRoute, Outlet } from '@tanstack/react-router';
import type { UserType } from '@xbrk/types';
import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import { navbarLinks } from '@/lib/constants/navbar';

export const Route = createFileRoute('/(public)')({
  component: LayoutComponent,
  loader: ({ context: { user } }) => ({ user }),
});

function LayoutComponent() {
  const { user } = Route.useLoaderData();

  return (
    <>
      {/* Global Animated Mesh Background */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-50 bg-mesh" />

      <Header links={navbarLinks} user={user as UserType} />
      <main
        className="container mx-auto flex-1 py-4 sm:py-6 md:py-10 lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl"
        id="main-content"
      >
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
