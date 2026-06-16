import { createFileRoute, Outlet } from '@tanstack/react-router';
import type { UserType } from '@xbrk/types';
import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import DynamicMesh from '@/components/shared/dynamic-mesh';
import { navbarLinks } from '@/lib/constants/navbar';

export const Route = createFileRoute('/(public)')({
  component: LayoutComponent,
  loader: ({ context: { user } }) => ({ user }),
});

function LayoutComponent() {
  const { user } = Route.useLoaderData();

  return (
    <>
      <DynamicMesh />
      <Header links={navbarLinks} user={user as UserType} />
      <main
        className="container mx-auto flex-1 py-4 sm:py-6 md:py-10 lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl relative z-10"
        id="main-content"
      >
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
