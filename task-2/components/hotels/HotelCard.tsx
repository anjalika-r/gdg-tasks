'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Hotel } from '@/types/hotel';
import { MapPin, Star, Wifi, Car, Waves, Snowflake } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface HotelCardProps {
  hotel: Hotel;
  variant?: 'grid' | 'list';
}

export function HotelCard({ hotel, variant = 'grid' }: HotelCardProps) {
  const amenityIcons: Record<string, React.ReactNode> = {
    WiFi: <Wifi className="w-4 h-4" />,
    Parking: <Car className="w-4 h-4" />,
    Pool: <Waves className="w-4 h-4" />,
    AC: <Snowflake className="w-4 h-4" />,
  };

  if (variant === 'list') {
    return (
      <Link href={`/hotels/${hotel.id}`}>
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-primary/20">
          <div className="flex flex-col md:flex-row">
            <div className="relative w-full md:w-80 h-64 md:h-auto overflow-hidden">
              <Image
                src={hotel.images[0] || 'https://picsum.photos/1200/800'}
                alt={hotel.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3">
                <Badge className="shadow-lg">{hotel.propertyType}</Badge>
              </div>
            </div>
            <div className="flex-1 p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <CardTitle className="text-2xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
                    {hotel.name}
                  </CardTitle>
                  <p className="text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary" />
                    {hotel.location.city}, {hotel.location.country}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(hotel.starRating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-foreground">{hotel.rating}</span>
                <span className="text-sm text-muted-foreground">({hotel.reviewsCount} reviews)</span>
              </div>

              <p className="text-muted-foreground line-clamp-2 leading-relaxed">{hotel.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-3">
                  {hotel.amenities.slice(0, 4).map(amenity => (
                    <div key={amenity} className="text-muted-foreground hover:text-primary transition-colors" title={amenity}>
                      {amenityIcons[amenity] || <div className="w-4 h-4 rounded-full bg-muted" />}
                    </div>
                  ))}
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-foreground">${hotel.pricePerNight}</div>
                  <div className="text-sm text-muted-foreground">per night</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/hotels/${hotel.id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group h-full border-2 hover:border-primary/20 flex flex-col">
        <div className="relative w-full h-56 overflow-hidden bg-muted">
          <Image
            src={hotel.images[0] || 'https://picsum.photos/1200/800'}
            alt={hotel.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3">
            <Badge className="shadow-lg">{hotel.propertyType}</Badge>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {hotel.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            {hotel.location.city}, {hotel.location.country}
          </p>
        </CardHeader>
        <CardContent className="pt-0 space-y-3 flex-1 flex flex-col">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 text-yellow-500">
              {[...Array(hotel.starRating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-sm font-semibold">{hotel.rating}</span>
            <span className="text-xs text-muted-foreground">({hotel.reviewsCount})</span>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            {hotel.amenities.slice(0, 4).map(amenity => (
              <div key={amenity} className="text-muted-foreground hover:text-primary transition-colors" title={amenity}>
                {amenityIcons[amenity] || <div className="w-4 h-4 rounded-full bg-muted" />}
              </div>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t flex items-center justify-between">
            <div className="text-2xl font-bold text-foreground">${hotel.pricePerNight}</div>
            <div className="text-xs text-muted-foreground">/night</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
