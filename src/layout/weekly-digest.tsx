import { Mail, CheckCircle, TrendingUp, Building2 } from "lucide-react";
import { fetchHNJobs, fetchRepos } from "../services/market-service";
import { useQuery } from "@tanstack/react-query";

const WeeklyDigest = () => {
  const { data: jobs = [] } = useQuery({ queryKey: ["jobsData", "All"], queryFn: () => fetchHNJobs("All") });
  const { data: repos = [] } = useQuery({ queryKey: ["reposData", "All"], queryFn: () => fetchRepos("All") });

  if (!jobs.length || !repos.length) return null;

  // 1. Go Repos
  const goReposCount = repos.filter((r: any) => r.language?.toLowerCase() === "go").length;

  // 2. Remote React Jobs
  const remoteReactCount = jobs.filter((j: any) => {
    const text = (j.title + " " + (j.text || "")).toLowerCase();
    return text.includes("remote") && text.includes("react");
  }).length;

  // 3. Top Hiring Companies
  const companyCounts: Record<string, number> = {};
  jobs.forEach((j: any) => {
    if (j.company_name && j.company_name.length > 2 && j.company_name.toLowerCase() !== "unknown") {
      companyCounts[j.company_name] = (companyCounts[j.company_name] || 0) + 1;
    }
  });
  
  const topCompanies = Object.entries(companyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(entry => entry[0]);

  return (
    <div className="w-full bg-gradient-to-r from-purple-100 to-white border border-purple-500/30 rounded-xl p-5 mb-6 shadow-lg shadow-purple-500/5 flex flex-col md:flex-row gap-6 items-center">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-3">
          <Mail className="text-purple-400 w-5 h-5" />
          <h3 className="font-bold text-slate-900 text-lg tracking-wide">Weekly Market Digest</h3>
        </div>
        <p className="text-gray-600 text-sm mb-4">Here's what moved this week in your industry:</p>
        
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <TrendingUp className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span className="text-sm text-gray-700">
              <strong className="text-slate-900 text-base">{goReposCount}</strong> trending repositories blew up in Go this week.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span className="text-sm text-gray-700">
              <strong className="text-slate-900 text-base">{remoteReactCount}</strong> new remote React jobs were posted.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Building2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span className="text-sm text-gray-700">
              Top hiring companies right now: <strong className="text-slate-900">{topCompanies.join(", ")}</strong>.
            </span>
          </li>
        </ul>
      </div>

      <div className="md:w-64 w-full shrink-0 flex flex-col items-center bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
        <Mail className="w-8 h-8 text-purple-400 mb-2 opacity-80" />
        <h4 className="text-slate-900 font-medium mb-1">Get this in your inbox</h4>
        <p className="text-xs text-gray-500 mb-4">Never miss a massive market movement.</p>
        <button className="w-full bg-purple-600 hover:bg-purple-500 text-slate-900 font-medium py-2 rounded-lg text-sm transition-colors">
          Subscribe to Digest
        </button>
      </div>
    </div>
  );
};

export default WeeklyDigest;
