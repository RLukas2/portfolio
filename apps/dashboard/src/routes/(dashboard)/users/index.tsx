import { ErrorBoundary } from '@sentry/tanstackstart-react';
import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import type { UserType } from '@xbrk/types';
import { Card } from '@xbrk/ui/card';

import { DataTable } from '@/components/data-table/data-table';
import { userColumns } from '@/components/users/columns';
import { auth } from '@/lib/auth/server';

const getUsers = createServerFn({ method: 'GET' }).handler(async () => {
  const { headers } = getRequest();

  const data = await auth.api.listUsers({
    query: {
      sortBy: 'createdAt',
      sortDirection: 'desc',
    },
    headers,
  });

  return { users: data.users as UserType[] };
});

export const Route = createFileRoute('/(dashboard)/users/')({
  component: Users,
  loader: async () => {
    const result = await getUsers();
    return result;
  },
  head: () => ({
    meta: [{ title: 'Users | Dashboard' }, { name: 'description', content: 'Manage your portfolio users' }],
  }),
});

function UsersError() {
  return (
    <Card className="p-6">
      <div className="text-center">
        <h3 className="font-medium text-destructive text-lg">Failed to load users</h3>
        <p className="mt-1 text-muted-foreground text-sm">Please try again later.</p>
      </div>
    </Card>
  );
}

function UsersContent() {
  const { users } = Route.useLoaderData();

  return <DataTable columns={userColumns} data={users} entityName="users" />;
}

function Users() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-3xl tracking-tight">Users</h2>
          <p className="text-muted-foreground">Manage and organize your portfolio users.</p>
        </div>
      </div>
      <ErrorBoundary fallback={<UsersError />}>
        <UsersContent />
      </ErrorBoundary>
    </div>
  );
}
