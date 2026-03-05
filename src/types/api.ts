/**
 * Backend API Type Definitions
 * 
 * These interfaces match the C# models from the MoviesAPI backend.
 * Backend uses snake_case properties (e.g., Release_Date, Poster_Path)
 * Frontend uses camelCase properties (e.g., releaseYear, poster)
 * 
 * Mappers will transform between these schemas.
 */

// ============================================================================
// Movie Types
// ============================================================================

export interface BackendMovie {
  Id: number;
  Name: string;
  Duration: number;
  Release_Date: string; // DateTime from backend
  Amount: number; // decimal
  Poster_Path: string;
  Plot: string;
  Actors: string; // comma-separated string
  Directors: string; // comma-separated string
  Genres: string; // comma-separated string
  Rating: number; // decimal
  Ratings?: BackendMovieRating[];
}

export interface BackendMovieRating {
  Id: number;
  Movie_Id: number;
  User_Id: number;
  Rating: number;
}

export interface CreateAndUpdateMovie {
  Name: string;
  Duration: number;
  Release_Date: string; // DateTime
  Amount: number;
  Poster_Path: string;
  Plot: string;
  Actors: string;
  Directors: string;
  Genres: string[]; // Note: Backend accepts array for create/update
}

export interface CreateRating {
  MovieId: number;
  UserId: number;
  Rating: number;
}

export interface BackendFutureMovie {
  Id: number;
  Name: string;
  Genres: string;
  Poster_Path: string;
}

export interface CreateFutureMovie {
  Name: string;
  Genres: string;
  Poster_Path: string;
}

// ============================================================================
// Screening Types
// ============================================================================

export interface BackendScreening {
  Id: number;
  Movie_Id: number;
  Screening_Date_Time: string; // DateTime
  Total_Tickets: number;
  Available_Tickets: number;
  Hall_Id: number;
}

export interface BackendScreeningResponse {
  Id: number;
  Movie_Id: number;
  Movie: BackendMovieSummary;
  Screening_Date_Time: string; // DateTime
  Total_Tickets: number;
  Available_Tickets: number;
  Hall_Id: number;
}

export interface BackendMovieSummary {
  Id: number;
  Name: string;
  Poster_Path: string;
  Amount: number;
}

export interface CreateScreening {
  Movie_Id: number;
  Screening_Date_Time: string; // DateTime
  Hall_Id: number;
}

export interface UpdateScreening {
  Movie_Id: number;
  Screening_Date_Time: string; // DateTime
  Total_Tickets: number;
  Available_Tickets: number;
}

export interface SeatForScreeningDto {
  Id: number;
  ScreeningId: number;
  HallSeatId: number;
  RowNumber: number;
  SeatNumber: number;
  UserId: number | null;
}

export interface BookSeatsRequest {
  username: string;
  SelectedSeatsId: number[];
}

// ============================================================================
// Ticket Types
// ============================================================================

export interface BackendTicket {
  Id: number;
  Movie_Id: number;
  User_Id: number;
  Watch_Movie: string; // DateTime
  Price: number;
  hall_seat_id: number;
}

export interface BackendTicketResponse {
  Id: number;
  MovieName: string;
  UserName: string;
  PosterPath: string;
  Watch_Movie: string; // DateTime
  Price: number;
  HallName: string;
  Row: number;
  Column: number;
}

export interface CreateTicket {
  Movie_Id: number;
  User_Id: number;
  Watch_Movie: string; // DateTime
  Price: number;
  hall_seat_id: number;
}

// ============================================================================
// User & Authentication Types
// ============================================================================

export interface BackendUser {
  Id: number;
  Username: string;
  Password: string;
  Name: string;
  Email: string;
  EmailConfirmed: boolean;
  Phone: string;
  IsActive: boolean;
  Role: string;
}

export interface CreateUser {
  Name: string;
  Phone: string;
  Username: string;
  Email: string;
  Password: string;
}

export interface UserProfile {
  Name: string;
  Phone: string;
  Email: string;
  Username: string;
}

export interface LoginRequest {
  Username: string;
  Password: string;
}

export interface LoginResponse {
  accessToken: string; // Maps to Token in backend
  user: BackendUser;
  error: string | null;
}

export interface RegisterRequest {
  Name: string;
  Phone: string;
  Username: string;
  Email: string;
  Password: string;
  isActive?: boolean;
  EmailConfirmed?: boolean;
}

export interface ForgotPasswordRequest {
  Email: string;
}

export interface ResetPasswordRequest {
  Token: string;
  NewPassword: string;
}

// ============================================================================
// Hall Types
// ============================================================================

export interface BackendHall {
  Id: number;
  Name: string;
  Capacity: number;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiError {
  message: string;
  statusCode: number;
  details?: any;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}
