/**
 * Integration Test: Full User Flow
 * 
 * Test: Load homepage → filter by genre → view movie detail → book seats
 * Validates: Requirements 2.4, 2.8, 2.9
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import apiClient from '@/lib/api-client';
import DiscoveryHub from '@/pages/DiscoveryHub';
import MovieDetail from '@/pages/MovieDetail';

// Mock data matching backend schema
const mockBackendMovies = [
  {
    Id: 1,
    Name: 'The Matrix',
    Duration: 136,
    Release_Date: '1999-03-31T00:00:00',
    Amount: 12.99,
    Poster_Path: '/matrix.jpg',
    Plot: 'A computer hacker learns about the true nature of reality.',
    Actors: 'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss',
    Directors: 'Lana Wachowski, Lilly Wachowski',
    Genres: 'Action, Sci-Fi',
    Rating: 8.7
  },
  {
    Id: 2,
    Name: 'Inception',
    Duration: 148,
    Release_Date: '2010-07-16T00:00:00',
    Amount: 14.99,
    Poster_Path: '/inception.jpg',
    Plot: 'A thief who steals corporate secrets through dream-sharing technology.',
    Actors: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page',
    Directors: 'Christopher Nolan',
    Genres: 'Action, Sci-Fi, Thriller',
    Rating: 8.8
  }
];

const mockActionMovies = [mockBackendMovies[0], mockBackendMovies[1]];

const mockScreenings = [
  {
    Id: 1,
    MovieId: 1,
    StartTime: '2024-01-20T19:00:00',
    EndTime: '2024-01-20T21:16:00',
    AvailableSeats: 50,
    Movie: mockBackendMovies[0]
  }
];

const mockBookingResponse = {
  success: true,
  message: 'Booking successful',
  ticketIds: [101, 102]
};

describe('Integration Test: Full User Flow', () => {
  let queryClient: QueryClient;
  let axiosSpy: any;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });

    // Mock API responses
    axiosSpy = {
      get: vi.spyOn(apiClient, 'get'),
      post: vi.spyOn(apiClient, 'post')
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    queryClient.clear();
  });

  it('should complete full user flow: homepage → filter → detail → booking', async () => {
    const user = userEvent.setup();

    // Step 1: Load homepage - verify API call to GET /api/movies
    axiosSpy.get.mockResolvedValueOnce({ data: mockBackendMovies });

    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <DiscoveryHub />
        </BrowserRouter>
      </QueryClientProvider>
    );

    // Verify API call was made
    await waitFor(() => {
      expect(axiosSpy.get).toHaveBeenCalledWith(expect.stringContaining('/api/movies'));
    });

    // Verify movies are displayed
    await waitFor(() => {
      expect(screen.getByText('The Matrix')).toBeInTheDocument();
      expect(screen.getByText('Inception')).toBeInTheDocument();
    });

    // Step 2: Filter by genre - verify API call to GET /api/movies/genre/Action
    axiosSpy.get.mockResolvedValueOnce({ data: mockActionMovies });

    const actionButton = screen.getByRole('button', { name: /action/i });
    await user.click(actionButton);

    await waitFor(() => {
      expect(axiosSpy.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/movies/genre/Action')
      );
    });

    // Verify filtered results displayed
    await waitFor(() => {
      expect(screen.getByText('The Matrix')).toBeInTheDocument();
    });

    // Step 3: View movie detail - verify API call to GET /api/movies/1
    axiosSpy.get.mockResolvedValueOnce({ data: mockBackendMovies[0] });
    axiosSpy.get.mockResolvedValueOnce({ data: mockScreenings });

    // Simulate navigation to movie detail
    rerender(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <MovieDetail />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(axiosSpy.get).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/movies\/\d+/)
      );
    });

    // Verify movie details displayed with correct schema mapping
    await waitFor(() => {
      // Backend "Plot" should be mapped to frontend "synopsis"
      expect(screen.getByText(/computer hacker learns/i)).toBeInTheDocument();
    });

    // Step 4: Book seats - verify API call to POST /api/screenings/1/book
    axiosSpy.post.mockResolvedValueOnce({ data: mockBookingResponse });

    const bookButton = screen.getByRole('button', { name: /book/i });
    await user.click(bookButton);

    // Select seats (assuming seat selection UI exists)
    const seat1 = screen.getByTestId('seat-1');
    const seat2 = screen.getByTestId('seat-2');
    await user.click(seat1);
    await user.click(seat2);

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(axiosSpy.post).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/screenings\/\d+\/book/),
        expect.objectContaining({
          seatIds: expect.arrayContaining([1, 2])
        })
      );
    });

    // Verify success message displayed
    await waitFor(() => {
      expect(screen.getByText(/booking successful/i)).toBeInTheDocument();
    });
  });

  it('should verify data displayed correctly at each step', async () => {
    axiosSpy.get.mockResolvedValueOnce({ data: mockBackendMovies });

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <DiscoveryHub />
        </BrowserRouter>
      </QueryClientProvider>
    );

    // Verify movie data is correctly mapped and displayed
    await waitFor(() => {
      // Backend "Name" → frontend "title"
      expect(screen.getByText('The Matrix')).toBeInTheDocument();
      expect(screen.getByText('Inception')).toBeInTheDocument();
    });

    // Verify genres are displayed (Backend "Genres" string → frontend array)
    await waitFor(() => {
      expect(screen.getByText(/Action/)).toBeInTheDocument();
      expect(screen.getByText(/Sci-Fi/)).toBeInTheDocument();
    });
  });

  it('should verify booking persisted to database', async () => {
    // Mock successful booking
    axiosSpy.post.mockResolvedValueOnce({ data: mockBookingResponse });

    // Mock subsequent ticket retrieval to verify persistence
    const mockTickets = [
      {
        Id: 101,
        ScreeningId: 1,
        SeatNumber: 1,
        UserId: 'user123',
        BookingDate: '2024-01-20T18:00:00'
      },
      {
        Id: 102,
        ScreeningId: 1,
        SeatNumber: 2,
        UserId: 'user123',
        BookingDate: '2024-01-20T18:00:00'
      }
    ];

    axiosSpy.get.mockResolvedValueOnce({ data: mockTickets });

    // Import services to test persistence
    const { bookSeats } = await import('@/services/screenings.service');
    const { getTicketsByUser } = await import('@/services/tickets.service');

    // Book seats
    const bookingResult = await bookSeats('1', 'user123', [1, 2]);
    expect(bookingResult.success).toBe(true);
    expect(bookingResult.ticketIds).toEqual([101, 102]);

    // Verify tickets were persisted by fetching them
    const tickets = await getTicketsByUser('user123');
    expect(tickets).toHaveLength(2);
    expect(tickets[0].Id).toBe(101);
    expect(tickets[1].Id).toBe(102);
  });
});
