export interface Room {
  id: string;
  type: string;
  name: string;
  description: string;
  pricePerNight: number;
  capacity: number;
  amenities: string[];
  imageUrl: string;
}

export interface HotelService {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  available: boolean;
}

export interface Reservation {
  id: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  serviceIds: string[];
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface ReservationFormData {
  // Step 1
  checkIn: Date | null;
  checkOut: Date | null;
  roomId: string;
  // Step 2
  serviceIds: string[];
  // Step 3 — guest info
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  // Step 4 — payment
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export type ReservationStep = 'dates' | 'services' | 'summary' | 'payment' | 'confirmation';

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
}
