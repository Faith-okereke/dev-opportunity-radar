import { Icon } from "@iconify/react";
import { fetchRepos } from "../services/market-service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { isRepoHotSignal } from "../utils/signals";
import { Flame } from "lucide-react";

const ITEMS_PER_PAGE = 10;

const ReposList = ({ isPreview = false }: { isPreview?: boolean }) => {
  const [language, setLanguage] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const profile = useSelector((state: RootState) => state.profile);

  const { data: rawRepos = [], isLoading: reposLoading } = useQuery({
    queryKey: ["reposData", language],
    queryFn: () => fetchRepos(language),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const jobsData = queryClient.getQueryData<any[]>(["jobsData", "All"]) || [];

  let filteredRepos = rawRepos;
  if (profile.personalModeActive && profile.skills.length > 0) {
    filteredRepos = rawRepos.filter((repo: any) => {
      const lang = (repo.language || "").toLowerCase();
      const desc = (repo.description || "").toLowerCase();
      
      return profile.skills.some(skill => {
        const s = skill.toLowerCase();
        return lang === s || desc.includes(s);
      });
    });
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredRepos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const displayRepos = isPreview 
    ? filteredRepos.slice(0, 5) 
    : filteredRepos.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleLanguageChange = (e: any) => {
    setLanguage(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="pb-4 w-full md:px-3">
      <div className="flex items-center justify-between mb-4 pb-4 px-2 border-b border-slate-200 min-h-12.5">
        <div className="flex items-center gap-1">
          <Icon
            icon="mdi:github"
            color="rgb(var(--color-accent))"
            className="text-xl"
          />
          <p className="uppercase text-xs text-[rgb(var(--color-accent))] tracking-widest font-bold flex items-center gap-2">
            {profile.personalModeActive ? "Your Perfect Repos" : "Trending Repos"}
            {!reposLoading && <span className="bg-slate-100 text-slate-900 px-2 py-0.5 rounded-full text-[10px]">{filteredRepos.length}</span>}
          </p>
        </div>
        {!isPreview && !profile.personalModeActive && (
          <select 
            value={language}
            onChange={handleLanguageChange}
            className="bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-900 focus:outline-none focus:border-[rgb(var(--color-accent))] transition-colors"
          >
            <option value="All">All Languages</option>
            <option value="TypeScript">TypeScript</option>
            <option value="Python">Python</option>
            <option value="Go">Go</option>
            <option value="Rust">Rust</option>
            <option value="JavaScript">JavaScript</option>
          </select>
        )}
      </div>
      <div className="flex flex-col gap-4 items-start px-3">
        {reposLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-full flex flex-col gap-2 animate-pulse p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="h-5 w-1/3 bg-slate-200 rounded" />
                <div className="h-4 w-2/3 bg-slate-200 rounded" />
                <div className="h-4 w-1/4 bg-slate-200 rounded" />
              </div>
            ))
          : displayRepos.map((repo: any) => {
              const isHot = isRepoHotSignal(repo, jobsData);
              return (
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col min-w-full p-4 rounded-xl border transition-colors cursor-pointer ${
                    isHot ? "bg-orange-500/10 border-orange-500/50 hover:border-orange-400" : "bg-slate-50 border-slate-200 hover:border-[rgb(var(--color-accent))]"
                  }`}
                  key={repo.id}
                >
                  <div className="flex justify-between items-start w-full mb-2">
                    <p className="font-semibold text-slate-900 text-lg truncate pr-2">
                      {repo.full_name}
                    </p>
                    <div className="flex items-center gap-3 shrink-0">
                      {isHot && (
                        <span className="flex items-center gap-1 text-xs font-bold text-orange-400 bg-orange-500/20 px-2 py-1 rounded-full">
                          <Flame className="w-3 h-3" /> Hot Signal
                        </span>
                      )}
                      <div className="flex items-center gap-1 text-[rgb(var(--color-accent))]">
                        <Icon icon="mdi:star" />
                        <p className="font-medium">
                          {repo.stargazers_count.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                    {repo.description || "No description provided."}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {repo.language && (
                      <div className="flex items-center gap-1">
                        <Icon icon="mdi:code-tags" />
                        <span>{repo.language}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Icon icon="mdi:source-fork" />
                      <span>{repo.forks_count.toLocaleString()}</span>
                    </div>
                  </div>
                </a>
              );
            })}
            
        {!reposLoading && displayRepos.length === 0 && (
          <p className="text-gray-500 text-sm text-center w-full py-8">No matching repositories found.</p>
        )}
      </div>

      {/* Pagination Controls */}
      {!isPreview && !reposLoading && totalPages > 1 && (
        <div className="flex items-center justify-between px-3 mt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 disabled:opacity-50 hover:bg-slate-100 transition-colors"
          >
            Previous
          </button>
          <span className="text-xs text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 disabled:opacity-50 hover:bg-slate-100 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {isPreview && !reposLoading && (
        <div className="flex items-center justify-center mt-6 text-sm text-[rgb(var(--color-accent))] hover:text-slate-900 transition cursor-pointer">
          <Link to="/repos" className="flex items-center gap-1 font-medium bg-slate-50 hover:bg-[rgb(var(--color-accent))]/20 px-4 py-2 rounded-lg border border-[rgb(var(--color-accent))]/30">
            <span>View All Repos</span>
            <Icon icon="ic:baseline-arrow-right-alt" className="text-lg" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default ReposList;
