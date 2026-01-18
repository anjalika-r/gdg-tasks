'use client';

import Image from 'next/image';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchOrgMetadata } from '@/lib/api';
import type { GitHubApiError } from '@/types/github';

interface SearchInputProps {
  org: string;
  onOrgChange: (org: string) => void;
  token: string | null;
}

export function SearchInput({ org, onOrgChange, token }: SearchInputProps) {
  const [inputValue, setInputValue] = useState(org);

  useEffect(() => {
    setInputValue(org);
  }, [org]);

  const { data: orgData } = useQuery({
    queryKey: ['org-metadata', org],
    queryFn: () => fetchOrgMetadata(org, token || undefined),
    enabled: org.length > 0,
    retry: (failureCount, error) => {
      const apiError = error as GitHubApiError;
      return apiError.status !== 404 && apiError.status !== 403 && failureCount < 2;
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed) {
      onOrgChange(trimmed);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center gap-3">
        {orgData?.avatar_url && (
          <div className="flex-shrink-0">
            <Image
              src={orgData.avatar_url}
              alt={orgData.login}
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
        )}
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter organization name (e.g., github, microsoft)"
            className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors font-medium flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </div>
    </form>
  );
}
