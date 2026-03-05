/**
 * Movies API Service
 * 
 * Encapsulates all movie-related API calls.
 * Uses API client and error handler for consistent behavior.
 */

import apiClient from '@/lib/api-client';
import { mapBackendMovieToFrontend, mapFrontendMovieToBackend } from '@/lib/mappers';
import { BackendMovie, CreateAndUpdateMovie, CreateRating } from '@/types/api';
import { Movie } from '@/data/movies';

/**
 * Get all movies
 */
export async function getMovies(): Promise<Movie[]> {
  const response = await apiClient.get<BackendMovie[]>('/api/movies');
  return response.data.map(mapBackendMovieToFrontend);
}

/**
 * Get movie by ID
 */
export async function getMovieById(id: string): Promise<Movie> {
  const response = await apiClient.get<BackendMovie>(`/api/movies/${id}`);
  return mapBackendMovieToFrontend(response.data);
}

/**
 * Get movies by genre
 */
export async function getMoviesByGenre(genre: string): Promise<Movie[]> {
  const response = await apiClient.get<BackendMovie[]>(`/api/movies/genre/${genre}`);
  return response.data.map(mapBackendMovieToFrontend);
}

/**
 * Create a new movie
 */
export async function createMovie(movie: Partial<Movie>): Promise<number> {
  const backendMovie = mapFrontendMovieToBackend(movie);
  const response = await apiClient.post<number>('/api/movies', backendMovie);
  return response.data;
}

/**
 * Update an existing movie
 */
export async function updateMovie(id: string, movie: Partial<Movie>): Promise<boolean> {
  const backendMovie = mapFrontendMovieToBackend(movie);
  const response = await apiClient.put<boolean>(`/api/movies/${id}`, backendMovie);
  return response.data;
}

/**
 * Delete a movie
 */
export async function deleteMovie(id: string): Promise<boolean> {
  const response = await apiClient.delete<boolean>(`/api/movies/${id}`);
  return response.data;
}

/**
 * Rate a movie
 */
export async function rateMovie(movieId: string, userId: string, rating: number): Promise<any> {
  const ratingData: CreateRating = {
    MovieId: parseInt(movieId),
    UserId: parseInt(userId),
    Rating: rating,
  };
  
  const response = await apiClient.put(`/api/movies/${movieId}/rating`, ratingData);
  return response.data;
}

/**
 * Get top N rated movies
 */
export async function getTopRatedMovies(n: number): Promise<Movie[]> {
  const response = await apiClient.get<BackendMovie[]>(`/api/movies/toprated/${n}`);
  return response.data.map(mapBackendMovieToFrontend);
}

/**
 * Get all genres
 */
export async function getAllGenres(): Promise<string[]> {
  const response = await apiClient.get<string[]>('/api/movies/genres');
  return response.data;
}

/**
 * Get user's rating for a movie
 */
export async function getUserRatingForMovie(movieId: string, userId: string): Promise<number | null> {
  try {
    const response = await apiClient.get<number>(`/api/movies/${movieId}/rating/${userId}`);
    return response.data;
  } catch (error) {
    // Return null if no rating found
    return null;
  }
}
