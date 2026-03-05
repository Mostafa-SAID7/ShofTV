import { useGenres } from "@/hooks/useMovies";
import { Skeleton } from "@/components/ui/skeleton";

interface GenreChipsProps {
  selected: string;
  onSelect: (genre: string) => void;
}

export default function GenreChips({ selected, onSelect }: GenreChipsProps) {
  const { data: apiGenres, isLoading } = useGenres();

  // Add "All" to the beginning of genres list
  const genres = apiGenres ? ["All", ...apiGenres] : ["All"];

  if (isLoading) {
    return (
      <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 px-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-20 rounded-full shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 px-1">
      {genres.map((genre) => (
        <button
          key={genre}
          onClick={() => onSelect(genre)}
          className="relative shrink-0"
        >
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 block ${
              selected === genre
                ? "bg-primary text-primary-foreground neon-border"
                : "bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            {genre}
          </span>
        </button>
      ))}
    </div>
  );
}
