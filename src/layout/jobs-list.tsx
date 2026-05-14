import { Icon } from "@iconify/react";
import { fetchAllJobs } from "../services/market-service";
import type { UnifiedJob } from "../services/market-service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { isJobHotSignal } from "../utils/signals";
import { Flame, Briefcase } from "lucide-react";

const ITEMS_PER_PAGE = 10;

const JobsList = ({ isPreview = false }: { isPreview?: boolean }) => {
  const [keyword, setKeyword] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const profile = useSelector((state: RootState) => state.profile);

  const { data: rawJobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ["jobsData", keyword],
    queryFn: () => fetchAllJobs(keyword),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnWindowFocus: false,
  });


  const reposData = queryClient.getQueryData<any[]>(["reposData", "All"]) || [];

  let filteredJobs = rawJobs;
  if (profile.personalModeActive) {
    filteredJobs = rawJobs.filter((job: any) => {
      const text = (job.title + " " + job.company_name + " " + (job.text || "")).toLowerCase();
      
      if (profile.skills.length > 0) {
        const hasSkill = profile.skills.some(skill => text.includes(skill.toLowerCase()));
        if (!hasSkill) return false;
      }
      
      if (profile.wantsRemote && !text.includes("remote")) return false;
      
      if (profile.minSalary > 0) {
        const salaryMatch = text.match(/\$?(\d{2,3})(k|,000)/i);
        if (salaryMatch) {
          const sal = parseInt(salaryMatch[1]);
          if (sal < profile.minSalary) return false;
        } else {
          return false; // Skip if no salary mentioned
        }
      }
      return true;
    });
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  
  const displayJobs = isPreview 
    ? filteredJobs.slice(0, 5) 
    : filteredJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset page when keyword changes
  const handleKeywordChange = (e: any) => {
    setKeyword(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="pb-4 w-full md:px-3">
      <div className="flex items-center justify-between mb-4 pb-4 px-2 border-b border-slate-200 min-h-12.5">
        <div className="flex items-center gap-1">
          <Icon
            icon="mdi:briefcase"
            color="rgb(var(--color-accent))"
            className="text-xl"
          />
          <p className="uppercase text-xs text-[rgb(var(--color-accent))] tracking-widest font-bold flex items-center gap-2">
            {profile.personalModeActive ? "Your Perfect Matches" : "Job Market"}
            {!jobsLoading && <span className="bg-slate-100 text-slate-900 px-2 py-0.5 rounded-full text-[10px]">{filteredJobs.length}</span>}
          </p>
        </div>
        {!isPreview && !profile.personalModeActive && (
          <select 
            value={keyword}
            onChange={handleKeywordChange}
            className="bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-900 focus:outline-none focus:border-[rgb(var(--color-accent))] transition-colors"
          >
            <option value="All">All Roles</option>
            <option value="remote">Remote</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="fullstack">Fullstack</option>
          </select>
        )}
      </div>
      <div className="flex flex-col gap-4 items-start px-3">
        {jobsLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-full flex flex-col gap-2 animate-pulse p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="h-5 w-1/3 bg-slate-200 rounded" />
                <div className="h-4 w-2/3 bg-slate-200 rounded" />
              </div>
            ))
          : displayJobs.map((job: UnifiedJob) => {
              const isHot = isJobHotSignal(job, reposData);
              return (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col min-w-full p-4 rounded-xl border transition-colors cursor-pointer ${
                    isHot ? "bg-orange-500/10 border-orange-500/50 hover:border-orange-400" : "bg-slate-50 border-slate-200 hover:border-[rgb(var(--color-accent))]"
                  }`}
                  key={job.id}
                >
                  <div className="flex justify-between items-start w-full mb-1 gap-2">
                    <p className="font-semibold text-slate-900 text-lg line-clamp-2 leading-tight">
                      {job.title}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                        job.source === 'HN' ? 'bg-[#ff6600]/20 text-[#ff6600]' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {job.source}
                      </span>
                      {isHot && (
                        <span className="flex items-center gap-1 text-xs font-bold text-orange-400 bg-orange-500/20 px-2 py-1 rounded-full">
                          <Flame className="w-3 h-3" /> Hot Signal
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-[rgb(var(--color-accent))] font-medium text-sm flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" />
                      {job.company_name}
                    </p>
                  </div>
                </a>
              );
            })}
            
        {!jobsLoading && displayJobs.length === 0 && (
          <p className="text-gray-500 text-sm text-center w-full py-8">No matching jobs found.</p>
        )}
      </div>

      {/* Pagination Controls */}
      {!isPreview && !jobsLoading && totalPages > 1 && (
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

      {isPreview && !jobsLoading && (
        <div className="flex items-center justify-center mt-6 text-sm text-[rgb(var(--color-accent))] hover:text-slate-900 transition cursor-pointer">
          <Link to="/jobs" className="flex items-center gap-1 font-medium bg-slate-50 hover:bg-[rgb(var(--color-accent))]/20 px-4 py-2 rounded-lg border border-[rgb(var(--color-accent))]/30">
            <span>View All Jobs</span>
            <Icon icon="ic:baseline-arrow-right-alt" className="text-lg" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default JobsList;
