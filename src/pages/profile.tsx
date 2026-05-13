import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { updateProfile, togglePersonalMode } from "../store/profileSlice";
import { User, Briefcase, MapPin, DollarSign, Save, ShieldCheck } from "lucide-react";

const SKILL_OPTIONS = [
  "JavaScript", "TypeScript", "Python", "Go", "Rust", "Java", "C++", "C#", "Ruby", "PHP", 
  "Swift", "Kotlin", "React", "Node", "Vue", "Angular", "Svelte", "Next.js", "Django", "Flask",
  "Spring", "Laravel", "Ruby on Rails", "AWS", "Docker", "Kubernetes",
  "SQL", "PostgreSQL", "MongoDB", "Redis", "GraphQL", "Machine Learning"
];

function ProfilePage() {
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile);
  
  const [selectedSkills, setSelectedSkills] = useState<string[]>(profile.skills);
  const [wantsRemote, setWantsRemote] = useState(profile.wantsRemote);
  const [minSalary, setMinSalary] = useState(profile.minSalary);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSave = () => {
    dispatch(updateProfile({ skills: selectedSkills, wantsRemote, minSalary }));
  };

  return (
    <div className="flex flex-col w-full h-screen p-4 md:p-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto w-full pb-10">
        <div className="flex items-center gap-3 mb-8">
          <User className="text-[rgb(var(--color-accent))] w-8 h-8" />
          <h1 className="text-3xl font-bold text-slate-900">Personal Recruiter</h1>
        </div>
        
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-1">Personal Mode</h2>
              <p className="text-sm text-gray-500">Filter jobs and repos based on your profile.</p>
            </div>
            <button
              onClick={() => dispatch(togglePersonalMode())}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                profile.personalModeActive ? "bg-[rgb(var(--color-accent))]" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  profile.personalModeActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="space-y-8">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-3">
                <Briefcase className="w-4 h-4" />
                Select Your Technical Skills
              </label>
              <div className="flex flex-wrap gap-2">
                {SKILL_OPTIONS.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                        isSelected 
                          ? "bg-[rgb(var(--color-accent))]/20 border-[rgb(var(--color-accent))] text-slate-900" 
                          : "bg-slate-50 border-slate-200 text-gray-500 hover:border-slate-400 hover:text-slate-900"
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                  <DollarSign className="w-4 h-4" />
                  Min Salary ($k)
                </label>
                <input
                  type="number"
                  value={minSalary || ""}
                  onChange={(e) => setMinSalary(Number(e.target.value))}
                  placeholder="e.g. 100"
                  className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-[rgb(var(--color-accent))] transition-colors"
                />
              </div>

              <div className="flex-1 flex items-end">
                <label className="flex items-center gap-3 cursor-pointer p-3 w-full bg-white border border-slate-300 rounded-lg hover:border-slate-500 transition-colors">
                  <input
                    type="checkbox"
                    checked={wantsRemote}
                    onChange={(e) => setWantsRemote(e.target.checked)}
                    className="w-5 h-5 accent-[rgb(var(--color-accent))]"
                  />
                  <div className="flex items-center gap-2 text-slate-900">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    Must be Remote
                  </div>
                </label>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="mt-4 flex items-center justify-center gap-2 w-full bg-[rgb(var(--color-accent))] hover:bg-[rgb(var(--color-accent))]/80 text-slate-900 font-medium py-3 rounded-lg transition-colors"
            >
              <Save className="w-5 h-5" />
              Save Profile Configuration
            </button>
          </div>
        </div>
        
        {profile.personalModeActive && (
          <div className="bg-[rgb(var(--color-accent))]/10 border border-[rgb(var(--color-accent))]/30 rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck className="text-[rgb(var(--color-accent))] w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-[rgb(var(--color-accent))] mb-1">Recruiter is Active</h3>
              <p className="text-sm text-gray-600">
                Your dashboard is now filtering out noise. You will only see opportunities matching your exact skills and preferences.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
