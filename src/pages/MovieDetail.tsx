import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Clock, Calendar, ArrowLeft, Play, Ticket } from "lucide-react";
import { movies } from "@/data/movies";

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
  const movie = movies.find((m) => m.id === id);

  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Movie not found.</p>
      </div>
    );
  }

  const backdrop = backdropMap[movie.backdrop] || heroCinema;

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
              src={posterMap[movie.poster]}
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
            <p className="text-muted-foreground italic">"{movie.tagline}"</p>

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

            <p className="text-sm text-muted-foreground">
              Directed by <span className="text-foreground font-semibold">{movie.director}</span>
            </p>
          </motion.div>
        </div>

        {/* Cast */}
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
                <p className="text-[10px] text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Showtimes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 pb-8"
        >
          <h2 className="text-xl font-bold text-foreground mb-4">Showtimes</h2>
          <div className="space-y-6">
            {movie.showtimes.map((day) => (
              <div key={day.date}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  {new Date(day.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {day.times.map((show, i) => (
                    <button
                      key={i}
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
        </motion.div>
      </div>

      {/* Mobile Fixed CTA */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-30 p-4 bg-gradient-to-t from-background via-background to-transparent">
        <button className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-sm flex items-center justify-center gap-2 neon-border hover:scale-[1.02] transition-transform">
          <Ticket className="w-5 h-5" />
          Pick a Showtime
        </button>
      </div>
    </div>
  );
}
