import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@xbrk/ui/card';
import { CodeIcon, FolderKanbanIcon, NewspaperIcon, UsersIcon } from 'lucide-react';
import { queryKeys } from '@/lib/query-keys';
import { $getTotalStats } from '@/lib/server/stats';

export function OverviewCards() {
  const { data } = useSuspenseQuery({
    queryKey: queryKeys.stats.total(),
    queryFn: () => $getTotalStats(),
  });

  const cards = [
    {
      title: 'Total Users',
      value: data.users,
      icon: UsersIcon,
      href: '/users',
      color: 'text-blue-500',
    },
    {
      title: 'Total Posts',
      value: data.articles,
      icon: NewspaperIcon,
      href: '/blog',
      color: 'text-green-500',
    },
    {
      title: 'Total Projects',
      value: data.projects,
      icon: FolderKanbanIcon,
      href: '/projects',
      color: 'text-purple-500',
    },
    {
      title: 'Total Snippets',
      value: data.snippets,
      icon: CodeIcon,
      href: '/snippets',
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link className="group outline-none" key={card.title} to={card.href}>
            <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-ring">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-muted-foreground text-sm">{card.title}</CardTitle>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{card.value}</div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
