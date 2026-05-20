import { useQuery } from "@tanstack/react-query";
import { fetchRepos } from "../services/market-service";
import { Icon } from "@iconify/react";
import { useMemo, useState, useEffect } from "react";

const LANGUAGE_COLORS: Record<string, string> = {
  "TypeScript": "#3178c6",
  "JavaScript": "#f1e05a",
  "Python": "#3572A5",
  "Go": "#00ADD8",
  "Rust": "#dea584",
  "C++": "#f34b7d",
  "Java": "#b07219",
  "C#": "#178600",
  "Ruby": "#701516",
  "PHP": "#4F5D95",
  "HTML": "#e34c26",
  "Shell": "#89e051",
  "Swift": "#F05138"
};

export default function RepoLanguagesWidget() {
  const { data: repos = [], isLoading } = useQuery({
    queryKey: ["reposData", "All"],
    queryFn: () => fetchRepos("All"),
    staleTime: 1000 * 60 * 5,
  });

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (repos.length > 0) {
      const timer = setTimeout(() => setAnimate(true), 150);
      return () => clearTimeout(timer);
    }
  }, [repos]);

  const languageStats = useMemo(() => {
    if (!repos || repos.length === 0) return [];

    const counts: Record<string, number> = {};
    let totalWithLanguage = 0;

    repos.forEach((repo: any) => {
      const lang = repo.language;
      if (lang) {
        counts[lang] = (counts[lang] || 0) + 1;
        totalWithLanguage++;
      }
    });

    return Object.entries(counts)
      .map(([language, count]) => ({
        language,
        count,
        percentage: Math.round((count / totalWithLanguage) * 100),
        color: LANGUAGE_COLORS[language] || "#cbd5e1"
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [repos]);

  if (isLoading) {
    return (
      <div className="w-full border border-blue-500/20 rounded-xl p-5 mb-6 shadow-lg shadow-blue-500/5 bg-white">
        <h3 className="font-bold text-slate-900 text-lg tracking-wide mb-4 flex items-center gap-2">
          <Icon icon="mdi:code-tags" className="text-blue-500 w-5 h-5" />
          Trending Language Distribution
        </h3>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-6 bg-slate-100 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (repos.length === 0 || languageStats.length === 0) {
    return null;
  }

  return (
    <div className="w-full border border-blue-500/20 rounded-xl p-5 mb-6 shadow-lg shadow-blue-500/5 bg-white">
      <div className="flex items-center gap-2 mb-3">
        <Icon icon="mdi:chart-pie" className="text-blue-500 w-5 h-5" />
        <h3 className="font-bold text-slate-900 text-lg tracking-wide">Language Distributions</h3>
      </div>
      <p className="text-gray-500 text-xs mb-4">Breakdown of primary technologies in the top {repos.length} trending repos:</p>

      <div className="flex flex-col gap-4">
        {languageStats.map((stat) => (
          <div key={stat.language} className="flex items-center gap-3">
            <div className="w-24 shrink-0 flex items-center gap-2">
              <span 
                className="w-3 h-3 rounded-full inline-block shrink-0" 
                style={{ backgroundColor: stat.color }}
              />
              <span className="text-sm font-semibold text-slate-700 truncate">{stat.language}</span>
            </div>

            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden relative">
              <div 
                className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  backgroundColor: stat.color,
                  width: animate ? `${stat.percentage}%` : '0%'
                }}
              />
            </div>

            <div className="w-12 shrink-0 text-right">
              <span className="text-xs font-mono font-bold text-slate-500">{stat.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
