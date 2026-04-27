import axios from 'axios';
import type { Room, HotelService, Reservation, PaymentResult } from '../types';

const api = axios.create({ baseURL: '/api' });

export const roomsApi = {
  getAll: () => api.get<Room[]>('/rooms').then((r) => r.data),
  checkAvailability: (roomId: string, checkIn: string, checkOut: string) =>
    api
      .get<{ available: boolean }>(`/rooms/${roomId}/availability`, { params: { checkIn, checkOut } })
      .then((r) => r.data.available),
};

export const servicesApi = {
  getAll: () => api.get<HotelService[]>('/services').then((r) => r.data),
  checkAvailability: (ids: string[]) =>
    api
      .get<{ id: string; available: boolean }[]>('/services/availability', { params: { ids: ids.join(',') } })
      .then((r) => r.data),
};

export const reservationsApi = {
  create: (data: {
    roomId: string;
    checkIn: string;
    checkOut: string;
    serviceIds: string[];
    guestName: string;
    guestEmail: string;
    guestPhone: string;
  }) => api.post<Reservation>('/reservations', data).then((r) => r.data),

  calculatePrice: (roomId: string, checkIn: string, checkOut: string, serviceIds: string[]) =>
    api
      .get<{ total: number }>('/reservations/calculate-price', {
        params: { roomId, checkIn, checkOut, serviceIds: serviceIds.join(',') },
      })
      .then((r) => r.data.total),

  getById: (id: string) => api.get<Reservation>(`/reservations/${id}`).then((r) => r.data),
};

export const paymentsApi = {
  process: (data: {
    reservationId: string;
    cardNumber: string;
    cardHolder: string;
    expiryDate: string;
    cvv: string;
  }) => api.post<PaymentResult>('/payments/process', data).then((r) => r.data),
};
