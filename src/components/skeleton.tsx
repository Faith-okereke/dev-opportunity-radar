export const DigitalAssetSkeleton = () => {
  return (
    <div className="flex justify-between items-start w-full animate-pulse">
      {/* Left side */}
      <div className="flex flex-col gap-2">
        <div className="h-4 w-16 bg-gray-700 rounded"></div>
        <div className="h-3 w-24 bg-gray-800 rounded"></div>
      </div>

      {/* Right side */}
      <div className="flex flex-col gap-2 items-end">
        <div className="h-4 w-20 bg-gray-700 rounded"></div>
        <div className="h-3 w-12 bg-gray-800 rounded"></div>
      </div>
    </div>
  );
};
export const EnvironmentMonitorSkeleton = () => (
  <div className="p-6 pl-0 animate-pulse">
    <div className="h-3 w-36 bg-slate-200 rounded mb-6" />

    <div className="flex justify-between items-center py-3">
      <div className="flex flex-col gap-2">
        {/* City name */}
        <div className="h-12 w-48 bg-slate-200 rounded" />
      </div>
      {/* Temperature */}
      <div className="h-24 w-40 bg-slate-200 rounded" />
    </div>

    {/* Description line */}
    <div className="flex flex-col gap-2 mt-2">
      <div className="h-3  bg-slate-200 rounded" />
      <div className="h-3 w-2/3 bg-slate-200 rounded" />
    </div>

    <div className="flex justify-between items-center pt-12 mt-6 border-t border-t-[rgb(var(--color-border))]">
      {["humidity", "precipitation", "wind speed"].map((label) => (
        <div key={label} className="flex flex-col gap-2">
          <div className="h-3 w-24 bg-slate-200 rounded" />
          <div className="h-4 w-16 bg-slate-200 rounded" />
        </div>
      ))}
    </div>
  </div>
);