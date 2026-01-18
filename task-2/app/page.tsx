'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search, Calendar, Users, MapPin, Shield, Zap, Heart, Star, Globe2, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function Home() {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set('destination', destination);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests > 1) params.set('guests', guests.toString());
    
    router.push(`/hotels?${params.toString()}`);
  };

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const popularDestinations = [
    { name: 'Paris', country: 'France' },
    { name: 'Tokyo', country: 'Japan' },
    { name: 'New York', country: 'USA' },
    { name: 'London', country: 'UK' },
    { name: 'Dubai', country: 'UAE' },
    { name: 'Singapore', country: 'Singapore' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/30 via-background to-background py-20 lg:py-32 border-b border-border/50">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Trusted by 10,000+ travelers worldwide</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Find Your Perfect Stay
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Discover amazing hotels around the world at unbeatable prices. Your next adventure starts here.
            </p>

            {/* Search Form */}
            <Card className="shadow-xl border-2">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSearch} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="destination" className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        Destination
                      </Label>
                      <Input
                        id="destination"
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="City, Country, or Hotel"
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="checkin" className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Check-in
                      </Label>
                      <Input
                        id="checkin"
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        min={today}
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="checkout" className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Check-out
                      </Label>
                      <Input
                        id="checkout"
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn || tomorrow}
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-end gap-4">
                    <div className="flex-1 w-full sm:w-auto space-y-2 sm:max-w-xs">
                      <Label htmlFor="guests" className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Guests
                      </Label>
                      <Input
                        id="guests"
                        type="number"
                        value={guests}
                        onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
                        min={1}
                        className="h-12"
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
                      <Search className="w-5 h-5 mr-2" />
                      Search Hotels
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Destinations</h2>
            <p className="text-muted-foreground text-lg">Explore these trending destinations</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            {popularDestinations.map((dest) => (
              <Button
                key={dest.name}
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
                onClick={() => {
                  setDestination(dest.name);
                  router.push(`/hotels?destination=${dest.name}`);
                }}
              >
                <Globe2 className="w-5 h-5" />
                <div className="text-center">
                  <div className="font-semibold">{dest.name}</div>
                  <div className="text-xs text-muted-foreground">{dest.country}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:border-primary/50 bg-card">
              <CardHeader>
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Search className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-2xl">Smart Search</CardTitle>
                <CardDescription className="text-base">
                  Find hotels by location, dates, price range, and amenities with our powerful search engine
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:border-primary/50 bg-card">
              <CardHeader>
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-2xl">Easy Booking</CardTitle>
                <CardDescription className="text-base">
                  Book your stay in just a few simple steps with our streamlined booking process
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all duration-300 hover:border-primary/50 bg-card">
              <CardHeader>
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-2xl">Secure & Safe</CardTitle>
                <CardDescription className="text-base">
                  Your data and payments are protected with enterprise-grade security measures
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">120+</div>
              <div className="text-muted-foreground">Hotels Worldwide</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Happy Guests</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">10+</div>
              <div className="text-muted-foreground">Countries</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2 flex items-center justify-center gap-1">
                <Star className="w-8 h-8 fill-primary" />
                4.9
              </div>
              <div className="text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-2 border-primary/30 shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary fill-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Book Your Stay?</h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Start your journey today and discover amazing hotels at unbeatable prices
              </p>
              <Button size="lg" asChild>
                <Link href="/hotels">
                  <Search className="w-5 h-5 mr-2" />
                  Explore Hotels
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
