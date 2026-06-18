import { createFileRoute } from '@tanstack/react-router';
import { projectColumns } from '@/components/projects/columns';
import { ResourceListPage } from '@/components/resource-list-page';
import { queryKeys } from '@/lib/query-keys';
import { $getAllProjects } from '@/lib/server/project';

export const Route = createFileRoute('/(dashboard)/projects/')({
  component: Projects,
  loader: async ({ context: { queryClient } }) =>
    await queryClient.ensureQueryData({
      queryKey: queryKeys.project.listAll(),
      queryFn: () => $getAllProjects(),
    }),
  head: () => ({
    meta: [{ title: 'Projects | Dashboard' }, { name: 'description', content: 'Manage your portfolio projects' }],
  }),
});

function Projects() {
  return (
    <ResourceListPage
      columns={projectColumns}
      createLabel="Add Project"
      createTo="/projects/create"
      description="Manage your projects here."
      entityName="projects"
      errorTitle="Failed to load projects"
      queryFn={() => $getAllProjects()}
      queryKey={queryKeys.project.listAll()}
      title="Project List"
    />
  );
}
