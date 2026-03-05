/**
 * Screenings API Service
 * 
 * Encapsulates all screening and booking-related API calls.
 */

import apiClient from '@/lib/api-client';
import { mapBackendScreeningToShowtime } from '@/lib/mappers';
import {
  BackendScreeningResponse,
  CreateScreening,
  UpdateScreening,
  SeatForScreeningDto,
  BookSeatsRequest,
} from '@/types/api';

/**
 * Get all screenings
 */
export async function getScreenings() {
  const response = await apiClient.get<BackendScreeningResponse[]>('/api/screenings');
  return response.data.map(mapBackendScreeningToShowtime);
}

/**
 * Get screening by ID
 */
export async function getScreeningById(id: string) {
  const response = await apiClient.get<BackendScreeningResponse>(`/api/screenings/${id}`);
  return mapBackendScreeningToShowtime(response.data);
}

/**
 * Get reserved seats for a screening
 */
export async function getReservedSeats(screeningId: string): Promise<SeatForScreeningDto[]> {
  const response = await apiClient.get<SeatForScreeningDto[]>(
    `/api/screenings/${screeningId}/reservedseats`
  );
  return response.data;
}

/**
 * Book seats for a screening
 */
export async function bookSeats(
  screeningId: string,
  username: string,
  seatIds: number[]
): Promise<{ Message: string }> {
  const bookingData: BookSeatsRequest = {
    username,
    SelectedSeatsId: seatIds,
  };

  const response = await apiClient.post<{ Message: string }>(
    `/api/screenings/${screeningId}/book`,
    bookingData
  );

  return response.data;
}

/**
 * Create a new screening
 */
export async function createScreening(screening: CreateScreening): Promise<number> {
  const response = await apiClient.post<number>('/api/screenings', screening);
  return response.data;
}

/**
 * Update an existing screening
 */
export async function updateScreening(id: string, screening: UpdateScreening): Promise<boolean> {
  const response = await apiClient.put<boolean>(`/api/screenings/${id}`, screening);
  return response.data;
}

/**
 * Delete a screening
 */
export async function deleteScreening(id: string): Promise<boolean> {
  const response = await apiClient.delete<boolean>(`/api/screenings/${id}`);
  return response.data;
}

/**
 * Get screenings for a specific movie
 */
export async function getScreeningsForMovie(movieId: string) {
  const allScreenings = await getScreenings();
  return allScreenings.filter((screening) => screening.movieId === parseInt(movieId));
}
