import { useState } from "react";
import HeroCarousel from "@/components/discovery/HeroCarousel";
import GenreChips from "@/components/discovery/GenreChips";
import MovieCard from "@/components/discovery/MovieCard";
import { useMovies, useMoviesByGenre } from "@/hooks/useMovies";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export default function DiscoveryHub() {
  const [genre, setGenre] = useState("All");

  // Fetch movies based on selected genre
  const { data: allMovies, isLoading: isLoadingAll, error: errorAll } = useMovies();
  const { data: genreMovies, isLoading: isLoadingGenre, error: errorGenre } = useMoviesByGenre(genre);

  // Determine which data to use
  const movies = genre === "All" ? allMovies : genreMovies;
  const isLoading = genre === "All" ? isLoadingAll : isLoadingGenre;
  const error = genre === "All" ? errorAll : errorGenre;

  return (
    <div className="min-h-screen">
      <HeroCarousel />

      <div className="px-4 md:px-8 lg:px-12 py-8 space-y-8">
        {/* Genre Filter */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Browse by Genre</h2>
          <GenreChips selected={genre} onSelect={setGenre} />
        </div>

        {/* Movie Grid */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">
            {genre === "All" ? "Now Showing" : genre}
            {movies && (
              <span className="text-muted-foreground text-sm font-normal ml-2">
                ({movies.length} movies)
              </span>
            )}
          </h2>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to load movies</h3>
              <p className="text-muted-foreground max-w-md">
                {error.message || "An error occurred while fetching movies. Please try again later."}
              </p>
            </div>
          )}

          {/* Movies Grid */}
          {!isLoading && !error && movies && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {movies.map((movie, i) => (
                  <MovieCard key={movie.id} movie={movie} index={i} />
                ))}
              </div>
              {movies.length === 0 && (
                <p className="text-center text-muted-foreground py-12">
                  No movies found in this genre.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
