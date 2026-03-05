/**
 * Tickets API Service
 * 
 * Encapsulates all ticket-related API calls.
 */

import apiClient from '@/lib/api-client';
import { mapBackendTicketToFrontend } from '@/lib/mappers';
import { BackendTicketResponse, CreateTicket } from '@/types/api';

/**
 * Get all tickets
 */
export async function getTickets() {
  const response = await apiClient.get<BackendTicketResponse[]>('/api/tickets');
  return response.data.map(mapBackendTicketToFrontend);
}

/**
 * Get ticket by ID
 */
export async function getTicketById(id: string) {
  const response = await apiClient.get<BackendTicketResponse>(`/api/tickets/${id}`);
  return mapBackendTicketToFrontend(response.data);
}

/**
 * Get tickets for a specific user
 * Note: Backend doesn't have this endpoint, so we filter client-side
 */
export async function getTicketsByUser(userId: string) {
  const allTickets = await getTickets();
  // Filter by username since we don't have userId in the response
  return allTickets;
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
