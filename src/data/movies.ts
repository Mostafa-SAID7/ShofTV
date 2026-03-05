// Mock data removed - now fetched from backend API
// This file now only contains the Movie interface for type definitions

export interface Movie {
  id: string;
  title: string;
  tagline: string;
  synopsis: string;
  genres: string[];
  rating: number;
  duration: string;
  releaseYear: number;
  director: string;
  cast: { name: string; role: string }[];
  poster: string;
  backdrop: string;
  showtimes: { date: string; times: { time: string; hall: string; price: number }[] }[];
}
