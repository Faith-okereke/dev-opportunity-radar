import { useQuery } from "@tanstack/react-query";
import { fetchHNJobs, fetchRepos } from "../services/market-service";
import { Lightbulb, TrendingUp, Code } from "lucide-react";

const TECH_KEYWORDS = [
  "TypeScript",
  "Python",
  "Go",
  "Rust",
  "JavaScript",
  "React",
  "Node",
  "Vue",
  "AWS",
  "Docker",
  "Kubernetes",
  "C++",
  "Java"
];

const ROADMAP_LINKS: Record<string, string> = {
  "TypeScript": "https://roadmap.sh/typescript",
  "Python": "https://roadmap.sh/python",
  "Go": "https://roadmap.sh/golang",
  "Rust": "https://roadmap.sh/rust",
  "JavaScript": "https://roadmap.sh/javascript",
  "React": "https://roadmap.sh/frontend",
  "Node": "https://roadmap.sh/backend",
  "Vue": "https://roadmap.sh/frontend",
  "AWS": "https://roadmap.sh/aws",
  "Docker": "https://roadmap.sh/docker",
  "Kubernetes": "https://roadmap.sh/kubernetes",
  "C++": "https://roadmap.sh/cpp",
  "Java": "https://roadmap.sh/java"
};

const InsightsWidget = () => {
  const { data: jobs = [] } = useQuery({
    queryKey: ["jobsData", "All"],
    queryFn: () => fetchHNJobs("All"),
    staleTime: 1000 * 60 * 5,
  });

  const { data: repos = [] } = useQuery({
    queryKey: ["reposData", "All"],
    queryFn: () => fetchRepos("All"),
    staleTime: 1000 * 60 * 5,
  });

  if (jobs.length === 0 || repos.length === 0) return null;

  // 1. Analyze Jobs
  const jobCounts: Record<string, number> = {};
  TECH_KEYWORDS.forEach((tech) => (jobCounts[tech] = 0));

  let remoteJobsCount = 0;
  jobs.forEach((job: any) => {
    const text = (job.title + " " + (job.text || "")).toLowerCase();
    if (text.includes("remote")) remoteJobsCount++;

    TECH_KEYWORDS.forEach((tech) => {
      // Regex boundary check to avoid substring matching like "Go" in "Good"
      const regex = new RegExp(`\\b${tech.toLowerCase().replace('++', '\\+\\+')}\\b`, "i");
      if (regex.test(text)) {
        jobCounts[tech]++;
      }
    });
  });

  // Find top tech in jobs
  let topJobTech = "TypeScript";
  let topJobCount = 0;
  Object.entries(jobCounts).forEach(([tech, count]) => {
    if (count > topJobCount) {
      topJobCount = count;
      topJobTech = tech;
    }
  });

  const topJobPercent = Math.round((topJobCount / jobs.length) * 100) || 0;

  // 2. Analyze Repos
  const repoCounts: Record<string, number> = {};
  TECH_KEYWORDS.forEach((tech) => (repoCounts[tech] = 0));

  repos.forEach((repo: any) => {
    const lang = repo.language || "";
    const desc = repo.description || "";
    TECH_KEYWORDS.forEach((tech) => {
      if (lang.toLowerCase() === tech.toLowerCase() || desc.toLowerCase().includes(tech.toLowerCase())) {
        repoCounts[tech] = (repoCounts[tech] || 0) + 1;
      }
    });
  });

  let topRepoTech = "Rust";
  let topRepoCount = 0;
  Object.entries(repoCounts).forEach(([tech, count]) => {
    if (count > topRepoCount && tech !== topJobTech) { // Try to find a different trending tech for variety
      topRepoCount = count;
      topRepoTech = tech;
    }
  });

  return (
    <div className="w-full border border-[rgb(var(--color-accent))]/30 rounded-xl p-5 mb-6 shadow-lg shadow-[rgb(var(--color-accent))]/5">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="text-[rgb(var(--color-accent))] w-5 h-5" />
        <h3 className="font-bold text-slate-900 text-lg tracking-wide">What should I learn next?</h3>
      </div>

      <p className="text-gray-600 leading-relaxed text-sm md:text-base">
        Based on this week's live data:{" "}
        <a href={ROADMAP_LINKS[topJobTech]} target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-900 px-1 bg-slate-100 rounded hover:bg-slate-200 hover:text-[rgb(var(--color-accent))] transition-colors inline-flex items-center"><Code className="w-4 h-4 inline mr-1 mb-0.5" />{topJobTech}</a>{" "}
        appears in <strong className="text-[rgb(var(--color-accent))]">{topJobPercent}%</strong> of all HN job postings. Meanwhile,{" "}
        <a href={ROADMAP_LINKS[topRepoTech]} target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-900 px-1 bg-slate-100 rounded hover:bg-slate-200 hover:text-[rgb(var(--color-accent))] transition-colors inline-flex items-center"><TrendingUp className="w-4 h-4 inline mr-1 mb-0.5" />{topRepoTech}</a>{" "}
        is surging, trending across <strong className="text-blue-400">{topRepoCount}</strong> top repositories.
        If you are looking to stay highly hireable and catch the next wave, focus your upskilling here.
      </p>
    </div>
  );
};

export default InsightsWidget;
