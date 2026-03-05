import { useState } from "react";
import { motion } from "framer-motion";
import { Film, Calendar, Armchair, Users, TrendingUp, DollarSign, Plus, Edit, Trash2 } from "lucide-react";
import { useMovies, useCreateMovie, useUpdateMovie, useDeleteMovie } from "@/hooks/useMovies";
import { useScreenings, useCreateScreening, useUpdateScreening, useDeleteScreening } from "@/hooks/useScreenings";
import { Movie } from "@/data/movies";

const tabs = ["Movies", "Showtimes", "Halls", "Bookings"] as const;
type Tab = (typeof tabs)[number];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("Movies");
  const { data: movies = [] } = useMovies();
  const { data: screenings = [] } = useScreenings();

  const stats = [
    { label: "Total Movies", value: movies.length, icon: Film, change: "+2 this week" },
    { label: "Active Showtimes", value: screenings.length, icon: Calendar, change: "6 today" },
    { label: "Total Bookings", value: 1284, icon: TrendingUp, change: "+12% vs last week" },
    { label: "Revenue", value: "$18,420", icon: DollarSign, change: "+8% vs last week" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage your cinema operations</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-4 rounded-xl"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-4 h-4 text-primary" />
              </div>
            </div>
            <p className="text-xl font-black text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-[10px] text-primary mt-1">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === tab
                ? "bg-primary text-primary-foreground neon-border"
                : "bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {activeTab === "Movies" && <MoviesTab />}
        {activeTab === "Showtimes" && <ShowtimesTab />}
        {activeTab === "Halls" && <HallsTab />}
        {activeTab === "Bookings" && <BookingsTab />}
      </motion.div>
    </div>
  );
}

