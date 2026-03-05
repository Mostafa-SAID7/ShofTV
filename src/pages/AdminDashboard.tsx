import { useState } from "react";
import { motion } from "framer-motion";
import { Film, Calendar, Armchair, Users, TrendingUp, DollarSign, Plus, Edit, Trash2 } from "lucide-react";
import { movies } from "@/data/movies";

const tabs = ["Movies", "Showtimes", "Halls", "Bookings"] as const;
type Tab = (typeof tabs)[number];

const stats = [
  { label: "Total Movies", value: movies.length, icon: Film, change: "+2 this week" },
  { label: "Active Showtimes", value: 14, icon: Calendar, change: "6 today" },
  { label: "Total Bookings", value: 1284, icon: TrendingUp, change: "+12% vs last week" },
  { label: "Revenue", value: "$18,420", icon: DollarSign, change: "+8% vs last week" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("Movies");

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

function MoviesTab() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-foreground">All Movies</h2>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:scale-[1.02] transition-transform">
          <Plus className="w-4 h-4" /> Add Movie
        </button>
      </div>
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
              {movies.map((movie) => (
                <tr key={movie.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-semibold text-foreground">{movie.title}</td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">{movie.genres.join(", ")}</td>
                  <td className="p-4 text-muted-foreground hidden lg:table-cell">{movie.director}</td>
                  <td className="p-4 text-primary font-bold">{movie.rating}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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

function ShowtimesTab() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-foreground">Showtimes</h2>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
          <Plus className="w-4 h-4" /> Add Showtime
        </button>
      </div>
      <div className="grid gap-4">
        {movies.slice(0, 3).map((movie) => (
          <div key={movie.id} className="glass-card p-4 rounded-xl">
            <h3 className="font-bold text-foreground mb-3">{movie.title}</h3>
            <div className="flex flex-wrap gap-2">
              {movie.showtimes[0]?.times.map((show, i) => (
                <div key={i} className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs">
                  <span className="font-bold">{show.time}</span> · {show.hall} · ${show.price}
                </div>
              ))}
            </div>
          </div>
        ))}
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
