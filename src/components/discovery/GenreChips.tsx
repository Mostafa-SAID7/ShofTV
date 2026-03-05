import { GENRES } from "@/data/movies";
import { motion } from "framer-motion";

interface GenreChipsProps {
  selected: string;
  onSelect: (genre: string) => void;
}

export default function GenreChips({ selected, onSelect }: GenreChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 px-1">
      {GENRES.map((genre) => (
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
