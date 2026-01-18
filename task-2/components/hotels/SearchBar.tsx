'use client';

import { useState, useEffect } from 'react';
import { MapPin, Calendar, Users, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SearchBarProps {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  onSearch: (filters: { destination?: string; checkIn?: string; checkOut?: string; guests?: number }) => void;
}

export function SearchBar({ destination: initialDestination = '', checkIn: initialCheckIn = '', checkOut: initialCheckOut = '', guests: initialGuests = 1, onSearch }: SearchBarProps) {
  const [destination, setDestination] = useState(initialDestination);
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests);

  useEffect(() => {
    setDestination(initialDestination);
    setCheckIn(initialCheckIn);
    setCheckOut(initialCheckOut);
    setGuests(initialGuests);
  }, [initialDestination, initialCheckIn, initialCheckOut, initialGuests]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ destination, checkIn, checkOut, guests });
  };

  const today = new Date().toISOString().split('T')[0];
  const minCheckOut = checkIn || today;

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Destination
              </label>
              <Input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="City, Country, or Hotel"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Check-in
              </label>
              <Input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={today}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Check-out
              </label>
              <Input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={minCheckOut}
              />
            </div>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div className="flex-1 space-y-2 max-w-xs">
              <label className="text-sm font-medium flex items-center gap-1">
                <Users className="w-4 h-4" />
                Guests
              </label>
              <Input
                type="number"
                value={guests}
                onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
                min={1}
              />
            </div>
            <Button type="submit" size="lg">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
