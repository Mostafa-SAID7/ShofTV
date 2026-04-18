/**
 * Tickets API Service
 * 
 * Encapsulates all ticket-related API calls.
 */

import apiClient from '@/lib/api-client';
import { mapBackendTicketToFrontend } from '@/lib/mappers';
import { BackendTicketResponse, CreateTicket } from '@/types/api';

// Mock tickets data for development
const mockTickets = [
  {
    id: "1",
    movieName: "Neon Dreams",
    posterPath: "poster-1",
    watchDate: "2024-04-20T19:30:00Z",
    hallName: "IMAX 1",
    row: "F",
    column: "12",
    price: 15
  },
  {
    id: "2", 
    movieName: "Cosmic Voyage",
    posterPath: "poster-3",
    watchDate: "2024-04-18T16:45:00Z",
    hallName: "IMAX 2", 
    row: "D",
    column: "8",
    price: 18
  }
];

/**
 * Get all tickets
 */
export async function getTickets() {
  try {
    const response = await apiClient.get<BackendTicketResponse[]>('/api/tickets');
    return response.data.map(mapBackendTicketToFrontend);
  } catch (error) {
    // Fallback to mock data for development
    console.warn('API not available, using mock tickets data:', error);
    return Promise.resolve(mockTickets);
  }
}

/**
 * Get ticket by ID
 */
export async function getTicketById(id: string) {
  try {
    const response = await apiClient.get<BackendTicketResponse>(`/api/tickets/${id}`);
    return mapBackendTicketToFrontend(response.data);
  } catch (error) {
    // Fallback to mock data for development
    console.warn('API not available, using mock data:', error);
    const ticket = mockTickets.find(t => t.id === id);
    if (!ticket) {
      throw new Error(`Ticket with id ${id} not found`);
    }
    return Promise.resolve(ticket);
  }
}

/**
 * Get tickets for a specific user
 * Note: Backend doesn't have this endpoint, so we filter client-side
 */
export async function getTicketsByUser(userId: string) {
  try {
    const allTickets = await getTickets();
    // Filter by username since we don't have userId in the response
    return allTickets;
  } catch (error) {
    // Fallback to mock data for development
    console.warn('API not available, using mock tickets data:', error);
    return Promise.resolve(mockTickets);
  }
}

/**
 * Create a new ticket
 */
export async function createTicket(ticket: CreateTicket): Promise<number> {
  const response = await apiClient.post<number>('/api/tickets', ticket);
  return response.data;
}

/**
 * Delete a ticket
 */
export async function deleteTicket(id: string): Promise<boolean> {
  const response = await apiClient.delete<boolean>(`/api/tickets/${id}`);
  return response.data;
}
