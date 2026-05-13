import JobsList from "../layout/jobs-list";

function JobsPage() {
  return (
    <div className="flex flex-col w-full h-screen p-4 md:p-6 overflow-y-auto">
      <JobsList />
    </div>
  );
}

export default JobsPage;
