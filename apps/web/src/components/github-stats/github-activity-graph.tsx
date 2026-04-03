import { useQuery } from '@tanstack/react-query';
import type { ContributionDay } from '@xbrk/types';
import GithubActivityAreaChart from '@/components/github-stats/github-activity-area-chart';
import GithubActivityBarChart from '@/components/github-stats/github-activity-bar-chart';
import { type ContributionCountByDayOfWeek } from '@/lib/integrations/github';
import { queryKeys } from '@/lib/query-keys';

export default function GithubActivityGraph() {
  const { data: contributions, isLoading } = useQuery({
    queryKey: queryKeys.github.activity(),
    queryFn: () => fetch('/api/stats/github/activity').then((res) => res.json()),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const contributionsByLast30Days = contributions?.contributionsByLast30Days as ContributionDay[];

  const contributionCountByDayOfWeek = contributions?.contributionCountByDayOfWeek as ContributionCountByDayOfWeek[];

  return (
    <div className="mt-12">
      <div className="font-bold font-heading text-neutral-900 text-xl capitalize sm:text-2xl dark:text-neutral-200">
        In Last 30 Days
      </div>

      <GithubActivityAreaChart contributionsByLast30Days={contributionsByLast30Days} />

      <div className="font-bold font-heading text-neutral-900 text-xl capitalize sm:text-2xl dark:text-neutral-200">
        Productivity by day of week
      </div>

      <GithubActivityBarChart contributionCountByDayOfWeek={contributionCountByDayOfWeek} />
    </div>
  );
}
