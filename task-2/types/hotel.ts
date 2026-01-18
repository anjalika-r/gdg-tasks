export type PropertyType = 'Hotel' | 'Resort' | 'Apartment';
export type Amenity = 'WiFi' | 'Pool' | 'Parking' | 'AC' | 'Gym' | 'Spa' | 'Restaurant' | 'Bar' | 'Room Service' | 'Laundry';
export type SortOption = 'price-low' | 'price-high' | 'rating' | 'popularity';
export type BookingStatus = 'confirmed' | 'cancelled';

export interface Location {
  city: string;
  country: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Room {
  id: string;
  name: string;
  type: string;
  capacity: number;
  pricePerNight: number;
  amenities: Amenity[];
  description: string;
  images: string[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: Location;
  images: string[];
  pricePerNight: number;
  rating: number;
  reviewsCount: number;
  amenities: Amenity[];
  propertyType: PropertyType;
  starRating: number;
  description: string;
  rooms: Room[];
  reviews: Review[];
}

export interface SearchFilters {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  priceMin?: number;
  priceMax?: number;
  starRating?: number[];
  amenities?: Amenity[];
  propertyType?: PropertyType[];
}

export interface Booking {
  id: string;
  userId: string;
  hotelId: string;
  hotelName: string;
  hotelImage: string;
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestDetails: {
    fullName: string;
    email: string;
    phone: string;
    specialRequests?: string;
  };
  priceBreakdown: {
    basePrice: number;
    nights: number;
    taxes: number;
    discount: number;
    total: number;
  };
  status: BookingStatus;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  image?: string;
}

export interface AuthResponse {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image?: string;
  token: string;
}

export interface BookingFormData {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestDetails: {
    fullName: string;
    email: string;
    phone: string;
    specialRequests?: string;
  };
}
