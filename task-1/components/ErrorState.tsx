import { AlertTriangle } from 'lucide-react';
import type { GitHubApiError } from '@/types/github';

interface ErrorStateProps {
  error: GitHubApiError;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const is404 = error.status === 404;
  const is403 = error.status === 403;

  let title: string;
  let message: string;

  if (is404) {
    title = 'Organization Not Found';
    message = 'The organization you searched for does not exist or is not accessible.';
  } else if (is403) {
    title = 'Rate Limit Exceeded';
    message = 'GitHub API rate limit reached. You can add a personal access token to increase your rate limit.';
  } else {
    title = 'Something Went Wrong';
    message = error.message || 'An unexpected error occurred while fetching data.';
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4">
        <AlertTriangle className="w-16 h-16 text-zinc-400 dark:text-zinc-600" />
      </div>
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
        {title}
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400 max-w-md mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
