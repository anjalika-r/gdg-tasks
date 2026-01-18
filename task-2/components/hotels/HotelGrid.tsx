'use client';

import type { Hotel } from '@/types/hotel';
import { HotelCard } from './HotelCard';

interface HotelGridProps {
  hotels: Hotel[];
}

export function HotelGrid({ hotels }: HotelGridProps) {
  if (hotels.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hotels found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hotels.map(hotel => (
        <HotelCard key={hotel.id} hotel={hotel} variant="grid" />
      ))}
    </div>
  );
}
