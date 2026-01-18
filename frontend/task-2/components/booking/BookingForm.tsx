'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { createBooking } from '@/lib/api';
import type { Hotel, Room, BookingFormData } from '@/types/hotel';
import { PriceBreakdown } from './PriceBreakdown';
import { Calendar, Users, User, Mail, Phone, MessageSquare, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BookingFormProps {
  hotel: Hotel;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
}

export function BookingForm({ hotel, initialCheckIn, initialCheckOut, initialGuests = 1 }: BookingFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [roomId, setRoomId] = useState(hotel.rooms[0]?.id || '');
  const [checkIn, setCheckIn] = useState(initialCheckIn || '');
  const [checkOut, setCheckOut] = useState(initialCheckOut || '');
  const [guests, setGuests] = useState(initialGuests);
  const [guestDetails, setGuestDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialRequests: '',
  });

  const today = new Date().toISOString().split('T')[0];
  const minCheckOut = checkIn || today;

  const selectedRoom = hotel.rooms.find(r => r.id === roomId);

  const calculatePrice = () => {
    if (!selectedRoom || !checkIn || !checkOut) return { basePrice: 0, nights: 0, taxes: 0, discount: 0, total: 0 };
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const basePrice = selectedRoom.pricePerNight * nights;
    const taxes = basePrice * 0.1;
    const discount = 0;
    const total = basePrice + taxes - discount;
    
    return { basePrice, nights, taxes, discount, total };
  };

  const priceBreakdown = calculatePrice();

  const bookingMutation = useMutation({
    mutationFn: (data: BookingFormData) => createBooking(hotel.id, data),
    onSuccess: (booking) => {
      router.push(`/booking/confirmation?id=${booking.id}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      const formData: BookingFormData = {
        roomId,
        checkIn,
        checkOut,
        guests,
        guestDetails,
      };
      bookingMutation.mutate(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors",
                step >= s
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={cn(
                  "w-12 h-1 rounded-full transition-colors",
                  step > s ? 'bg-primary' : 'bg-muted'
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Room & Dates Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Select Room & Dates</h2>
            <p className="text-muted-foreground">Choose your preferred room type and travel dates</p>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Room Type</Label>
            <div className="space-y-3">
              {hotel.rooms.map(room => (
                <label
                  key={room.id}
                  className={cn(
                    "flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md",
                    roomId === room.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <div className="flex-1">
                    <input
                      type="radio"
                      name="room"
                      value={room.id}
                      checked={roomId === room.id}
                      onChange={(e) => setRoomId(e.target.value)}
                      className="sr-only"
                    />
                    <div className="font-semibold text-lg mb-1">{room.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Up to {room.capacity} guests • ${room.pricePerNight}/night
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    ${room.pricePerNight}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                required
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
                min={minCheckOut}
                required
                className="h-12"
              />
            </div>
          </div>

          <div className="space-y-2">
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
              max={selectedRoom?.capacity || 4}
              required
              className="h-12"
            />
          </div>
        </div>
      )}

      {/* Step 2: Guest Details */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Guest Information</h2>
            <p className="text-muted-foreground">Provide your contact details for booking confirmation</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-1">
              <User className="w-4 h-4" />
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              value={guestDetails.fullName}
              onChange={(e) => setGuestDetails({ ...guestDetails, fullName: e.target.value })}
              required
              placeholder="Enter your full name"
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={guestDetails.email}
              onChange={(e) => setGuestDetails({ ...guestDetails, email: e.target.value })}
              required
              placeholder="Enter your email"
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              value={guestDetails.phone}
              onChange={(e) => setGuestDetails({ ...guestDetails, phone: e.target.value })}
              required
              placeholder="Enter your phone number"
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequests" className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              Special Requests (Optional)
            </Label>
            <Textarea
              id="specialRequests"
              value={guestDetails.specialRequests}
              onChange={(e) => setGuestDetails({ ...guestDetails, specialRequests: e.target.value })}
              rows={4}
              placeholder="Any special requests or notes..."
              className="resize-none"
            />
          </div>
        </div>
      )}

      {/* Step 3: Review & Confirm */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Review & Confirm</h2>
            <p className="text-muted-foreground">Review your booking details before confirming</p>
          </div>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground">Hotel:</p>
                  <p className="font-medium">{hotel.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Room:</p>
                  <p className="font-medium">{selectedRoom?.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Check-in:</p>
                  <p className="font-medium">{new Date(checkIn).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Check-out:</p>
                  <p className="font-medium">{new Date(checkOut).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Guests:</p>
                  <p className="font-medium">{guests}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Guest Name:</p>
                  <p className="font-medium">{guestDetails.fullName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email:</p>
                  <p className="font-medium">{guestDetails.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone:</p>
                  <p className="font-medium">{guestDetails.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <PriceBreakdown {...priceBreakdown} />
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t">
        {step > 1 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep(step - 1)}
          >
            Back
          </Button>
        )}
        <Button
          type="submit"
          disabled={bookingMutation.isPending}
          size="lg"
          className={step === 1 ? 'ml-auto' : ''}
        >
          {bookingMutation.isPending
            ? 'Processing...'
            : step === 3
            ? 'Confirm Booking'
            : (
              <>
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
        </Button>
      </div>
    </form>
  );
}
