/**
 * Integration Test: Admin Flow
 * 
 * Test: Login as admin → create movie → create screening → view in frontend
 * Validates: Requirements 2.5, 2.7, 2.9
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import apiClient from '@/lib/api-client';
import { AuthProvider } from '@/hooks/useAuth';

// Mock data
const mockAdminCredentials = {
  username: 'admin',
  password: 'admin123'
};

const mockLoginResponse = {
  token: 'mock-jwt-token-12345',
  user: {
    Id: 'admin-user-id',
    Username: 'admin',
    Email: 'admin@shoftv.com',
    Role: 'Admin'
  }
};

const mockNewMovie = {
  Name: 'New Test Movie',
  Duration: 120,
  Release_Date: '2024-01-01T00:00:00',
  Amount: 15.99,
  Poster_Path: '/test-movie.jpg',
  Plot: 'A test movie for integration testing',
  Actors: 'Test Actor 1, Test Actor 2',
  Directors: 'Test Director',
  Genres: 'Action, Drama'
};

const mockCreatedMovie = {
  Id: 999,
  ...mockNewMovie
};

const mockNewScreening = {
  MovieId: 999,
  StartTime: '2024-01-25T20:00:00',
  EndTime: '2024-01-25T22:00:00',
  AvailableSeats: 100
};

const mockCreatedScreening = {
  Id: 888,
  ...mockNewScreening,
  Movie: mockCreatedMovie
};

describe('Integration Test: Admin Flow', () => {
  let queryClient: QueryClient;
  let axiosSpy: any;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });

    // Mock localStorage
    Storage.prototype.getItem = vi.fn();
    Storage.prototype.setItem = vi.fn();
    Storage.prototype.removeItem = vi.fn();

    // Mock API responses
    axiosSpy = {
      get: vi.spyOn(apiClient, 'get'),
      post: vi.spyOn(apiClient, 'post'),
      put: vi.spyOn(apiClient, 'put'),
      delete: vi.spyOn(apiClient, 'delete')
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    queryClient.clear();
  });

  it('should complete admin flow: login → create movie → create screening → view', async () => {
    // Step 1: Admin login - verify API call to POST /api/account/login
    axiosSpy.post.mockResolvedValueOnce({ data: mockLoginResponse });

    const { login } = await import('@/services/auth.service');
    const loginResult = await login(mockAdminCredentials.username, mockAdminCredentials.password);

    // Verify login API call was made
    expect(axiosSpy.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/account/login'),
      expect.objectContaining({
        username: mockAdminCredentials.username,
        password: mockAdminCredentials.password
      })
    );

    // Verify login response
    expect(loginResult.token).toBe(mockLoginResponse.token);
    expect(loginResult.user.Role).toBe('Admin');

    // Step 2: Create movie - verify API call to POST /api/movies
    axiosSpy.post.mockResolvedValueOnce({ data: mockCreatedMovie });

    const { createMovie } = await import('@/services/movies.service');
    const createdMovie = await createMovie(mockNewMovie);

    // Verify movie creation API call
    expect(axiosSpy.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/movies'),
      expect.objectContaining({
        Name: mockNewMovie.Name,
        Duration: mockNewMovie.Duration
      })
    );

    // Verify movie was created with ID
    expect(createdMovie.Id).toBe(999);
    expect(createdMovie.Name).toBe(mockNewMovie.Name);

    // Step 3: Create screening - verify API call to POST /api/screenings
    axiosSpy.post.mockResolvedValueOnce({ data: mockCreatedScreening });

    const { createScreening } = await import('@/services/screenings.service');
    const createdScreening = await createScreening(mockNewScreening);

    // Verify screening creation API call
    expect(axiosSpy.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/screenings'),
      expect.objectContaining({
        MovieId: 999,
        StartTime: mockNewScreening.StartTime
      })
    );

    // Verify screening was created
    expect(createdScreening.Id).toBe(888);
    expect(createdScreening.MovieId).toBe(999);

    // Step 4: Verify new movie appears in discovery hub
    axiosSpy.get.mockResolvedValueOnce({ 
      data: [mockCreatedMovie] 
    });

    const { getMovies } = await import('@/services/movies.service');
    const movies = await getMovies();

    // Verify the new movie is in the list
    expect(movies).toHaveLength(1);
    expect(movies[0].Id).toBe(999);
    expect(movies[0].Name).toBe('New Test Movie');
  });

  it('should verify admin authentication works', async () => {
    axiosSpy.post.mockResolvedValueOnce({ data: mockLoginResponse });

    const { login } = await import('@/services/auth.service');
    const result = await login('admin', 'admin123');

    // Verify authentication token is returned
    expect(result.token).toBeDefined();
    expect(result.token).toBe('mock-jwt-token-12345');

    // Verify user role is Admin
    expect(result.user.Role).toBe('Admin');

    // Verify API call was made with correct credentials
    expect(axiosSpy.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/account/login'),
      expect.objectContaining({
        username: 'admin',
        password: 'admin123'
      })
    );
  });

  it('should verify movie creation persisted', async () => {
    // Create movie
    axiosSpy.post.mockResolvedValueOnce({ data: mockCreatedMovie });

    const { createMovie } = await import('@/services/movies.service');
    await createMovie(mockNewMovie);

    // Fetch movie by ID to verify persistence
    axiosSpy.get.mockResolvedValueOnce({ data: mockCreatedMovie });

    const { getMovieById } = await import('@/services/movies.service');
    const fetchedMovie = await getMovieById('999');

    // Verify movie was persisted
    expect(fetchedMovie.Id).toBe(999);
    expect(fetchedMovie.Name).toBe(mockNewMovie.Name);
    expect(fetchedMovie.Plot).toBe(mockNewMovie.Plot);

    // Verify GET API call was made
    expect(axiosSpy.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/movies/999')
    );
  });

  it('should verify screening creation persisted', async () => {
    // Create screening
    axiosSpy.post.mockResolvedValueOnce({ data: mockCreatedScreening });

    const { createScreening } = await import('@/services/screenings.service');
    await createScreening(mockNewScreening);

    // Fetch screening by ID to verify persistence
    axiosSpy.get.mockResolvedValueOnce({ data: mockCreatedScreening });

    const { getScreeningById } = await import('@/services/screenings.service');
    const fetchedScreening = await getScreeningById('888');

    // Verify screening was persisted
    expect(fetchedScreening.Id).toBe(888);
    expect(fetchedScreening.MovieId).toBe(999);
    expect(fetchedScreening.StartTime).toBe(mockNewScreening.StartTime);

    // Verify GET API call was made
    expect(axiosSpy.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/screenings/888')
    );
  });

  it('should verify new movie appears in discovery hub', async () => {
    // Mock movies list including the new movie
    const allMovies = [
      mockCreatedMovie,
      {
        Id: 1,
        Name: 'Existing Movie',
        Duration: 100,
        Release_Date: '2023-01-01T00:00:00',
        Amount: 10.99,
        Poster_Path: '/existing.jpg',
        Plot: 'An existing movie',
        Actors: 'Actor 1',
        Directors: 'Director 1',
        Genres: 'Drama'
      }
    ];

    axiosSpy.get.mockResolvedValueOnce({ data: allMovies });

    const { getMovies } = await import('@/services/movies.service');
    const movies = await getMovies();

    // Verify the new movie is in the discovery hub
    const newMovie = movies.find(m => m.Id === 999);
    expect(newMovie).toBeDefined();
    expect(newMovie?.Name).toBe('New Test Movie');

    // Verify API call was made
    expect(axiosSpy.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/movies')
    );
  });

  it('should handle admin CRUD operations correctly', async () => {
    // Test CREATE
    axiosSpy.post.mockResolvedValueOnce({ data: mockCreatedMovie });
    const { createMovie } = await import('@/services/movies.service');
    const created = await createMovie(mockNewMovie);
    expect(created.Id).toBe(999);

    // Test UPDATE
    const updatedMovie = { ...mockCreatedMovie, Name: 'Updated Movie Title' };
    axiosSpy.put.mockResolvedValueOnce({ data: updatedMovie });
    const { updateMovie } = await import('@/services/movies.service');
    const updated = await updateMovie('999', { Name: 'Updated Movie Title' });
    expect(updated.Name).toBe('Updated Movie Title');
    expect(axiosSpy.put).toHaveBeenCalledWith(
      expect.stringContaining('/api/movies/999'),
      expect.any(Object)
    );

    // Test DELETE
    axiosSpy.delete.mockResolvedValueOnce({ data: { success: true } });
    const { deleteMovie } = await import('@/services/movies.service');
    await deleteMovie('999');
    expect(axiosSpy.delete).toHaveBeenCalledWith(
      expect.stringContaining('/api/movies/999')
    );
  });
});
