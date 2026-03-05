import { useState } from "react";
import { motion } from "framer-motion";
import { User, Ticket, Heart, Clock, QrCode, Film, Calendar, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserTickets } from "@/hooks/useTickets";
import { toast } from "sonner";

const tabs = ["Tickets", "History", "Favorites"] as const;
type Tab = (typeof tabs)[number];

const history = [
  { movie: "Best Laid Plans", date: "Feb 28, 2026", total: "$12" },
  { movie: "The Hollow", date: "Feb 20, 2026", total: "$10" },
  { movie: "Iron Resolve", date: "Feb 14, 2026", total: "$36" },
];

const favorites = ["Neon Horizon", "Iron Resolve", "Sky Wanderers"];

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState<Tab>("Tickets");
  const { user, isAuthenticated } = useAuth();
  const { data: tickets, isLoading: ticketsLoading, error: ticketsError } = useUserTickets(user?.Id.toString() || "");

  // Show error toast if tickets fail to load
  if (ticketsError) {
    toast.error("Failed to load tickets", {
      description: "Unable to fetch your tickets. Please try again later.",
    });
  }

  // Format date and time from ISO string
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeStr = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
    return { date: dateStr, time: timeStr };
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-xl flex flex-col sm:flex-row items-center gap-5"
      >
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center neon-border">
          <User className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-black text-foreground">{user?.Name || "Guest User"}</h1>
          <p className="text-sm text-muted-foreground">{user?.Email || "guest@shoftv.com"}</p>
          <p className="text-xs text-primary mt-1">{user?.Role === "Admin" ? "Admin" : "Premium Member"}</p>
        </div>
        <button className="sm:ml-auto px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-muted transition-colors">
          Edit Profile
        </button>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab
                ? "bg-primary text-primary-foreground neon-border"
                : "bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {activeTab === "Tickets" && (
          <>
            {ticketsLoading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : ticketsError ? (
              <div className="glass-card p-8 rounded-xl text-center">
                <p className="text-muted-foreground">Failed to load tickets. Please try again later.</p>
              </div>
            ) : !tickets || tickets.length === 0 ? (
              <div className="glass-card p-8 rounded-xl text-center">
                <Ticket className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No tickets found. Book a movie to see your tickets here!</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {tickets.map((ticket) => {
                  const { date, time } = formatDateTime(ticket.Watch_Movie);
                  return (
                    <div key={ticket.Id} className="glass-card p-5 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-foreground">{ticket.MovieName}</h3>
                        <Ticket className="w-5 h-5 text-primary" />
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p className="flex items-center gap-2"><Calendar className="w-3 h-3" />{date} at {time}</p>
                        <p className="flex items-center gap-2"><Film className="w-3 h-3" />{ticket.HallName} · Row {ticket.Row}, Seat {ticket.Column}</p>
                      </div>
                      <div className="flex items-center justify-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-center">
                          <QrCode className="w-16 h-16 mx-auto text-foreground/70" />
                          <p className="text-[10px] text-muted-foreground mt-2 font-mono">TICKET-{ticket.Id}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === "History" && (
          <div className="glass-card rounded-xl overflow-hidden">
            {history.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-semibold text-foreground">{item.movie}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{item.date}</p>
                </div>
                <p className="text-sm font-bold text-primary">{item.total}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Favorites" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((name) => (
              <div key={name} className="glass-card p-4 rounded-xl flex items-center gap-3">
                <Heart className="w-5 h-5 text-primary fill-primary" />
                <p className="font-semibold text-foreground">{name}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
