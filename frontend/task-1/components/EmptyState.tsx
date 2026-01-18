import { FolderOpen } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4">
        <FolderOpen className="w-16 h-16 text-zinc-400 dark:text-zinc-600" />
      </div>
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
        No Repositories Found
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400 max-w-md">
        This organization doesn't have any public repositories or they are all private.
      </p>
    </div>
  );
}
