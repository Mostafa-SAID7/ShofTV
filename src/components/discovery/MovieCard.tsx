import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { Movie } from "@/data/movies";

import poster1 from "@/assets/poster-1.jpg";
import poster2 from "@/assets/poster-2.jpg";
import poster3 from "@/assets/poster-3.jpg";
import poster4 from "@/assets/poster-4.jpg";
import poster5 from "@/assets/poster-5.jpg";
import poster6 from "@/assets/poster-6.jpg";

const posterMap: Record<string, string> = {
  "poster-1": poster1,
  "poster-2": poster2,
  "poster-3": poster3,
  "poster-4": poster4,
  "poster-5": poster5,
  "poster-6": poster6,
};

export default function MovieCard({ movie, index }: { movie: Movie; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link to={`/movie/${movie.id}`} className="group block">
        <div className="relative overflow-hidden rounded-xl hover-lift">
          <div className="aspect-[2/3] overflow-hidden rounded-xl">
            <img
              src={posterMap[movie.poster]}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          {/* Rating Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm text-xs font-bold">
            <Star className="w-3 h-3 fill-primary text-primary" />
            {movie.rating}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-end p-4">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              View Details →
            </span>
          </div>
        </div>

        <div className="mt-3 space-y-1">
          <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{movie.duration}</span>
            <span>•</span>
            <span>{movie.genres[0]}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
