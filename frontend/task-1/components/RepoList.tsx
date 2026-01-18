'use client';

import { useMemo } from 'react';
import { RepoCard } from './RepoCard';
import { EmptyState } from './EmptyState';
import type { GitHubRepo, SortOption } from '@/types/github';

type SortOrder = 'asc' | 'desc';

interface RepoListProps {
  repos: GitHubRepo[];
  sortBy: SortOption;
  sortOrder: SortOrder;
  onSortChange: (sort: SortOption) => void;
  selectedRepoId: number | null;
  onRepoClick: (repo: GitHubRepo) => void;
}

export function RepoList({ repos, sortBy, sortOrder, onSortChange, selectedRepoId, onRepoClick }: RepoListProps) {
  const sortedRepos = useMemo(() => {
    const sorted = [...repos];
    let comparison: (a: GitHubRepo, b: GitHubRepo) => number;

    switch (sortBy) {
      case 'stars':
        comparison = (a, b) => b.stargazers_count - a.stargazers_count;
        break;
      case 'forks':
        comparison = (a, b) => b.forks_count - a.forks_count;
        break;
      case 'updated':
        comparison = (a, b) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        break;
      default:
        return sorted;
    }

    sorted.sort(comparison);

    // Reverse if ascending order
    if (sortOrder === 'asc') {
      sorted.reverse();
    }

    return sorted;
  }, [repos, sortBy, sortOrder]);

  if (repos.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {sortedRepos.map((repo) => (
        <RepoCard
          key={repo.id}
          repo={repo}
          onClick={() => onRepoClick(repo)}
          isSelected={selectedRepoId === repo.id}
        />
      ))}
    </div>
  );
}
