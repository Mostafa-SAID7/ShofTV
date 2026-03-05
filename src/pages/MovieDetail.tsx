import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Clock, Calendar, ArrowLeft, Ticket, AlertCircle } from "lucide-react";
import { useMovie } from "@/hooks/useMovies";
import { useScreeningsForMovie } from "@/hooks/useScreenings";
import { Skeleton } from "@/components/ui/skeleton";

import poster1 from "@/assets/poster-1.jpg";
import poster2 from "@/assets/poster-2.jpg";
import poster3 from "@/assets/poster-3.jpg";
import poster4 from "@/assets/poster-4.jpg";
import poster5 from "@/assets/poster-5.jpg";
import poster6 from "@/assets/poster-6.jpg";
import backdrop1 from "@/assets/backdrop-1.jpg";
import heroCinema from "@/assets/hero-cinema.jpg";

const posterMap: Record<string, string> = {
  "poster-1": poster1, "poster-2": poster2, "poster-3": poster3,
  "poster-4": poster4, "poster-5": poster5, "poster-6": poster6,
};
const backdropMap: Record<string, string> = {
  "backdrop-1": backdrop1,
};

export default function MovieDetail() {
  const { id } = useParams();
  const { data: movie, isLoading, error } = useMovie(id || "");
  const { data: screenings, isLoading: isLoadingScreenings } = useScreeningsForMovie(id || "");

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="relative h-[45vh] md:h-[55vh] overflow-hidden bg-muted">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="px-4 md:px-8 lg:px-12 -mt-32 relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            <Skeleton className="w-40 md:w-56 h-60 md:h-80 rounded-xl" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full max-w-2xl" />
              <Skeleton className="h-4 w-full max-w-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <AlertCircle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Movie Not Found</h2>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          {error?.message || "The movie you're looking for doesn't exist or has been removed."}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    );
  }

  const backdrop = backdropMap[movie.backdrop] || heroCinema;

  // Group screenings by date
  const showtimesByDate = screenings?.reduce((acc: any, screening: any) => {
    if (!acc[screening.date]) {
      acc[screening.date] = [];
    }
    acc[screening.date].push(screening);
    return acc;
  }, {}) || {};

  return (
    <div className="min-h-screen">
      {/* Hero Backdrop */}
      <div className="relative h-[45vh] md:h-[55vh] overflow-hidden">
        <img src={backdrop} alt={movie.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

        <div className="absolute top-4 left-4 z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50 backdrop-blur-sm text-foreground text-sm font-medium hover:bg-card/80 transition-colors border border-border/30"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-8 lg:px-12 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="shrink-0"
          >
            <img
              src={posterMap[movie.poster] || poster1}
              alt={movie.title}
              className="w-40 md:w-56 rounded-xl shadow-2xl border-2 border-border/30"
            />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 space-y-4"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-muted-foreground italic">"{movie.tagline}"</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-primary font-bold">
                <Star className="w-4 h-4 fill-primary" />
                {movie.rating}/10
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                {movie.duration}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {movie.releaseYear}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {movie.genres.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold"
                >
                  {g}
                </span>
              ))}
            </div>

            <p className="text-foreground/80 leading-relaxed max-w-2xl">{movie.synopsis}</p>

            {movie.director && (
              <p className="text-sm text-muted-foreground">
                Directed by <span className="text-foreground font-semibold">{movie.director}</span>
              </p>
            )}
          </motion.div>
        </div>

        {/* Cast */}
        {movie.cast && movie.cast.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">Cast</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {movie.cast.map((member) => (
                <div
                  key={member.name}
                  className="shrink-0 glass-card p-4 rounded-xl text-center w-32"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-muted mb-3 flex items-center justify-center text-muted-foreground text-lg font-bold">
                    {member.name[0]}
                  </div>
                  <p className="text-xs font-bold text-foreground line-clamp-1">{member.name}</p>
                  {member.role && (
                    <p className="text-[10px] text-muted-foreground">{member.role}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Showtimes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 pb-8"
        >
          <h2 className="text-xl font-bold text-foreground mb-4">Showtimes</h2>
          
          {isLoadingScreenings && (
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="flex gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-24 rounded-xl" />
                ))}
              </div>
            </div>
          )}

          {!isLoadingScreenings && Object.keys(showtimesByDate).length === 0 && (
            <p className="text-muted-foreground">No showtimes available for this movie.</p>
          )}

          {!isLoadingScreenings && Object.keys(showtimesByDate).length > 0 && (
            <div className="space-y-6">
              {Object.entries(showtimesByDate).map(([date, times]: [string, any]) => (
                <div key={date}>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {times.map((show: any) => (
                      <button
                        key={show.id}
                        className="glass-card px-5 py-3 rounded-xl hover-lift hover:neon-border transition-all group"
                      >
                        <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                          {show.time}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{show.hall}</p>
                        <p className="text-xs font-bold text-primary mt-1">${show.price}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Mobile Fixed CTA */}
      {!isLoadingScreenings && Object.keys(showtimesByDate).length > 0 && (
        <div className="lg:hidden fixed bottom-16 left-0 right-0 z-30 p-4 bg-gradient-to-t from-background via-background to-transparent">
          <button className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-sm flex items-center justify-center gap-2 neon-border hover:scale-[1.02] transition-transform">
            <Ticket className="w-5 h-5" />
            Pick a Showtime
          </button>
        </div>
      )}
    </div>
  );
}
