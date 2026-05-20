import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllJobs } from "../services/market-service";
import { Icon } from "@iconify/react";

const SKILLS = [
  "TypeScript", "JavaScript", "React", "Vue", "Angular", "Next.js", "Node.js", "Python",
  "Go", "Rust", "Java", "Kotlin", "Swift", "PHP", "Ruby", "C#", "Docker", "Kubernetes",
  "AWS", "GCP", "Azure", "PostgreSQL", "MongoDB", "Redis", "GraphQL", "REST", "Git",
  "Linux", "Terraform", "React Native", "Flutter", "Tailwind", "Django", "FastAPI",
  "Spring", "Laravel", "Rails", "Svelte", "Remix", "Prisma", "Supabase", "Firebase",
  "Vercel", "Netlify"
];

const ROADMAP_MAP: Record<string, string> = {
  "TypeScript": "/typescript",
  "JavaScript": "/javascript",
  "React": "/react",
  "Vue": "/vue",
  "Angular": "/angular",
  "Node.js": "/nodejs",
  "Python": "/python",
  "Go": "/golang",
  "Rust": "/rust",
  "Docker": "/docker",
  "Kubernetes": "/kubernetes",
  "AWS": "/aws",
  "MongoDB": "/mongodb",
  "PostgreSQL": "/postgresql",
  "React Native": "/react-native",
  "Flutter": "/flutter",
  "Django": "/python",
  "GraphQL": "/graphql",
  "Linux": "/linux",
  "Git": "/git"
};

export default function SkillsDemandWidget() {
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["allJobsData", "All"],
    queryFn: () => fetchAllJobs("All"),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation slightly after render
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, [jobs]);

  const topSkills = useMemo(() => {
    if (!jobs || jobs.length === 0) return [];

    const totalJobs = jobs.length;
    const skillCounts: Record<string, number> = {};

    jobs.forEach(job => {
      const fullText = `${job.title} ${job.text}`.toLowerCase();

      SKILLS.forEach(skill => {
        const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const regex = new RegExp(`(^|[^a-z0-9])${escapedSkill.toLowerCase()}([^a-z0-9]|$)`);

        if (regex.test(fullText)) {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        }
      });
    });

    const calculatedSkills = Object.entries(skillCounts)
      .map(([skill, count]) => ({
        skill,
        count,
        percentage: Math.round((count / totalJobs) * 100)
      }))
      .filter(item => item.percentage > 0)
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 10);

    return calculatedSkills;
  }, [jobs]);

  if (isLoading) {
    return (
      <div className="flex flex-col p-6 rounded-xl " style={{ backgroundColor: '#ffffff' }}>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#000000' }}>
          <Icon icon="mdi:chart-bar" className="text-black" />
          Skills in Demand
        </h2>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-6 bg-white/5 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (topSkills.length < 5) {
    return (
      <div className="flex flex-col p-6 rounded-xl " style={{ backgroundColor: '#ffffff', }}>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#000000' }}>
          <Icon icon="mdi:chart-bar" className="text-black" />
          Skills in Demand
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)' }} className="text-center py-6">
          Not enough job data to rank skills — try refreshing
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6 rounded-xl border border-slate-300/50 w-full" style={{ backgroundColor: '#ffffff' }}>
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: '#000000' }}>
        <Icon icon="mdi:chart-bar" className="text-[#7fff6e]" />
        Skills in Demand
      </h2>

      <div className="flex flex-col gap-5">
        {topSkills.map((item) => {
          const roadmapPath = ROADMAP_MAP[item.skill];

          return (
            <div key={item.skill} className="flex items-center gap-4 w-full group">
              <div className="w-24 shrink-0 flex items-center justify-between">
                <span className="font-semibold text-sm truncate" style={{ color: '#000000' }}>{item.skill}</span>
              </div>

              <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden relative">
                <div
                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    backgroundColor: 'rgb(var(--color-accent))',
                    width: animate ? `${item.percentage}%` : '0%'
                  }}
                />
              </div>

              <div className="w-10 shrink-0 text-right">
                <span className="text-xs font-mono font-bold" style={{ color: 'rgb(var(--color-accent))' }}>{item.percentage}%</span>
              </div>

              <div className="w-24 shrink-0 flex justify-end">
                {roadmapPath ? (
                  <a
                    href={`https://roadmap.sh${roadmapPath}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-mono px-2 py-1 border border-white/20 rounded text-white/70 hover:text-[#7fff6e] hover:border-[#7fff6e] transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 flex items-center gap-1"
                  >
                    Roadmap
                    <Icon icon="mdi:arrow-right" />
                  </a>
                ) : <span className="w-[74px]"></span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
