import { useQuery } from '@tanstack/react-query';
import type { ContributionDay } from '@xbrk/types';
import GithubActivityAreaChart from '@/components/github-stats/github-activity-area-chart';
import GithubActivityBarChart from '@/components/github-stats/github-activity-bar-chart';
import { type ContributionCountByDayOfWeek } from '@/lib/integrations/github';
import { queryKeys } from '@/lib/query-keys';

export default function GithubActivityGraph() {
  const { data: result, isLoading } = useQuery({
    queryKey: queryKeys.github.activity(),
    queryFn: async () => {
      const res = await fetch('/api/stats/github/activity');
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || 'Failed to fetch GitHub activity');
      }
      return res.json();
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const contributions = result?.data?.contributions;
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
