import { useQuery } from '@tanstack/react-query';
import { m } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import StatCard from '@/components/github-stats/card';
import GithubContributor from '@/components/github-stats/github-contributor';
import { queryKeys } from '@/lib/query-keys';

export default function Stats() {
  const { data: result } = useQuery({
    queryKey: queryKeys.github.stats(),
    queryFn: async () => {
      const res = await fetch('/api/stats/github');
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.error?.message ?? 'Failed to fetch GitHub stats');
      }

      return result;
    },
  });

  const githubData = result?.data;

  const statCards = [
    {
      title: 'Repositories',
      value: githubData?.repos,
      description: 'Public repositories',
      link: `${githubData?.user?.html_url}?tab=repositories`,
    },
    {
      title: 'Stars',
      value: githubData?.starsCount,
      description: 'Total stars received',
      link: githubData?.user?.html_url,
    },
    {
      title: 'Followers',
      value: githubData?.user?.followers,
      description: 'People following me',
      link: githubData?.user?.html_url,
    },
  ];

  return (
    <div className="space-y-8 relative pb-24">
      {/* Moving mesh background specific to Stats dashboard */}
      <div className="absolute inset-0 z-[-1] overflow-hidden rounded-3xl pointer-events-none opacity-50 mix-blend-screen">
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] rounded-full bg-blue-500/10 blur-[80px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-[40%] right-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[80px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <m.div
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background border border-white/10 shadow-inner">
          <FaGithub className="h-6 w-6 text-foreground/80" />
        </div>
        <h2 className="font-heading font-semibold text-2xl tracking-tight">GitHub Overview</h2>
      </m.div>

      {/* Stat cards - Glass dashboard style */}
      <m.div
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {statCards.map((card) => (
          <div key={card.title} className="glass-panel rounded-2xl border border-white/5 bg-background/40 hover:bg-background/60 transition-colors">
            <StatCard card={card} />
          </div>
        ))}
      </m.div>

      <div className="glass-panel rounded-3xl border border-white/5 bg-background/40 p-4 sm:p-8 mt-8">
        <GithubContributor />
      </div>
    </div>
  );
}
