import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@xbrk/ui/card';
import { FolderKanbanIcon, NewspaperIcon, UsersIcon } from 'lucide-react';
import { queryKeys } from '@/lib/query-keys';
import { $getRecentActivity } from '@/lib/server/stats';

export function RecentActivity() {
  const { data } = useSuspenseQuery({
    queryKey: queryKeys.stats.recentActivity(10),
    queryFn: () => $getRecentActivity({ data: { limit: 10 } }),
  });

  return (
    <Card className="col-span-1 border shadow-sm">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest items across the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.length === 0 ? (
            <p className="py-4 text-center text-muted-foreground text-sm">No recent activity.</p>
          ) : (
            data.map((item) => {
              const date = new Date(item.createdAt);
              return (
                <div className="flex items-center" key={`${item.type}-${item.id}`}>
                  <div className={'mr-4 flex h-9 w-9 items-center justify-center rounded-full border bg-background'}>
                    {item.type === 'user' && <UsersIcon className="h-4 w-4 text-blue-500" />}
                    {item.type === 'article' && <NewspaperIcon className="h-4 w-4 text-green-500" />}
                    {item.type === 'project' && <FolderKanbanIcon className="h-4 w-4 text-purple-500" />}
                  </div>
                  <div className="ml-2 space-y-1 overflow-hidden">
                    <p className="truncate font-medium text-sm leading-none">
                      <Link className="transition-colors hover:text-primary hover:underline" to={item.url}>
                        {item.title}
                      </Link>
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {item.type === 'user' ? 'Joined' : 'Created'} on{' '}
                      {date.toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
