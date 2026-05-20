import { useEffect, useState } from "react";
import JobsList from "../layout/jobs-list";
import ReposList from "../layout/repos-list";
import { Icon } from "@iconify/react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { fetchHNJobs, fetchRepos } from "../services/market-service";
import InsightsWidget from "../layout/insights-widget";
import WeeklyDigest from "../layout/weekly-digest";
import SkillsDemandWidget from "../layout/skills-demand-widget";
import RepoLanguagesWidget from "../layout/repo-languages-widget";

function StatsRow() {
  const { data: jobs } = useQuery({ queryKey: ["jobsData", "All"], queryFn: () => fetchHNJobs("All"), staleTime: 1000 * 60 * 5 });
  const { data: repos } = useQuery({ queryKey: ["reposData", "All"], queryFn: () => fetchRepos("All"), staleTime: 1000 * 60 * 5 });

  return (
    <div className="flex gap-6 px-6 py-4 bg-slate-50 border-b border-slate-200 w-full">
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Total Jobs Loaded</span>
        <span className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Icon icon="mdi:briefcase" className="text-[rgb(var(--color-accent))]" />
          {jobs?.length || 0}
        </span>
      </div>
      <div className="w-px bg-slate-100 h-10 my-auto" />
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Trending Repos</span>
        <span className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Icon icon="mdi:github" className="text-[rgb(var(--color-accent))]" />
          {repos?.length || 0}
        </span>
      </div>
    </div>
  );
}

function Home() {
  const [time, setTime] = useState<Date>(new Date());
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const greeting = () => {
    const hour = time.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries();
    setLastRefreshed(new Date());
  };

  return (
    <div className="flex flex-col w-full h-screen p-4 md:p-0 overflow-y-auto overflow-x-hidden">
      <p className="text-center text-2xl font-extrabold md:hidden block mt-4">
        {greeting()}
      </p>
      <div className="border-b border-b-white/20 pb-4 flex justify-between w-full items-center px-6 pt-6 shrink-0">
        <p className="text-center text-2xl font-extrabold hidden md:block">
          {greeting()}
        </p>
        <div className="flex flex-col items-end">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 mb-2 bg-[rgb(var(--color-accent))]/20 hover:bg-[rgb(var(--color-accent))]/30 text-[rgb(var(--color-accent))] px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-[rgb(var(--color-accent))]/30"
          >
            <Icon icon="mdi:refresh" className="text-lg" />
            Sync Global Data
          </button>
          <p className="text-xs text-gray-500 font-medium">Last synced: {lastRefreshed.toLocaleTimeString()}</p>
        </div>
      </div>

      <StatsRow />

      <div className="px-6 mt-6 flex flex-col xl:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-6">
          <InsightsWidget />
          <SkillsDemandWidget />
        </div>
        <div className="flex-1 flex flex-col gap-6">
          <WeeklyDigest />
          <RepoLanguagesWidget />
        </div>
      </div>

      <div className="flex-1 flex md:flex-row flex-col items-start w-full gap-3 mt-2">
        <div className="md:w-[50%] w-full md:border-r border-slate-300 h-full overflow-y-auto">
          <JobsList isPreview={true} />
        </div>

        <div className="md:w-[50%] w-full h-full overflow-y-auto">
          <ReposList isPreview={true} />
        </div>
      </div>
    </div>
  );
}

export default Home;
