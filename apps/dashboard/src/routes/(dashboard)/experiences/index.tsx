import { createFileRoute } from '@tanstack/react-router';
import { experienceColumns } from '@/components/experiences/columns';
import { ResourceListPage } from '@/components/resource-list-page';
import { queryKeys } from '@/lib/query-keys';
import { $getAllExperiences } from '@/lib/server/experience';

export const Route = createFileRoute('/(dashboard)/experiences/')({
  component: Experiences,
  loader: async ({ context: { queryClient } }) =>
    await queryClient.ensureQueryData({
      queryKey: queryKeys.experience.listAll(),
      queryFn: () => $getAllExperiences(),
    }),
  head: () => ({
    meta: [{ title: 'Experiences | Dashboard' }, { name: 'description', content: 'Manage your portfolio experiences' }],
  }),
});

function Experiences() {
  return (
    <ResourceListPage
      columns={experienceColumns}
      createLabel="Add Experience"
      createTo="/experiences/create"
      description="Manage your experiences here."
      entityName="experiences"
      errorTitle="Failed to load experiences"
      queryFn={() => $getAllExperiences()}
      queryKey={queryKeys.experience.listAll()}
      title="Experience List"
    />
  );
}
