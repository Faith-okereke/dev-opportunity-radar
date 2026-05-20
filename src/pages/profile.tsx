import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { updateProfile, togglePersonalMode } from "../store/profileSlice";
import { User, Briefcase, MapPin, DollarSign, Save, ShieldCheck, LoaderCircle, Code } from "lucide-react";
import toast from "react-hot-toast";

const SKILL_OPTIONS = [
  "JavaScript", "TypeScript", "Python", "Go", "Rust", "Java", "C++", "C#", "Ruby", "PHP",
  "Swift", "Kotlin", "React", "Node", "Vue", "Angular", "Svelte", "Next.js", "Django", "Flask",
  "Spring", "Laravel", "Ruby on Rails", "AWS", "Docker", "Kubernetes",
  "SQL", "PostgreSQL", "MongoDB", "Redis", "GraphQL", "Machine Learning", "PowerShell"
];

function ProfilePage() {
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile);

  const [selectedSkills, setSelectedSkills] = useState<string[]>(profile.skills);
  const [wantsRemote, setWantsRemote] = useState(profile.wantsRemote);
  const [minSalary, setMinSalary] = useState(profile.minSalary);
  const [saveLoading, setSaveLoading] = useState(false);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      dispatch(updateProfile({ skills: selectedSkills, wantsRemote, minSalary }));
      toast.success("Profile saved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save profile");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50/40 p-4 md:p-8 overflow-y-auto font-sans">
      <div className="max-w-4xl mx-auto w-full pb-16">
        
        {/* Header section with profile overview */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[rgb(var(--color-accent))]/10 text-[rgb(var(--color-accent))] rounded-2xl border border-[rgb(var(--color-accent))]/20 shadow-sm">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Personal Recruiter</h1>
              <p className="text-sm text-gray-500">Configure your search matching & recommendation filters</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-800">Personal Mode</p>
              <p className="text-[10px] text-gray-500 font-medium">
                {profile.personalModeActive ? "Feed filtering on" : "Feed filtering off"}
              </p>
            </div>
            <button
              onClick={() => dispatch(togglePersonalMode())}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                profile.personalModeActive ? "bg-[rgb(var(--color-accent))]" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                  profile.personalModeActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left panel: preferences & actions */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Preferences card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[rgb(var(--color-accent))]" />
                Job Preferences
              </h3>

              {/* Min Salary Input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-600">
                  Minimum Annual Salary
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={minSalary ? minSalary.toLocaleString() : ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      setMinSalary(val ? Number(val) : 0);
                    }}
                    placeholder="e.g. 100,000"
                    className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-8 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))]/20 focus:border-[rgb(var(--color-accent))] transition-all"
                  />
                </div>
              </div>

              {/* Remote toggle */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-600">
                  Location Preference
                </label>
                <div
                  onClick={() => setWantsRemote(!wantsRemote)}
                  className={`flex items-center justify-between cursor-pointer p-2.5 rounded-lg border transition-all ${
                    wantsRemote 
                      ? "bg-[rgb(var(--color-accent))]/5 border-[rgb(var(--color-accent))]/30" 
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span className="text-xs font-medium text-slate-700 flex items-center gap-2">
                    <MapPin className={`w-3.5 h-3.5 ${wantsRemote ? "text-[rgb(var(--color-accent))]" : "text-slate-400"}`} />
                    Must be Remote
                  </span>
                  <button
                    type="button"
                    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                      wantsRemote ? "bg-[rgb(var(--color-accent))]" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        wantsRemote ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Action card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <button
                onClick={handleSave}
                disabled={saveLoading}
                className="flex items-center justify-center gap-2 w-full bg-[rgb(var(--color-accent))] hover:bg-[rgb(var(--color-accent))]/90 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md shadow-[rgb(var(--color-accent))]/10 hover:shadow-[rgb(var(--color-accent))]/20 active:scale-[0.98] disabled:opacity-50"
              >
                {saveLoading ? <LoaderCircle className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                Save Configuration
              </button>
            </div>
            
          </div>

          {/* Right panel: technical skills */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Code className="w-4 h-4 text-[rgb(var(--color-accent))]" />
                Technical Skills Cloud
              </h3>
              <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2.5 py-0.5 rounded-full">
                {selectedSkills.length} Selected
              </span>
            </div>

            <p className="text-xs text-gray-400">
              Select keywords to match. The recruiter agent will automatically highlight job posts and trending repos aligning with your skillset.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {SKILL_OPTIONS.sort((a, b) => a.localeCompare(b)).map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 border ${
                      isSelected
                        ? "bg-[rgb(var(--color-accent))] border-[rgb(var(--color-accent))] text-white shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100/50"
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Active notification indicator */}
        {profile.personalModeActive && (
          <div className="mt-8 bg-[rgb(var(--color-accent))]/5 border border-[rgb(var(--color-accent))]/20 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
            <div className="p-2 bg-[rgb(var(--color-accent))]/10 rounded-xl text-[rgb(var(--color-accent))] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Recruiter Agent Active</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your dashboard feed is custom-tailored. Postings and codebases that don't match your skill tags or remote specifications are automatically hidden or down-ranked to prioritize the most relevant opportunities.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ProfilePage;
