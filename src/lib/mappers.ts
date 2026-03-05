/**
 * Data Mapping Functions
 * 
 * Transform data between backend schema (snake_case) and frontend schema (camelCase).
 * 
 * Backend schema: Name, Release_Date, Poster_Path, Plot, Actors (string), Directors (string), Genres (string)
 * Frontend schema: title, releaseYear, poster, synopsis, cast (array), director, genres (array)
 */

import { BackendMovie, BackendScreeningResponse, BackendTicketResponse } from '@/types/api';
import { Movie } from '@/data/movies';

/**
 * Map backend movie to frontend movie
 * 
 * Transforms:
 * - Name → title
 * - Release_Date → releaseYear (extract year)
 * - Poster_Path → poster
 * - Plot → synopsis
 * - Actors (comma-separated string) → cast (array of objects)
 * - Directors (comma-separated string) → director (first director)
 * - Genres (comma-separated string) → genres (array)
 * - Amount → price (used in showtimes)
 * - Duration (minutes) → duration (formatted string like "2h 22m")
 */
export function mapBackendMovieToFrontend(backendMovie: BackendMovie): Movie {
  // Extract year from Release_Date
  const releaseDate = new Date(backendMovie.Release_Date);
  const releaseYear = releaseDate.getFullYear();

  // Parse Actors string to cast array
  const cast = backendMovie.Actors
    ? backendMovie.Actors.split(',').map((actor) => {
        const trimmed = actor.trim();
        return {
          name: trimmed,
          role: '', // Backend doesn't provide role, use empty string
        };
      })
    : [];

  // Parse Directors string to get first director
  const director = backendMovie.Directors
    ? backendMovie.Directors.split(',')[0].trim()
    : '';

  // Parse Genres string to array
  const genres = backendMovie.Genres
    ? backendMovie.Genres.split(',').map((g) => g.trim())
    : [];

  // Format duration from minutes to "Xh Ym" format
  const hours = Math.floor(backendMovie.Duration / 60);
  const minutes = backendMovie.Duration % 60;
  const duration = `${hours}h ${minutes}m`;

  return {
    id: backendMovie.Id.toString(),
    title: backendMovie.Name,
    tagline: '', // Backend doesn't have tagline, use empty string
    synopsis: backendMovie.Plot || '',
    genres,
    rating: backendMovie.Rating,
    duration,
    releaseYear,
    director,
    cast,
    poster: backendMovie.Poster_Path || '',
    backdrop: '', // Backend doesn't have backdrop, use empty string or default
    showtimes: [], // Showtimes come from screenings, not movies
  };
}

/**
 * Map frontend movie to backend create/update format
 * 
 * Transforms:
 * - title → Name
 * - releaseYear → Release_Date
 * - poster → Poster_Path
 * - synopsis → Plot
 * - cast array → Actors (comma-separated string)
 * - director → Directors
 * - genres array → Genres (array for create/update)
 * - duration (formatted string) → Duration (minutes)
 */
export function mapFrontendMovieToBackend(movie: Partial<Movie>): any {
  // Parse duration string "Xh Ym" to minutes
  let durationMinutes = 0;
  if (movie.duration) {
    const match = movie.duration.match(/(\d+)h\s*(\d+)m/);
    if (match) {
      durationMinutes = parseInt(match[1]) * 60 + parseInt(match[2]);
    }
  }

  // Convert cast array to comma-separated string
  const actors = movie.cast
    ? movie.cast.map((c) => c.name).join(', ')
    : '';

  // Convert genres array to array (backend accepts array for create/update)
  const genres = movie.genres || [];

  // Create Release_Date from releaseYear
  const releaseDate = movie.releaseYear
    ? new Date(movie.releaseYear, 0, 1).toISOString()
    : new Date().toISOString();

  return {
    Name: movie.title || '',
    Duration: durationMinutes,
    Release_Date: releaseDate,
    Amount: 0, // Default price, should be provided
    Poster_Path: movie.poster || '',
    Plot: movie.synopsis || '',
    Actors: actors,
    Directors: movie.director || '',
    Genres: genres,
  };
}

/**
 * Map backend screening to frontend showtime format
 */
export function mapBackendScreeningToShowtime(screening: BackendScreeningResponse) {
  const screeningDate = new Date(screening.Screening_Date_Time);
  const date = screeningDate.toISOString().split('T')[0]; // YYYY-MM-DD
  const time = screeningDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return {
    id: screening.Id,
    movieId: screening.Movie_Id,
    date,
    time,
    hall: `Hall ${screening.Hall_Id}`,
    price: screening.Movie?.Amount || 0,
    totalTickets: screening.Total_Tickets,
    availableTickets: screening.Available_Tickets,
  };
}

/**
 * Map backend ticket response to frontend ticket format
 */
export function mapBackendTicketToFrontend(ticket: BackendTicketResponse) {
  return {
    id: ticket.Id,
    movieName: ticket.MovieName,
    userName: ticket.UserName,
    posterPath: ticket.PosterPath,
    watchDate: new Date(ticket.Watch_Movie),
    price: ticket.Price,
    hallName: ticket.HallName,
    row: ticket.Row,
    column: ticket.Column,
  };
}

/**
 * Parse comma-separated string to array
 */
export function parseCommaSeparatedString(str: string | null | undefined): string[] {
  if (!str) return [];
  return str.split(',').map((item) => item.trim()).filter((item) => item.length > 0);
}

/**
 * Join array to comma-separated string
 */
export function joinToCommaSeparatedString(arr: string[] | null | undefined): string {
  if (!arr || arr.length === 0) return '';
  return arr.join(', ');
}
