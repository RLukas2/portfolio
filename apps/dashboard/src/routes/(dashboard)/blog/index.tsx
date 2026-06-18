import { createFileRoute } from '@tanstack/react-router';

import { blogColumns } from '@/components/blog/columns';
import { ResourceListPage } from '@/components/resource-list-page';
import { queryKeys } from '@/lib/query-keys';
import { $getAllArticles } from '@/lib/server/blog';

export const Route = createFileRoute('/(dashboard)/blog/')({
  component: Articles,
  head: () => ({
    meta: [{ title: 'Blog | Dashboard' }, { name: 'description', content: 'Manage your portfolio blog' }],
  }),
});

function Articles() {
  return (
    <ResourceListPage
      columns={blogColumns}
      createLabel="Add Article"
      createTo="/blog/create"
      description="Manage your articles here."
      entityName="articles"
      errorTitle="Failed to load articles"
      queryFn={() => $getAllArticles()}
      queryKey={queryKeys.blog.listAll()}
      title="Article List"
    />
  );
}
