import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Star } from "lucide-react";
import { movies } from "@/data/movies";
import { Link } from "react-router-dom";
import heroCinema from "@/assets/hero-cinema.jpg";
import backdrop1 from "@/assets/backdrop-1.jpg";

const featured = movies.slice(0, 3);
const backdrops = [heroCinema, backdrop1, heroCinema];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % featured.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const movie = featured[current];

  return (
    <div className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={backdrops[current]}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider border border-primary/30">
                Trending
              </span>
              <div className="flex items-center gap-1 text-primary">
                <Star className="w-4 h-4 fill-primary" />
                <span className="text-sm font-bold">{movie.rating}</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-2 text-foreground leading-tight">
              {movie.title}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base mb-1 italic">
              "{movie.tagline}"
            </p>
            <p className="text-muted-foreground text-sm mb-6 max-w-xl line-clamp-2">
              {movie.synopsis}
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <Link
                to={`/movie/${movie.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold text-sm hover:scale-105 transition-transform neon-border"
              >
                <Play className="w-4 h-4 fill-current" />
                Book Now
              </Link>
              <Link
                to={`/movie/${movie.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-bold text-sm hover:bg-muted transition-colors"
              >
                More Info
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-6 right-6 md:right-12 flex items-center gap-2 z-10">
        <button
          onClick={() => setCurrent((c) => (c - 1 + featured.length) % featured.length)}
          className="w-10 h-10 rounded-full bg-card/50 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card/80 transition-colors border border-border/30"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-1.5 mx-2">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-primary" : "w-3 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => setCurrent((c) => (c + 1) % featured.length)}
          className="w-10 h-10 rounded-full bg-card/50 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card/80 transition-colors border border-border/30"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
