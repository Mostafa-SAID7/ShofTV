/**
 * React Query Hooks for Tickets
 * 
 * Custom hooks using useQuery for ticket operations.
 * Handles caching, loading states, and error handling.
 */

import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as ticketsService from '@/services/tickets.service';

/**
 * Get all tickets
 */
export function useTickets() {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: ticketsService.getTickets,
    onError: (error: any) => {
      toast.error('Failed to load tickets', {
        description: error.message || 'An error occurred while loading tickets.',
      });
    },
  });
}

/**
 * Get tickets for a specific user
 */
export function useTicketsByUser(userId: string) {
  return useQuery({
    queryKey: ['tickets', 'user', userId],
    queryFn: () => ticketsService.getTicketsByUser(userId),
    enabled: !!userId,
    onError: (error: any) => {
      toast.error('Failed to load user tickets', {
        description: error.message || 'An error occurred while loading user tickets.',
      });
    },
  });
}

/**
 * Alias for useTicketsByUser for backward compatibility
 */
export const useUserTickets = useTicketsByUser;
