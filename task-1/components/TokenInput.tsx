'use client';

import { useState } from 'react';
import { getStoredToken, setStoredToken, removeStoredToken } from '@/lib/storage';

interface TokenInputProps {
  onTokenChange: (token: string | null) => void;
}

export function TokenInput({ onTokenChange }: TokenInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [token, setToken] = useState<string>(() => getStoredToken() || '');

  const handleSave = () => {
    if (token.trim()) {
      setStoredToken(token.trim());
      onTokenChange(token.trim());
    } else {
      removeStoredToken();
      onTokenChange(null);
    }
    setIsExpanded(false);
  };

  const handleClear = () => {
    setToken('');
    removeStoredToken();
    onTokenChange(null);
    setIsExpanded(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 underline"
      >
        {getStoredToken() ? 'Update Token' : 'Add Personal Access Token'}
      </button>
      {isExpanded && (
        <div className="absolute top-8 right-0 z-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 shadow-lg w-80">
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">
            Optional: Add a GitHub Personal Access Token to increase rate limits.
          </p>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ghp_..."
            className="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 px-3 py-1.5 text-sm bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              Save
            </button>
            {getStoredToken() && (
              <button
                onClick={handleClear}
                className="px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
