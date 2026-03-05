import { useState, useMemo } from "react";
import HeroCarousel from "@/components/discovery/HeroCarousel";
import GenreChips from "@/components/discovery/GenreChips";
import MovieCard from "@/components/discovery/MovieCard";
import { movies } from "@/data/movies";

export default function DiscoveryHub() {
  const [genre, setGenre] = useState("All");

  const filtered = useMemo(
    () =>
      genre === "All"
        ? movies
        : movies.filter((m) => m.genres.includes(genre)),
    [genre]
  );

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
            <span className="text-muted-foreground text-sm font-normal ml-2">
              ({filtered.length} movies)
            </span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {filtered.map((movie, i) => (
              <MovieCard key={movie.id} movie={movie} index={i} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              No movies found in this genre.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