// Movie Form Component for Create/Edit
function MovieForm({ movie, onClose, onSuccess }: { 
  movie?: Movie | null; 
  onClose: () => void;
  onSuccess: () => void;
}) {
  const createMovie = useCreateMovie();
  const updateMovie = useUpdateMovie();
  const [formData, setFormData] = useState({
    title: movie?.title || "",
    tagline: movie?.tagline || "",
    synopsis: movie?.synopsis || "",
    genres: movie?.genres.join(", ") || "",
    duration: movie?.duration || "",
    releaseYear: movie?.releaseYear || new Date().getFullYear(),
    director: movie?.director || "",
    cast: movie?.cast.map(c => `${c.name} as ${c.role}`).join(", ") || "",
    poster: movie?.poster || "",
    backdrop: movie?.backdrop || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const movieData: Partial<Movie> = {
      title: formData.title,
      tagline: formData.tagline,
      synopsis: formData.synopsis,
      genres: formData.genres.split(",").map(g => g.trim()).filter(Boolean),
      duration: formData.duration,
      releaseYear: formData.releaseYear,
      director: formData.director,
      cast: formData.cast.split(",").map(c => {
        const [name, role] = c.split(" as ").map(s => s.trim());
        return { name: name || "", role: role || "" };
      }).filter(c => c.name),
      poster: formData.poster,
      backdrop: formData.backdrop,
    };

    if (movie) {
      updateMovie.mutate({ id: movie.id, movie: movieData }, {
        onSuccess: () => onSuccess(),
      });
    } else {
      createMovie.mutate(movieData, {
        onSuccess: () => onSuccess(),
      });
    }
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-bold text-foreground mb-4">
        {movie ? "Edit Movie" : "Add New Movie"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground border border-border focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Director *</label>
            <input
              type="text"
              required
              value={formData.director}
              onChange={(e) => setFormData({ ...formData, director: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground border border-border focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Duration *</label>
            <input
              type="text"
              required
              placeholder="e.g., 2h 30m"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground border border-border focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Release Year *</label>
            <input
              type="number"
              required
              value={formData.releaseYear}
              onChange={(e) => setFormData({ ...formData, releaseYear: parseInt(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground border border-border focus:border-primary focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Tagline</label>
          <input
            type="text"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground border border-border focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Synopsis *</label>
          <textarea
            required
            rows={3}
            value={formData.synopsis}
            onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground border border-border focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Genres (comma-separated) *</label>
          <input
            type="text"
            required
            placeholder="e.g., Action, Sci-Fi, Thriller"
            value={formData.genres}
            onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground border border-border focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Cast (comma-separated, format: "Name as Role")</label>
          <input
            type="text"
            placeholder="e.g., John Doe as Hero, Jane Smith as Villain"
            value={formData.cast}
            onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground border border-border focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Poster URL *</label>
          <input
            type="url"
            required
            value={formData.poster}
            onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground border border-border focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Backdrop URL</label>
          <input
            type="url"
            value={formData.backdrop}
            onChange={(e) => setFormData({ ...formData, backdrop: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground border border-border focus:border-primary focus:outline-none"
          />
        </div>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createMovie.isPending || updateMovie.isPending}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:scale-[1.02] transition-transform disabled:opacity-50"
          >
            {createMovie.isPending || updateMovie.isPending ? "Saving..." : movie ? "Update Movie" : "Create Movie"}
          </button>
        </div>
      </form>
    </div>
  );
}

function MoviesTab() {
  const { data: movies = [], isLoading, error } = useMovies();
  const deleteMovie = useDeleteMovie();
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this movie?")) {
      deleteMovie.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-foreground">All Movies</h2>
        </div>
        <div className="glass-card rounded-xl p-8 text-center">
          <p className="text-muted-foreground">Loading movies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-foreground">All Movies</h2>
        </div>
        <div className="glass-card rounded-xl p-8 text-center">
          <p className="text-destructive">Failed to load movies. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-foreground">All Movies</h2>
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:scale-[1.02] transition-transform"
        >
          <Plus className="w-4 h-4" /> Add Movie
        </button>
      </div>

      {isCreating && (
        <MovieForm 
          onClose={() => setIsCreating(false)} 
          onSuccess={() => setIsCreating(false)}
        />
      )}

      {editingMovie && (
        <MovieForm 
          movie={editingMovie}
          onClose={() => setEditingMovie(null)} 
          onSuccess={() => setEditingMovie(null)}
        />
      )}

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 text-muted-foreground font-semibold">Title</th>
                <th className="text-left p-4 text-muted-foreground font-semibold hidden md:table-cell">Genre</th>
                <th className="text-left p-4 text-muted-foreground font-semibold hidden lg:table-cell">Director</th>
                <th className="text-left p-4 text-muted-foreground font-semibold">Rating</th>
                <th className="text-right p-4 text-muted-foreground font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No movies found. Add your first movie!
                  </td>
                </tr>
              ) : (
                movies.map((movie) => (
                  <tr key={movie.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-semibold text-foreground">{movie.title}</td>
                    <td className="p-4 text-muted-foreground hidden md:table-cell">{movie.genres.join(", ")}</td>
                    <td className="p-4 text-muted-foreground hidden lg:table-cell">{movie.director}</td>
                    <td className="p-4 text-primary font-bold">{movie.rating}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setEditingMovie(movie)}
                          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(movie.id)}
                          disabled={deleteMovie.isPending}
                          className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Screening Form Component for Create/Edit
function ScreeningForm({ screening, movies, onClose, onSuccess }: { 
  screening?: any | null; 
  movies: Movie[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const createScreening = useCreateScreening();
  const updateScreening = useUpdateScreening();
  const [formData, setFormData] = useState({
    movieId: screening?.movieId || "",
    dateTime: screening ? new Date(screening.date + 'T' + screening.time).toISOString().slice(0, 16) : "",
    hallId: screening?.hall ? parseInt(screening.hall.replace('Hall ', '')) : 1,
    totalTickets: screening?.totalTickets || 100,
    availableTickets: screening?.availableTickets || 100,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const screeningData = {
      Movie_Id: parseInt(formData.movieId),
      Screening_Date_Time: new Date(formData.dateTime).toISOString(),
      Hall_Id: formData.hallId,
    };

    if (screening) {
      updateScreening.mutate({ 
        id: screening.id.toString(), 
        screening: {
          ...screeningData,
          Total_Tickets: formData.totalTickets,
          Available_Tickets: formData.availableTickets,
        }
      }, {
        onSuccess: () => onSuccess(),
      });
    } else {
      createScreening.mutate(screeningData, {
        onSuccess: () => onSuccess(),
      });
    }
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-bold text-foreground mb-4">
        {screening ? "Edit Screening" : "Add New Screening"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Movie *</label>
            <select
              required
              value={formData.movieId}
              onChange={(e) => setFormData({ ...formData, movieId: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground border border-border focus:border-primary focus:outline-none"
            >
              <option value="">Select a movie</option>
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id}>
                  {movie.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Date & Time *</label>
            <input
              type="datetime-local"
              required
              value={formData.dateTime}
              onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground border border-border focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Hall *</label>
            <select
              required
              value={formData.hallId}
              onChange={(e) => setFormData({ ...formData, hallId: parseInt(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground border border-border focus:border-primary focus:outline-none"
            >
              <option value={1}>Hall 1</option>
              <option value={2}>Hall 2</option>
              <option value={3}>Hall 3</option>
              <option value={4}>Hall 4</option>
              <option value={5}>Hall 5</option>
            </select>
          </div>
          {screening && (
            <>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Total Tickets</label>
                <input
                  type="number"
                  value={formData.totalTickets}
                  onChange={(e) => setFormData({ ...formData, totalTickets: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground border border-border focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Available Tickets</label>
                <input
                  type="number"
                  value={formData.availableTickets}
                  onChange={(e) => setFormData({ ...formData, availableTickets: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground border border-border focus:border-primary focus:outline-none"
                />
              </div>
            </>
          )}
        </div>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createScreening.isPending || updateScreening.isPending}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:scale-[1.02] transition-transform disabled:opacity-50"
          >
            {createScreening.isPending || updateScreening.isPending ? "Saving..." : screening ? "Update Screening" : "Create Screening"}
          </button>
        </div>
      </form>
    </div>
  );
}

function ShowtimesTab() {
  const { data: screenings = [], isLoading, error } = useScreenings();
  const { data: movies = [] } = useMovies();
  const deleteScreening = useDeleteScreening();
  const [editingScreening, setEditingScreening] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this screening?")) {
      deleteScreening.mutate(id);
    }
  };

  // Group screenings by movie
  const screeningsByMovie = screenings.reduce((acc: any, screening: any) => {
    const movieId = screening.movieId;
    if (!acc[movieId]) {
      acc[movieId] = [];
    }
    acc[movieId].push(screening);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-foreground">Showtimes</h2>
        </div>
        <div className="glass-card rounded-xl p-8 text-center">
          <p className="text-muted-foreground">Loading screenings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-foreground">Showtimes</h2>
        </div>
        <div className="glass-card rounded-xl p-8 text-center">
          <p className="text-destructive">Failed to load screenings. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-foreground">Showtimes</h2>
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold"
        >
          <Plus className="w-4 h-4" /> Add Showtime
        </button>
      </div>

      {isCreating && (
        <ScreeningForm 
          movies={movies}
          onClose={() => setIsCreating(false)} 
          onSuccess={() => setIsCreating(false)}
        />
      )}

      {editingScreening && (
        <ScreeningForm 
          screening={editingScreening}
          movies={movies}
          onClose={() => setEditingScreening(null)} 
          onSuccess={() => setEditingScreening(null)}
        />
      )}

      <div className="grid gap-4">
        {screenings.length === 0 ? (
          <div className="glass-card p-8 rounded-xl text-center">
            <p className="text-muted-foreground">No screenings found. Add your first screening!</p>
          </div>
        ) : (
          Object.entries(screeningsByMovie).map(([movieId, movieScreenings]: [string, any]) => {
            const movie = movies.find(m => m.id === movieId);
            return (
              <div key={movieId} className="glass-card p-4 rounded-xl">
                <h3 className="font-bold text-foreground mb-3">{movie?.title || `Movie ${movieId}`}</h3>
                <div className="flex flex-wrap gap-2">
                  {movieScreenings.map((screening: any) => (
                    <div key={screening.id} className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs flex items-center gap-2">
                      <span className="font-bold">{screening.time}</span> · {screening.hall} · ${screening.price}
                      <button 
                        onClick={() => setEditingScreening(screening)}
                        className="ml-2 hover:text-primary"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => handleDelete(screening.id.toString())}
                        disabled={deleteScreening.isPending}
                        className="hover:text-destructive disabled:opacity-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function HallsTab() {
  const halls = [
    { name: "IMAX 1", capacity: 320, type: "IMAX" },
    { name: "Standard 1", capacity: 180, type: "Standard" },
    { name: "Standard 2", capacity: 180, type: "Standard" },
    { name: "Standard 3", capacity: 150, type: "Standard" },
    { name: "Standard 4", capacity: 120, type: "Standard" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-foreground">Cinema Halls</h2>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
          <Plus className="w-4 h-4" /> Add Hall
        </button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {halls.map((hall) => (
          <div key={hall.name} className="glass-card p-5 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Armchair className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground">{hall.name}</p>
                <p className="text-xs text-muted-foreground">{hall.type}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground"><Users className="w-3 h-3 inline mr-1" />{hall.capacity} seats</p>
              <button className="text-xs text-primary font-semibold">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingsTab() {
  const bookings = [
    { id: "B001", movie: "Neon Horizon", user: "john@email.com", seats: "A12, A13", total: "$36", status: "Confirmed" },
    { id: "B002", movie: "Amber Skies", user: "sara@email.com", seats: "C5", total: "$12", status: "Confirmed" },
    { id: "B003", movie: "Iron Resolve", user: "mike@email.com", seats: "D1, D2, D3", total: "$54", status: "Pending" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">Recent Bookings</h2>
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 text-muted-foreground font-semibold">ID</th>
                <th className="text-left p-4 text-muted-foreground font-semibold">Movie</th>
                <th className="text-left p-4 text-muted-foreground font-semibold hidden md:table-cell">User</th>
                <th className="text-left p-4 text-muted-foreground font-semibold hidden lg:table-cell">Seats</th>
                <th className="text-left p-4 text-muted-foreground font-semibold">Total</th>
                <th className="text-left p-4 text-muted-foreground font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-mono text-xs text-foreground">{b.id}</td>
                  <td className="p-4 font-semibold text-foreground">{b.movie}</td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">{b.user}</td>
                  <td className="p-4 text-muted-foreground hidden lg:table-cell">{b.seats}</td>
                  <td className="p-4 text-primary font-bold">{b.total}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      b.status === "Confirmed" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                    }`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
