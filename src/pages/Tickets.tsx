import { motion } from "framer-motion";
import { Ticket, Calendar, Clock, MapPin, Star, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTicketsByUser } from "@/hooks/useTickets";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useLocation } from "react-router-dom";

export default function Tickets() {
  const { user, isAuthenticated } = useAuth();
  const { data: tickets, isLoading, error } = useTicketsByUser(user?.Id?.toString() || "");
  const location = useLocation();

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <Ticket className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Login Required</h2>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          Please log in to view your tickets and booking history.
        </p>
        <Link
          to="/login"
          state={{ from: location }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 md:px-8 lg:px-12 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">
            My Tickets
          </h1>
          <p className="text-muted-foreground">
            View your booking history and upcoming movie tickets
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass-card p-6 rounded-xl">
                <div className="flex gap-4">
                  <Skeleton className="w-20 h-28 rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load tickets</h3>
            <p className="text-muted-foreground max-w-md">
              {error.message || "An error occurred while fetching your tickets. Please try again later."}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!tickets || tickets.length === 0) && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Ticket className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No tickets yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              You haven't booked any movies yet. Browse our collection and book your first ticket!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Browse Movies
            </Link>
          </div>
        )}

        {/* Tickets List */}
        {!isLoading && !error && tickets && tickets.length > 0 && (
          <div className="space-y-4">
            {tickets.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 rounded-xl hover-lift"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Movie Poster */}
                  <div className="shrink-0">
                    <img
                      src={ticket.posterPath || "/placeholder.svg"}
                      alt={ticket.movieName}
                      className="w-20 h-28 rounded-lg object-cover border border-border/30"
                    />
                  </div>

                  {/* Ticket Details */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">
                        {ticket.movieName}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="w-4 h-4 fill-primary text-primary" />
                        <span>Premium Experience</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(ticket.watchDate).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(ticket.watchDate).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{ticket.hallName}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Seat: </span>
                          <span className="font-semibold text-foreground">
                            Row {ticket.row}, Seat {ticket.column}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Price: </span>
                          <span className="font-bold text-primary">${ticket.price}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-2">
                        {new Date(ticket.watchDate) > new Date() ? (
                          <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold">
                            Upcoming
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-bold">
                            Watched
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}