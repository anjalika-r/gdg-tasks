import type { Booking } from '@/types/hotel';
import { getStoredUser } from './auth';

const BOOKINGS_KEY = 'hotel_bookings';

export function getUserBookings(): Booking[] {
  if (typeof window === 'undefined') return [];
  const user = getStoredUser();
  if (!user) return [];
  
  const bookingsStr = localStorage.getItem(BOOKINGS_KEY);
  if (!bookingsStr) return [];
  
  try {
    const allBookings: Booking[] = JSON.parse(bookingsStr);
    return allBookings.filter(b => b.userId === user.id);
  } catch {
    return [];
  }
}

export function saveBooking(booking: Booking): void {
  if (typeof window === 'undefined') return;
  
  const bookingsStr = localStorage.getItem(BOOKINGS_KEY);
  const allBookings: Booking[] = bookingsStr ? JSON.parse(bookingsStr) : [];
  allBookings.push(booking);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(allBookings));
}

export function cancelBooking(bookingId: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const bookingsStr = localStorage.getItem(BOOKINGS_KEY);
  if (!bookingsStr) return false;
  
  try {
    const allBookings: Booking[] = JSON.parse(bookingsStr);
    const bookingIndex = allBookings.findIndex(b => b.id === bookingId);
    
    if (bookingIndex === -1) return false;
    
    allBookings[bookingIndex] = {
      ...allBookings[bookingIndex],
      status: 'cancelled',
    };
    
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(allBookings));
    return true;
  } catch {
    return false;
  }
}

export function getBookingById(bookingId: string): Booking | null {
  if (typeof window === 'undefined') return null;
  
  const bookingsStr = localStorage.getItem(BOOKINGS_KEY);
  if (!bookingsStr) return null;
  
  try {
    const allBookings: Booking[] = JSON.parse(bookingsStr);
    return allBookings.find(b => b.id === bookingId) || null;
  } catch {
    return null;
  }
}
