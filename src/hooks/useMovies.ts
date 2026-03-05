/**
 * React Query Hooks for Movies
 * 
 * Custom hooks using useQuery and useMutation for movie operations.
 * Handles caching, loading states, and cache invalidation.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as moviesService from '@/services/movies.service';
import { Movie } from '@/data/movies';

/**
 * Get all movies
 */
export function useMovies() {
  return useQuery({
    queryKey: ['movies'],
    queryFn: moviesService.getMovies,
  });
}

/**
 * Get movie by ID
 */
export function useMovie(id: string) {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: () => moviesService.getMovieById(id),
    enabled: !!id,
  });
}

/**
 * Get movies by genre
 */
export function useMoviesByGenre(genre: string) {
  return useQuery({
    queryKey: ['movies', 'genre', genre],
    queryFn: () => moviesService.getMoviesByGenre(genre),
    enabled: !!genre && genre !== 'All',
  });
}

/**
 * Get all genres
 */
export function useGenres() {
  return useQuery({
    queryKey: ['genres'],
    queryFn: moviesService.getAllGenres,
  });
}

/**
 * Get top rated movies
 */
export function useTopRatedMovies(n: number = 10) {
  return useQuery({
    queryKey: ['movies', 'toprated', n],
    queryFn: () => moviesService.getTopRatedMovies(n),
  });
}

/**
 * Create a new movie
 */
export function useCreateMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (movie: Partial<Movie>) => moviesService.createMovie(movie),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      toast.success('Movie created successfully!');
    },
    onError: (error: any) => {
      toast.error('Failed to create movie', {
        description: error.message || 'An error occurred while creating the movie.',
      });
    },
  });
}

/**
 * Update an existing movie
 */
export function useUpdateMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, movie }: { id: string; movie: Partial<Movie> }) =>
      moviesService.updateMovie(id, movie),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      queryClient.invalidateQueries({ queryKey: ['movie', variables.id] });
      toast.success('Movie updated successfully!');
    },
    onError: (error: any) => {
      toast.error('Failed to update movie', {
        description: error.message || 'An error occurred while updating the movie.',
      });
    },
  });
}

/**
 * Delete a movie
 */
export function useDeleteMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => moviesService.deleteMovie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      toast.success('Movie deleted successfully!');
    },
    onError: (error: any) => {
      toast.error('Failed to delete movie', {
        description: error.message || 'An error occurred while deleting the movie.',
      });
    },
  });
}

/**
 * Rate a movie
 */
export function useRateMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ movieId, userId, rating }: { movieId: string; userId: string; rating: number }) =>
      moviesService.rateMovie(movieId, userId, rating),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['movie', variables.movieId] });
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      toast.success('Rating submitted successfully!');
    },
    onError: (error: any) => {
      toast.error('Failed to submit rating', {
        description: error.message || 'An error occurred while submitting your rating.',
      });
    },
  });
}

/**
 * Get user's rating for a movie
 */
export function useUserRating(movieId: string, userId: string) {
  return useQuery({
    queryKey: ['rating', movieId, userId],
    queryFn: () => moviesService.getUserRatingForMovie(movieId, userId),
    enabled: !!movieId && !!userId,
  });
}
