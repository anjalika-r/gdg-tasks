'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Booking } from '@/types/hotel';
import { Calendar, Users, X, MapPin } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelBookingAPI } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface BookingCardProps {
  booking: Booking;
}

export function BookingCard({ booking }: BookingCardProps) {
  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: (bookingId: string) => cancelBookingAPI(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      cancelMutation.mutate(booking.id);
    }
  };

  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);
  const isUpcoming = checkInDate > new Date();
  const isPast = checkOutDate < new Date();

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2">
      <div className="flex flex-col md:flex-row">
        <div className="relative w-full md:w-48 h-48 md:h-auto">
          <Image
            src={booking.hotelImage || 'https://picsum.photos/800/600'}
            alt={booking.hotelName}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-1">
                {booking.hotelName}
              </h3>
              <p className="text-muted-foreground text-sm flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {booking.roomName}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge 
                variant={booking.status === 'confirmed' ? 'default' : 'destructive'}
              >
                {booking.status === 'confirmed' ? 'Confirmed' : 'Cancelled'}
              </Badge>
              {isPast && booking.status === 'confirmed' && (
                <Badge variant="secondary">Past</Badge>
              )}
              {isUpcoming && booking.status === 'confirmed' && (
                <Badge variant="outline" className="border-primary text-primary">
                  Upcoming
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Check-in</p>
                <p className="font-medium text-foreground">{checkInDate.toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Check-out</p>
                <p className="font-medium text-foreground">{checkOutDate.toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Guests</p>
                <p className="font-medium text-foreground">{booking.guests}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-bold text-foreground">
                ${booking.priceBreakdown.total.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t">
            <p className="text-xs text-muted-foreground flex-1">
              Booking ID: <span className="font-mono text-foreground">{booking.id}</span>
            </p>
            <div className="flex gap-2">
              {isUpcoming && booking.status === 'confirmed' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  disabled={cancelMutation.isPending}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="w-4 h-4 mr-1" />
                  {cancelMutation.isPending ? 'Cancelling...' : 'Cancel'}
                </Button>
              )}
              <Button variant="outline" size="sm" asChild>
                <Link href={`/hotels/${booking.hotelId}`}>
                  View Hotel
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
