'use client';

import { Star, GitFork, Calendar, Code2, Users, Lock, Globe, X, TrendingUp } from 'lucide-react';
import type { GitHubRepo, GitHubOrg } from '@/types/github';

interface StatsSidebarProps {
  repos: GitHubRepo[];
  orgData?: GitHubOrg | null;
  selectedRepo: GitHubRepo | null;
  onClose: () => void;
}

export function StatsSidebar({ repos, orgData, selectedRepo, onClose }: StatsSidebarProps) {
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
  const languages = repos.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  if (selectedRepo) {
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    };

  return (
    <div className="lg:h-full flex flex-col lg:border-l border-t lg:border-t-0 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Repository
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              aria-label="Close details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            {selectedRepo.name}
          </h3>
          {selectedRepo.description && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
              {selectedRepo.description}
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex items-center gap-2">
            <a
              href={selectedRepo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <Globe className="w-4 h-4" />
              View on GitHub
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900/30">
              <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-500 mb-1">
                <Star className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Stars</span>
              </div>
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {selectedRepo.stargazers_count.toLocaleString()}
              </div>
            </div>

            <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900/30">
              <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-500 mb-1">
                <GitFork className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Forks</span>
              </div>
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {selectedRepo.forks_count.toLocaleString()}
              </div>
            </div>
          </div>

          {selectedRepo.language && (
            <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg">
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 mb-2">
                <Code2 className="w-4 h-4" />
                <span className="text-sm font-medium">Language</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-sm text-zinc-900 dark:text-zinc-100 font-medium">
                  {selectedRepo.language}
                </span>
              </div>
            </div>
          )}

          <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 mb-2.5">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Dates</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-500">Created</span>
                <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                  {formatDate(selectedRepo.created_at)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-500">Updated</span>
                <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                  {formatDate(selectedRepo.updated_at)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <div className="flex items-center gap-2">
              {selectedRepo.private ? (
                <>
                  <Lock className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm text-zinc-900 dark:text-zinc-100">Private</span>
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm text-zinc-900 dark:text-zinc-100">Public</span>
                </>
              )}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-500">
              <span className="font-mono">{selectedRepo.default_branch}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

    return (
      <div className="lg:h-full flex flex-col lg:border-l border-t lg:border-t-0 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
      <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">
          Statistics
        </h2>
        {orgData && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
            {orgData.name || orgData.login}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900/30">
            <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-500 mb-1">
              <Code2 className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Repos</span>
            </div>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {repos.length}
            </div>
          </div>

          <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900/30">
            <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-500 mb-1">
              <Star className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Stars</span>
            </div>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {totalStars.toLocaleString()}
            </div>
          </div>

          <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900/30">
            <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-500 mb-1">
              <GitFork className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Forks</span>
            </div>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {totalForks.toLocaleString()}
            </div>
          </div>

          <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900/30">
            <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-500 mb-1">
              <Users className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Languages</span>
            </div>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {Object.keys(languages).length}
            </div>
          </div>
        </div>

        {topLanguages.length > 0 && (
          <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-zinc-500" />
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Top Languages
              </h3>
            </div>
            <div className="space-y-2">
              {topLanguages.map(([lang, count]) => (
                <div key={lang} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="text-sm text-zinc-900 dark:text-zinc-100">{lang}</span>
                  </div>
                  <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {orgData && (
          <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              About
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-3">
              {orgData.description || 'No description available'}
            </p>
            <a
              href={orgData.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Globe className="w-3.5 h-3.5" />
              View on GitHub
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
