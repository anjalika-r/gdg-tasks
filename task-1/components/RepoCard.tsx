import { Star, GitFork, Calendar, Code2, Lock } from 'lucide-react';
import type { GitHubRepo } from '@/types/github';

interface RepoCardProps {
  repo: GitHubRepo;
  onClick?: () => void;
  isSelected?: boolean;
}

export function RepoCard({ repo, onClick, isSelected }: RepoCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      onClick={onClick}
      className={`border rounded-lg p-4 transition-colors cursor-pointer ${
        isSelected
          ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-900'
          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {repo.name}
            </h3>
            {repo.private && (
              <Lock className="w-4 h-4 text-zinc-500" />
            )}
          </div>
          {repo.description && (
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3 line-clamp-2">
              {repo.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-500">
            {repo.language && (
              <span className="flex items-center gap-1">
                <Code2 className="w-4 h-4" />
                {repo.language}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              {repo.stargazers_count}
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="w-4 h-4" />
              {repo.forks_count}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(repo.updated_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
