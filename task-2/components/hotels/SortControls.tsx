'use client';

import type { SortOption } from '@/types/hotel';
import { ArrowUpDown, Grid3x3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortControlsProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function SortControls({ sortBy, onSortChange, viewMode, onViewModeChange }: SortControlsProps) {
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Rating' },
  ];

  return (
    <div className="flex items-center justify-between gap-4 mb-6 flex-wrap bg-card p-4 rounded-lg border">
      <div className="flex items-center gap-3">
        <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
        <Label htmlFor="sort" className="text-sm font-medium">
          Sort by:
        </Label>
        <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
          <SelectTrigger id="sort" className="w-[180px]">
            <SelectValue placeholder="Select sort option" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 border rounded-lg p-1">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('grid')}
          className="gap-2"
        >
          <Grid3x3 className="w-4 h-4" />
          Grid
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('list')}
          className="gap-2"
        >
          <List className="w-4 h-4" />
          List
        </Button>
      </div>
    </div>
  );
}
