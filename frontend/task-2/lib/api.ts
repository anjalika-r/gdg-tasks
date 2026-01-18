import type { Hotel, SearchFilters, SortOption, AuthResponse, Booking, BookingFormData } from '@/types/hotel';
import { getStoredUser } from './auth';
import { saveBooking, getUserBookings, cancelBooking } from './storage';
import hotelsData from '@/data/hotels.json';

const DUMMYJSON_API_BASE = 'https://dummyjson.com';

// Authentication
export async function loginUser(username: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${DUMMYJSON_API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
}

export async function registerUser(
  username: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<AuthResponse> {
  const response = await fetch(`${DUMMYJSON_API_BASE}/users/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      email,
      password,
      firstName,
      lastName,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Registration failed' }));
    throw new Error(error.message || 'Registration failed');
  }

  // DummyJSON users/add doesn't return token, so we need to login after registration
  const user = await response.json();
  // Note: In a real app, you'd get token from registration or login after
  // For now, we'll simulate token generation
  return {
    ...user,
    token: `dummy-token-${user.id}-${Date.now()}`,
  };
}

// Hotels
export async function getHotels(): Promise<Hotel[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return hotelsData as Hotel[];
}

export async function getHotelById(id: string): Promise<Hotel | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  const hotels = hotelsData as Hotel[];
  return hotels.find(h => h.id === id) || null;
}

export async function searchHotels(filters: SearchFilters, sortBy: SortOption = 'popularity'): Promise<Hotel[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  let hotels = [...(hotelsData as Hotel[])];

  // Filter by destination
  if (filters.destination) {
    const destination = filters.destination.toLowerCase();
    hotels = hotels.filter(
      h =>
        h.location.city.toLowerCase().includes(destination) ||
        h.location.country.toLowerCase().includes(destination) ||
        h.name.toLowerCase().includes(destination)
    );
  }

  // Filter by price range
  if (filters.priceMin !== undefined) {
    hotels = hotels.filter(h => h.pricePerNight >= filters.priceMin!);
  }
  if (filters.priceMax !== undefined) {
    hotels = hotels.filter(h => h.pricePerNight <= filters.priceMax!);
  }

  // Filter by star rating
  if (filters.starRating && filters.starRating.length > 0) {
    hotels = hotels.filter(h => filters.starRating!.includes(h.starRating));
  }

  // Filter by amenities
  if (filters.amenities && filters.amenities.length > 0) {
    hotels = hotels.filter(h => filters.amenities!.every(a => h.amenities.includes(a)));
  }

  // Filter by property type
  if (filters.propertyType && filters.propertyType.length > 0) {
    hotels = hotels.filter(h => filters.propertyType!.includes(h.propertyType));
  }

  // Sort
  switch (sortBy) {
    case 'price-low':
      hotels.sort((a, b) => a.pricePerNight - b.pricePerNight);
      break;
    case 'price-high':
      hotels.sort((a, b) => b.pricePerNight - a.pricePerNight);
      break;
    case 'rating':
      hotels.sort((a, b) => b.rating - a.rating);
      break;
    case 'popularity':
      hotels.sort((a, b) => b.reviewsCount - a.reviewsCount);
      break;
  }

  return hotels;
}

// Bookings
export async function createBooking(
  hotelId: string,
  formData: BookingFormData
): Promise<Booking> {
  const user = getStoredUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const hotel = await getHotelById(hotelId);
  if (!hotel) {
    throw new Error('Hotel not found');
  }

  const room = hotel.rooms.find(r => r.id === formData.roomId);
  if (!room) {
    throw new Error('Room not found');
  }

  const checkIn = new Date(formData.checkIn);
  const checkOut = new Date(formData.checkOut);
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

  const basePrice = room.pricePerNight * nights;
  const taxes = basePrice * 0.1; // 10% tax
  const discount = 0; // No discount for now
  const total = basePrice + taxes - discount;

  const booking: Booking = {
    id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: user.id,
    hotelId: hotel.id,
    hotelName: hotel.name,
    hotelImage: hotel.images[0],
    roomId: formData.roomId,
    roomName: room.name,
    checkIn: formData.checkIn,
    checkOut: formData.checkOut,
    guests: formData.guests,
    guestDetails: formData.guestDetails,
    priceBreakdown: {
      basePrice,
      nights,
      taxes,
      discount,
      total,
    },
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  saveBooking(booking);
  return booking;
}

export async function getUserBookingsAPI(): Promise<Booking[]> {
  return getUserBookings();
}

export async function cancelBookingAPI(bookingId: string): Promise<boolean> {
  return cancelBooking(bookingId);
}
