export function SkeletonLoader() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 animate-pulse"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-md flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />
              <div className="flex gap-4 mt-3">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-16" />
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-16" />
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-20" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
