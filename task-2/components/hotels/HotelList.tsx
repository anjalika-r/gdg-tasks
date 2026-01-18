'use client';

import type { Hotel } from '@/types/hotel';
import { HotelCard } from './HotelCard';

interface HotelListProps {
  hotels: Hotel[];
}

export function HotelList({ hotels }: HotelListProps) {
  if (hotels.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hotels found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {hotels.map(hotel => (
        <HotelCard key={hotel.id} hotel={hotel} variant="list" />
      ))}
    </div>
  );
}
