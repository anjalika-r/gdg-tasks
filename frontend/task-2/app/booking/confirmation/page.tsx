'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getBookingById } from '@/lib/storage';
import { getHotelById } from '@/lib/api';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { CheckCircle, Calendar, MapPin, Users, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get('id');

  const { data: booking } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => {
      if (!bookingId) return null;
      return getBookingById(bookingId);
    },
    enabled: !!bookingId,
  });

  const { data: hotel } = useQuery({
    queryKey: ['hotel', booking?.hotelId],
    queryFn: () => booking?.hotelId ? getHotelById(booking.hotelId) : null,
    enabled: !!booking?.hotelId,
  });

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Booking not found.</p>
          <Button variant="outline" asChild>
            <Link href="/my-bookings">
              View my bookings
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-xl border-2 text-center">
          <CardContent className="p-8 md:p-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Your booking has been successfully confirmed. A confirmation email has been sent to your email address.
            </p>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-8">
              <p className="text-sm text-muted-foreground mb-1">Booking Reference</p>
              <p className="text-2xl font-bold text-primary">{booking.id}</p>
            </div>

            <Card className="mb-8 text-left border-2">
              <CardHeader>
                <CardTitle className="text-xl mb-4">Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    {hotel?.name || booking.hotelName}
                  </h3>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {hotel?.location.address || booking.hotelName}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Check-in</p>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(booking.checkIn).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Check-out</p>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Guests</p>
                    <p className="font-medium flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {booking.guests}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Room</p>
                    <p className="font-medium">
                      {booking.roomName}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Guest Information</p>
                  <p className="font-medium mb-1">{booking.guestDetails.fullName}</p>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {booking.guestDetails.email}
                  </p>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {booking.guestDetails.phone}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount</span>
                    <span className="text-3xl font-bold text-primary">
                      ${booking.priceBreakdown.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/my-bookings">
                  View My Bookings
                </Link>
              </Button>
              {hotel && (
                <Button variant="outline" size="lg" asChild>
                  <Link href={`/hotels/${hotel.id}`}>
                    View Hotel
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }>
        <ConfirmationContent />
      </Suspense>
    </ProtectedRoute>
  );
}
