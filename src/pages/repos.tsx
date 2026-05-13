import ReposList from "../layout/repos-list";

function ReposPage() {
  return (
    <div className="flex flex-col w-full h-screen p-4 md:p-6 overflow-y-auto">
      <ReposList />
    </div>
  );
}

export default ReposPage;
