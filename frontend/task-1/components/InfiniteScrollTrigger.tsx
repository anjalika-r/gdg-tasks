'use client';

import { useEffect, useRef } from 'react';

interface InfiniteScrollTriggerProps {
  onIntersect: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export function InfiniteScrollTrigger({
  onIntersect,
  hasMore,
  isLoading,
}: InfiniteScrollTriggerProps) {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onIntersect();
        }
      },
      {
        rootMargin: '100px',
      }
    );

    const currentTrigger = triggerRef.current;
    if (currentTrigger) {
      observer.observe(currentTrigger);
    }

    return () => {
      if (currentTrigger) {
        observer.unobserve(currentTrigger);
      }
    };
  }, [hasMore, isLoading, onIntersect]);

  if (!hasMore) return null;

  return (
    <div ref={triggerRef} className="h-10 flex items-center justify-center">
      {isLoading && (
        <div className="text-zinc-500 dark:text-zinc-400 text-sm">Loading more...</div>
      )}
    </div>
  );
}
