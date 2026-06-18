import { createFileRoute } from '@tanstack/react-router';

import { ResourceListPage } from '@/components/resource-list-page';
import { snippetColumns } from '@/components/snippets/columns';
import { queryKeys } from '@/lib/query-keys';
import { $getAllSnippets } from '@/lib/server/snippet';

export const Route = createFileRoute('/(dashboard)/snippets/')({
  component: Snippets,
  loader: async ({ context: { queryClient } }) =>
    await queryClient.ensureQueryData({
      queryKey: queryKeys.snippet.listAll(),
      queryFn: () => $getAllSnippets(),
    }),
  head: () => ({
    meta: [{ title: 'Snippets | Dashboard' }, { name: 'description', content: 'Manage your portfolio snippets' }],
  }),
});

function Snippets() {
  return (
    <ResourceListPage
      columns={snippetColumns}
      createLabel="Add Snippet"
      createTo="/snippets/create"
      description="Manage your snippets here."
      entityName="snippets"
      errorTitle="Failed to load snippets"
      queryFn={() => $getAllSnippets()}
      queryKey={queryKeys.snippet.listAll()}
      title="Snippet List"
    />
  );
}
