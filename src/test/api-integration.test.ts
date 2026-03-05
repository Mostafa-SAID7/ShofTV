/**
 * Bug Condition Exploration Test
 * Property 1: Fault Condition - Frontend Uses Mock Data Instead of API
 * 
 * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists
 * DO NOT attempt to fix the test or the code when it fails
 * 
 * This test encodes the expected behavior - it will validate the fix when it passes after implementation
 * 
 * GOAL: Surface counterexamples that demonstrate the frontend has no API integration
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import apiClient from '@/lib/api-client';

describe('API Integration - Bug Condition Exploration', () => {
  let axiosSpy: any;

  beforeEach(() => {
    // Spy on apiClient methods to detect API calls
    axiosSpy = {
      get: vi.spyOn(apiClient, 'get').mockResolvedValue({ data: [] }),
      post: vi.spyOn(apiClient, 'post').mockResolvedValue({ data: {} }),
      put: vi.spyOn(apiClient, 'put').mockResolvedValue({ data: {} }),
      delete: vi.spyOn(apiClient, 'delete').mockResolvedValue({ data: {} }),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call GET /api/movies when loading DiscoveryHub page', async () => {
    // This test will FAIL on unfixed code - no API call is made
    // Expected: API call to https://localhost:7200/api/movies
    // Actual: Uses hardcoded data from movies.ts
    
    // Import and call the service directly to verify it makes API calls
    const { getMovies } = await import('@/services/movies.service');
    
    try {
      await getMovies();
    } catch (error) {
      // Ignore errors - we're just checking if the call was made
    }
    
    expect(axiosSpy.get).toHaveBeenCalledWith(expect.stringContaining('/api/movies'));
  });

  it('should call GET /api/movies/genre/Action when filtering by genre', async () => {
    // This test will FAIL on unfixed code - client-side filtering only
    // Expected: API call to https://localhost:7200/api/movies/genre/Action
    // Actual: Filters hardcoded array locally
    
    const { getMoviesByGenre } = await import('@/services/movies.service');
    
    try {
      await getMoviesByGenre('Action');
    } catch (error) {
      // Ignore errors - we're just checking if the call was made
    }
    
    expect(axiosSpy.get).toHaveBeenCalledWith(expect.stringContaining('/api/movies/genre/Action'));
  });

  it('should call GET /api/movies/{id} when viewing movie detail', async () => {
    // This test will FAIL on unfixed code - mock data used
    // Expected: API call to https://localhost:7200/api/movies/1
    // Actual: Displays hardcoded mock data
    
    const { getMovieById } = await import('@/services/movies.service');
    
    try {
      await getMovieById('1');
    } catch (error) {
      // Ignore errors - we're just checking if the call was made
    }
    
    expect(axiosSpy.get).toHaveBeenCalledWith(expect.stringMatching(/\/api\/movies\/\d+/));
  });

  it('should call POST /api/account/login when submitting login form', async () => {
    // This test will FAIL on unfixed code - no auth flow
    // Expected: API call to https://localhost:7200/api/account/login
    // Actual: No authentication mechanism exists
    
    const { login } = await import('@/services/auth.service');
    
    try {
      await login('testuser', 'password');
    } catch (error) {
      // Ignore errors - we're just checking if the call was made
    }
    
    expect(axiosSpy.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/account/login'),
      expect.any(Object)
    );
  });

  it('should call POST /api/screenings/{id}/book when booking seats', async () => {
    // This test will FAIL on unfixed code - no booking API
    // Expected: API call to https://localhost:7200/api/screenings/1/book
    // Actual: No booking functionality
    
    const { bookSeats } = await import('@/services/screenings.service');
    
    try {
      await bookSeats('1', 'testuser', [1, 2, 3]);
    } catch (error) {
      // Ignore errors - we're just checking if the call was made
    }
    
    expect(axiosSpy.post).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/screenings\/\d+\/book/),
      expect.any(Object)
    );
  });

  it('should call POST /api/movies when creating movie in admin', async () => {
    // This test will FAIL on unfixed code - no API integration
    // Expected: API call to https://localhost:7200/api/movies
    // Actual: No API integration, no persistence
    
    const { createMovie } = await import('@/services/movies.service');
    
    try {
      await createMovie({ title: 'Test Movie' });
    } catch (error) {
      // Ignore errors - we're just checking if the call was made
    }
    
    expect(axiosSpy.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/movies'),
      expect.any(Object)
    );
  });

  it('should configure API base URL to https://localhost:7200', async () => {
    // This test will FAIL on unfixed code - no API client configured
    // Expected: API client configured with base URL
    // Actual: No API client exists
    
    const apiClient = await import('@/lib/api-client');
    
    // Check if the API client has the correct base URL
    expect(apiClient.default.defaults.baseURL).toMatch(/localhost:(7200|5272)/);
  });
});

/**
 * EXPECTED OUTCOME AFTER FIX: All tests PASS (confirms bug is fixed)
 * 
 * This validates:
 * - API calls are made to https://localhost:7200
 * - Services use the API client
 * - API client is configured with correct base URL
 * - Authentication flow exists
 * - Booking functionality exists
 * - Admin CRUD operations exist
 */
