import { useState } from "react";
import { motion } from "framer-motion";
import { User, Ticket, Heart, Clock, QrCode, Film, Calendar } from "lucide-react";

const tabs = ["Tickets", "History", "Favorites"] as const;
type Tab = (typeof tabs)[number];

const activeTickets = [
  { id: "T001", movie: "Neon Horizon", date: "Mar 6, 2026", time: "18:00", hall: "IMAX 1", seats: "A12, A13", qr: "NH-20260306-A12A13" },
  { id: "T002", movie: "Sky Wanderers", date: "Mar 6, 2026", time: "14:00", hall: "IMAX 1", seats: "C8", qr: "SW-20260306-C8" },
];

const history = [
  { movie: "Best Laid Plans", date: "Feb 28, 2026", total: "$12" },
  { movie: "The Hollow", date: "Feb 20, 2026", total: "$10" },
  { movie: "Iron Resolve", date: "Feb 14, 2026", total: "$36" },
];

const favorites = ["Neon Horizon", "Iron Resolve", "Sky Wanderers"];

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState<Tab>("Tickets");

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
          <h1 className="text-2xl font-black text-foreground">Guest User</h1>
          <p className="text-sm text-muted-foreground">guest@shoftv.com</p>
          <p className="text-xs text-primary mt-1">Premium Member</p>
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
          <div className="grid sm:grid-cols-2 gap-4">
            {activeTickets.map((ticket) => (
              <div key={ticket.id} className="glass-card p-5 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground">{ticket.movie}</h3>
                  <Ticket className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2"><Calendar className="w-3 h-3" />{ticket.date} at {ticket.time}</p>
                  <p className="flex items-center gap-2"><Film className="w-3 h-3" />{ticket.hall} · Seats: {ticket.seats}</p>
                </div>
                <div className="flex items-center justify-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <QrCode className="w-16 h-16 mx-auto text-foreground/70" />
                    <p className="text-[10px] text-muted-foreground mt-2 font-mono">{ticket.qr}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
