/**
 * React Query Hooks for Screenings
 * 
 * Custom hooks using useQuery and useMutation for screening operations.
 * Handles caching, loading states, and cache invalidation.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as screeningsService from '@/services/screenings.service';
import { CreateScreening, UpdateScreening } from '@/types/api';

/**
 * Get all screenings
 */
export function useScreenings() {
  return useQuery({
    queryKey: ['screenings'],
    queryFn: screeningsService.getScreenings,
  });
}

/**
 * Get screening by ID
 */
export function useScreening(id: string) {
  return useQuery({
    queryKey: ['screening', id],
    queryFn: () => screeningsService.getScreeningById(id),
    enabled: !!id,
  });
}

/**
 * Get screenings for a specific movie
 */
export function useScreeningsForMovie(movieId: string) {
  return useQuery({
    queryKey: ['screenings', 'movie', movieId],
    queryFn: () => screeningsService.getScreeningsForMovie(movieId),
    enabled: !!movieId,
  });
}

/**
 * Get reserved seats for a screening
 */
export function useReservedSeats(screeningId: string) {
  return useQuery({
    queryKey: ['reservedSeats', screeningId],
    queryFn: () => screeningsService.getReservedSeats(screeningId),
    enabled: !!screeningId,
  });
}

/**
 * Book seats for a screening
 */
export function useBookSeats() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ screeningId, username, seatIds }: { 
      screeningId: string; 
      username: string; 
      seatIds: number[] 
    }) => screeningsService.bookSeats(screeningId, username, seatIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reservedSeats', variables.screeningId] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success('Seats booked successfully!');
    },
    onError: (error: any) => {
      toast.error('Failed to book seats', {
        description: error.message || 'An error occurred while booking seats.',
      });
    },
  });
}

/**
 * Create a new screening
 */
export function useCreateScreening() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (screening: CreateScreening) => screeningsService.createScreening(screening),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['screenings'] });
      toast.success('Screening created successfully!');
    },
    onError: (error: any) => {
      toast.error('Failed to create screening', {
        description: error.message || 'An error occurred while creating the screening.',
      });
    },
  });
}

/**
 * Update an existing screening
 */
export function useUpdateScreening() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, screening }: { id: string; screening: UpdateScreening }) =>
      screeningsService.updateScreening(id, screening),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['screenings'] });
      queryClient.invalidateQueries({ queryKey: ['screening', variables.id] });
      toast.success('Screening updated successfully!');
    },
    onError: (error: any) => {
      toast.error('Failed to update screening', {
        description: error.message || 'An error occurred while updating the screening.',
      });
    },
  });
}

/**
 * Delete a screening
 */
export function useDeleteScreening() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => screeningsService.deleteScreening(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['screenings'] });
      toast.success('Screening deleted successfully!');
    },
    onError: (error: any) => {
      toast.error('Failed to delete screening', {
        description: error.message || 'An error occurred while deleting the screening.',
      });
    },
  });
}
