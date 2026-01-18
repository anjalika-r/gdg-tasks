'use client';

import { useQuery } from '@tanstack/react-query';
import { getUserBookingsAPI } from '@/lib/api';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { BookingCard } from '@/components/Profile/BookingCard';
import { Calendar, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { Booking } from '@/types/hotel';

function MyBookingsContent() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: getUserBookingsAPI,
  });

  const filteredBookings = useMemo(() => {
    const now = new Date();
    return bookings.filter(booking => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      
      if (filter === 'upcoming') {
        return checkIn > now && booking.status === 'confirmed';
      }
      if (filter === 'past') {
        return checkOut < now || booking.status === 'cancelled';
      }
      return true;
    });
  }, [bookings, filter]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-0 shadow-lg">
          <CardContent className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground text-lg">Loading bookings...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          My Bookings
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage all your hotel reservations
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter:</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({bookings.length})
          </Button>
          <Button
            variant={filter === 'upcoming' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('upcoming')}
          >
            Upcoming ({bookings.filter(b => new Date(b.checkIn) > new Date() && b.status === 'confirmed').length})
          </Button>
          <Button
            variant={filter === 'past' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('past')}
          >
            Past ({bookings.filter(b => new Date(b.checkOut) < new Date() || b.status === 'cancelled').length})
          </Button>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <Card className="border-2 border-dashed shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2 text-lg">
              {filter === 'all' ? 'No bookings found' : `No ${filter} bookings found`}
            </p>
            <p className="text-sm text-muted-foreground">
              {filter === 'all' ? 'Start booking hotels to see them here' : 'Try selecting a different filter'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map(booking => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <ProtectedRoute>
      <MyBookingsContent />
    </ProtectedRoute>
  );
}
