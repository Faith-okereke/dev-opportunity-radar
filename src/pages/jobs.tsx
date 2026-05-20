import { useState } from "react";
import JobsList from "../layout/jobs-list";

function JobsPage() {
  const [showAllJobs, setShowAllJobs] = useState(false);

  return (
    <div className="flex flex-col w-full h-screen p-4 md:p-6 overflow-y-auto">
      <JobsList onEmptyChange={(isEmpty) => setShowAllJobs(isEmpty)} />
      {showAllJobs && (
        <div className="mt-8 border-t border-slate-200 pt-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 pl-3">All Jobs</h2>
          <JobsList ignorePersonalMode={true} />
        </div>
      )}
    </div>
  );
}

export default JobsPage;
