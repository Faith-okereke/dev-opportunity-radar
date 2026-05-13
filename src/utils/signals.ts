export const isJobHotSignal = (job: any, repos: any[]): boolean => {
  if (!repos || repos.length === 0) return false;
  
  const jobText = (job.title + " " + job.company_name + " " + (job.text || "")).toLowerCase();
  
  return repos.some(repo => {
    const owner = repo.owner?.login?.toLowerCase();
    const name = repo.name?.toLowerCase();
    
    // Check if the repo owner or repo name (if > 4 chars to avoid false positives) is mentioned in the job post
    if (owner && owner.length > 3 && jobText.includes(owner)) return true;
    if (name && name.length > 4 && jobText.includes(name)) return true;
    return false;
  });
};

export const isRepoHotSignal = (repo: any, jobs: any[]): boolean => {
  if (!jobs || jobs.length === 0) return false;
  
  const owner = repo.owner?.login?.toLowerCase();
  const name = repo.name?.toLowerCase();
  
  if (!owner || owner.length <= 3) return false;

  return jobs.some(job => {
    const jobText = (job.title + " " + job.company_name + " " + (job.text || "")).toLowerCase();
    return jobText.includes(owner) || (name && name.length > 4 && jobText.includes(name));
  });
};
