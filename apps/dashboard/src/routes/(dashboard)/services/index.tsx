import { createFileRoute } from '@tanstack/react-router';

import { ResourceListPage } from '@/components/resource-list-page';
import { serviceColumns } from '@/components/services/columns';
import { queryKeys } from '@/lib/query-keys';
import { $getAllServices } from '@/lib/server/service';

export const Route = createFileRoute('/(dashboard)/services/')({
  component: Services,
  loader: async ({ context: { queryClient } }) =>
    await queryClient.ensureQueryData({
      queryKey: queryKeys.service.listAll(),
      queryFn: () => $getAllServices(),
    }),
  head: () => ({
    meta: [{ title: 'Services | Dashboard' }, { name: 'description', content: 'Manage your portfolio services' }],
  }),
});

function Services() {
  return (
    <ResourceListPage
      columns={serviceColumns}
      createLabel="Add Service"
      createTo="/services/create"
      description="Manage your services here."
      entityName="services"
      errorTitle="Failed to load services"
      queryFn={() => $getAllServices()}
      queryKey={queryKeys.service.listAll()}
      title="Service List"
    />
  );
}
