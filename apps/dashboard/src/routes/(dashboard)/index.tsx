import { createFileRoute } from '@tanstack/react-router';
import { BlogViewsStats } from '@/components/stats/blog';
import { OverviewCards } from '@/components/stats/overview-cards';
import { RecentActivity } from '@/components/stats/recent-activity';
import { UsersStats } from '@/components/stats/users';
import { queryKeys } from '@/lib/query-keys';
import { $getMonthlyBlogViews, $getMonthlyUsers, $getRecentActivity, $getTotalStats } from '@/lib/server/stats';

export const Route = createFileRoute('/(dashboard)/')({
  component: DashboardIndex,
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData({
        queryKey: queryKeys.stats.total(),
        queryFn: () => $getTotalStats(),
      }),
      queryClient.ensureQueryData({
        queryKey: queryKeys.stats.recentActivity(10),
        queryFn: () => $getRecentActivity({ data: { limit: 10 } }),
      }),
      queryClient.ensureQueryData({
        queryKey: queryKeys.stats.monthlyBlogViews(6),
        queryFn: () => $getMonthlyBlogViews({ data: { months: 6 } }),
      }),
      queryClient.ensureQueryData({
        queryKey: queryKeys.stats.monthlyUsers(6),
        queryFn: () => $getMonthlyUsers({ data: { months: 6 } }),
      }),
    ]);
  },
});

function DashboardIndex() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-bold text-3xl tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your portfolio and site performance.</p>
      </div>
      <div className="flex-1 space-y-6">
        <OverviewCards />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4 space-y-6">
            <UsersStats />
            <BlogViewsStats />
          </div>
          <div className="col-span-3">
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
}
