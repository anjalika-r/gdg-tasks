'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { SearchBar } from '@/components/hotels/SearchBar';
import { Filters } from '@/components/hotels/Filters';
import { SortControls } from '@/components/hotels/SortControls';
import { HotelGrid } from '@/components/hotels/HotelGrid';
import { HotelList } from '@/components/hotels/HotelList';
import { searchHotels, getHotels } from '@/lib/api';
import type { SearchFilters, SortOption } from '@/types/hotel';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

function HotelsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const destination = searchParams.get('destination') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = parseInt(searchParams.get('guests') || '1', 10);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  // Get all hotels to determine price range
  const { data: allHotels } = useQuery({
    queryKey: ['all-hotels'],
    queryFn: getHotels,
  });

  useEffect(() => {
    if (allHotels && allHotels.length > 0) {
      const prices = allHotels.map(h => h.pricePerNight);
      setPriceRange({
        min: Math.min(...prices),
        max: Math.max(...prices),
      });
    }
  }, [allHotels]);

  const searchFilters: SearchFilters = {
    destination: destination || undefined,
    checkIn: checkIn || undefined,
    checkOut: checkOut || undefined,
    guests: guests || undefined,
    ...filters,
  };

  const { data: hotels = [], isLoading } = useQuery({
    queryKey: ['hotels', searchFilters, sortBy],
    queryFn: () => searchHotels(searchFilters, sortBy),
    enabled: true,
  });

  const handleSearch = useCallback((newFilters: {
    destination?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newFilters.destination) params.set('destination', newFilters.destination);
    else params.delete('destination');
    if (newFilters.checkIn) params.set('checkIn', newFilters.checkIn);
    else params.delete('checkIn');
    if (newFilters.checkOut) params.set('checkOut', newFilters.checkOut);
    else params.delete('checkOut');
    if (newFilters.guests) params.set('guests', newFilters.guests.toString());
    else params.delete('guests');
    router.push(`/hotels?${params.toString()}`);
  }, [router, searchParams]);

  const handleFilterChange = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="border-0 shadow-lg">
          <CardContent className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground text-lg">Loading hotels...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Find Your Perfect Stay
          </h1>
          <p className="text-lg text-muted-foreground">
            {hotels.length} {hotels.length === 1 ? 'hotel' : 'hotels'} available for your search
          </p>
        </div>

        <SearchBar
          destination={destination}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
          onSearch={handleSearch}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Filters priceRange={priceRange} onFilterChange={handleFilterChange} />
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <SortControls
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            {viewMode === 'grid' ? (
              <HotelGrid hotels={hotels} />
            ) : (
              <HotelList hotels={hotels} />
            )}

            {hotels.length === 0 && (
              <Card className="border-2 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No hotels found</h3>
                  <p className="text-muted-foreground max-w-md">
                    Try adjusting your filters or search criteria to find more options.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HotelsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-12">
        <Card className="border-0 shadow-lg">
          <CardContent className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    }>
      <HotelsContent />
    </Suspense>
  );
}
