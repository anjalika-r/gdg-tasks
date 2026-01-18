import { Star, GitFork, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import type { SortOption } from '@/types/github';

type SortOrder = 'asc' | 'desc';

interface SortControlsProps {
  sortBy: SortOption;
  sortOrder: SortOrder;
  onSortChange: (sort: SortOption) => void;
  onOrderChange: (order: SortOrder) => void;
}

export function SortControls({ sortBy, sortOrder, onSortChange, onOrderChange }: SortControlsProps) {
  const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: 'stars', label: 'Stars', icon: <Star className="w-4 h-4" /> },
    { value: 'forks', label: 'Forks', icon: <GitFork className="w-4 h-4" /> },
    { value: 'updated', label: 'Updated', icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <div className="flex items-center gap-3 flex-wrap p-3 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg">
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Sort:</span>
      <div className="flex items-center gap-2">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onSortChange(option.value)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1.5 ${
              sortBy === option.value
                ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1 border-l border-zinc-200 dark:border-zinc-800 pl-3">
        <button
          onClick={() => onOrderChange('asc')}
          className={`p-1.5 rounded-md transition-colors ${
            sortOrder === 'asc'
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
          aria-label="Ascending"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <button
          onClick={() => onOrderChange('desc')}
          className={`p-1.5 rounded-md transition-colors ${
            sortOrder === 'desc'
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
          aria-label="Descending"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
