'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getHotelById } from '@/lib/api';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { BookingForm } from '@/components/booking/BookingForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface BookingPageProps {
  params: Promise<{ hotelId: string }>;
}

function BookingContent({ params }: BookingPageProps) {
  const { hotelId } = use(params);
  const searchParams = useSearchParams();
  
  const initialCheckIn = searchParams.get('checkIn') || '';
  const initialCheckOut = searchParams.get('checkOut') || '';
  const initialGuests = parseInt(searchParams.get('guests') || '1', 10);

  const { data: hotel, isLoading, error } = useQuery({
    queryKey: ['hotel', hotelId],
    queryFn: () => getHotelById(hotelId),
    enabled: !!hotelId,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-0 shadow-lg">
          <CardContent className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground text-lg">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-0 shadow-lg">
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">Hotel not found.</p>
            <Button variant="outline" asChild>
              <Link href="/hotels">Browse all hotels</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href={`/hotels/${hotel.id}`}>
          ← Back to hotel details
        </Link>
      </Button>

      <div className="max-w-3xl mx-auto">
        <Card className="shadow-xl border-2">
          <CardHeader>
            <CardTitle className="text-3xl mb-2">Book {hotel.name}</CardTitle>
            <CardDescription className="text-base">
              Complete your booking in a few simple steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BookingForm
              hotel={hotel}
              initialCheckIn={initialCheckIn}
              initialCheckOut={initialCheckOut}
              initialGuests={initialGuests}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function BookingPage(props: BookingPageProps) {
  return (
    <ProtectedRoute>
      <BookingContent {...props} />
    </ProtectedRoute>
  );
}
