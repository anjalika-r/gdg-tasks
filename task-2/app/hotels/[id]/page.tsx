'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getHotelById } from '@/lib/api';
import { ImageCarousel } from '@/components/shared/ImageCarousel';
import { Map } from '@/components/shared/Map';
import { MapPin, Star, Wifi, Car, Waves, Snowflake, Dumbbell, Utensils, Coffee, Sparkles } from 'lucide-react';
import { isAuthenticated } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface HotelDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function HotelDetailsPage({ params }: HotelDetailsPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const { data: hotel, isLoading, error } = useQuery({
    queryKey: ['hotel', id],
    queryFn: () => getHotelById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-0 shadow-lg">
          <CardContent className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground text-lg">Loading hotel details...</p>
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

  const amenityIcons: Record<string, React.ReactNode> = {
    WiFi: <Wifi className="w-5 h-5" />,
    Parking: <Car className="w-5 h-5" />,
    Pool: <Waves className="w-5 h-5" />,
    AC: <Snowflake className="w-5 h-5" />,
    Gym: <Dumbbell className="w-5 h-5" />,
    Restaurant: <Utensils className="w-5 h-5" />,
    Bar: <Coffee className="w-5 h-5" />,
    Spa: <Sparkles className="w-5 h-5" />,
  };

  const handleBookNow = () => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    router.push(`/booking/${hotel.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/hotels">
          ← Back to hotels
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          {hotel.name}
        </h1>
        <div className="flex items-center gap-4 flex-wrap">
          <p className="text-muted-foreground flex items-center gap-1">
            <MapPin className="w-4 h-4 text-primary" />
            {hotel.location.address}
          </p>
          <div className="flex items-center gap-1 text-yellow-500">
            {[...Array(hotel.starRating)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>
          <Badge variant="secondary">{hotel.propertyType}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 space-y-8">
          <ImageCarousel images={hotel.images} alt={hotel.name} />

          <div>
            <h2 className="text-2xl font-semibold mb-4">About</h2>
            <p className="text-muted-foreground leading-relaxed">
              {hotel.description}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {hotel.amenities.map(amenity => (
                <div
                  key={amenity}
                  className="flex items-center gap-2 p-3 bg-muted rounded-lg"
                >
                  {amenityIcons[amenity] || <div className="w-5 h-5 rounded-full bg-muted-foreground/20" />}
                  <span className="text-foreground">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {hotel.reviews && hotel.reviews.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Reviews ({hotel.reviewsCount})
              </h2>
              <div className="space-y-4">
                {hotel.reviews.slice(0, 5).map(review => (
                  <Card key={review.id} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {review.userName}
                          </span>
                          <div className="flex items-center gap-1 text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-semibold mb-4">Location</h2>
            <Map lat={hotel.location.coordinates.lat} lng={hotel.location.coordinates.lng} hotelName={hotel.name} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-xl border-2">
            <CardContent className="p-6">
              <div className="mb-6">
                <div className="text-3xl font-bold mb-2">
                  ${hotel.pricePerNight}
                  <span className="text-lg font-normal text-muted-foreground">/night</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-500 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.round(hotel.rating) ? 'fill-current' : ''}`}
                    />
                  ))}
                  <span className="ml-2 font-medium">
                    {hotel.rating}
                  </span>
                  <span className="text-muted-foreground">
                    ({hotel.reviewsCount} reviews)
                  </span>
                </div>
              </div>

              <Button onClick={handleBookNow} className="w-full" size="lg">
                Book Now
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6 shadow-xl border-2">
            <CardHeader>
              <CardTitle className="text-xl">Room Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {hotel.rooms.map(room => (
                <Card key={room.id} className="border-2">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">
                          {room.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Up to {room.capacity} guests
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          ${room.pricePerNight}
                          <span className="text-sm font-normal text-muted-foreground">/night</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {room.description}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {room.amenities.map(amenity => (
                        <Badge key={amenity} variant="outline">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
