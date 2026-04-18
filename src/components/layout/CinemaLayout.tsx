import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Film,
  Ticket,
  User,
  MessageCircle,
  HelpCircle,
  Moon,
  Sun,
  Menu,
  X,
  Clapperboard,
  LayoutDashboard,
  LogIn,
  LogOut,
  Send,
  Bot,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { label: "Discover", path: "/", icon: Home },
  { label: "Movies", path: "/movies", icon: Film },
  { label: "My Tickets", path: "/tickets", icon: Ticket },
  { label: "Profile", path: "/profile", icon: User },
  { label: "Admin", path: "/admin", icon: LayoutDashboard },
  { label: "Support", path: "/support", icon: HelpCircle },
];

const mobileNav = [
  { label: "Home", path: "/", icon: Home },
  { label: "Movies", path: "/movies", icon: Film },
  { label: "Tickets", path: "/tickets", icon: Ticket },
  { label: "Profile", path: "/profile", icon: User },
];

export default function CinemaLayout() {
  const [dark, setDark] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your ShofTV assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark", !dark);
  };

  // Set dark mode on mount
  useState(() => {
    document.documentElement.classList.add("dark");
  });

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: chatMessage,
      isBot: false,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getBotResponse(chatMessage),
        isBot: true,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const getBotResponse = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("ticket") || lowerMessage.includes("book")) {
      return "You can book tickets by browsing our movies and selecting your preferred showtime. Need help finding a specific movie?";
    } else if (lowerMessage.includes("cancel") || lowerMessage.includes("refund")) {
      return "You can cancel tickets up to 2 hours before showtime. Visit your profile to manage your bookings.";
    } else if (lowerMessage.includes("payment") || lowerMessage.includes("pay")) {
      return "We accept all major credit cards, PayPal, Apple Pay, and Google Pay. All payments are secure and encrypted.";
    } else if (lowerMessage.includes("help") || lowerMessage.includes("support")) {
      return "I'm here to help! You can also visit our Support page for detailed FAQs and contact options.";
    } else {
      return "Thanks for your message! For detailed assistance, please visit our Support page or contact our team directly.";
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed h-full z-40 border-r border-border/50 bg-sidebar glass-card">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center neon-border">
            <Clapperboard className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-foreground">
            Shof<span className="text-primary">TV</span>
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-primary/10 text-primary neon-border"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border/50">
          {isAuthenticated && user ? (
            <div className="mb-3 px-4 py-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{user.Name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.Email}</p>
                </div>
              </div>
              <button
                onClick={() => logout()}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all w-full"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-3 px-4 py-3 mb-3 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-all"
            >
              <LogIn className="w-5 h-5" />
              Login
            </Link>
          )}
          <button
            onClick={toggleDark}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all w-full"
          >
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {dark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-72 z-50 bg-sidebar border-r border-border/50 glass-card lg:hidden"
            >
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                    <Clapperboard className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-extrabold text-foreground">
                    Shof<span className="text-primary">TV</span>
                  </span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-muted-foreground">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="px-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive(item.path)
                        ? "bg-primary/10 text-primary neon-border"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="p-4 mt-auto border-t border-border/50">
                {isAuthenticated && user ? (
                  <div className="mb-3 px-4 py-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{user.Name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.Email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setSidebarOpen(false);
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 mb-3 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                  >
                    <LogIn className="w-5 h-5" />
                    Login
                  </Link>
                )}
                <button
                  onClick={toggleDark}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted w-full"
                >
                  {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  {dark ? "Light Mode" : "Dark Mode"}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-border/50 bg-sidebar/80 backdrop-blur-lg sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-foreground">
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-lg font-extrabold text-foreground">
            Shof<span className="text-primary">TV</span>
          </span>
          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
            ) : (
              <Link to="/login" className="text-primary">
                <LogIn className="w-5 h-5" />
              </Link>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 pb-20 lg:pb-0">
          <Outlet />
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-sidebar/90 backdrop-blur-xl border-t border-border/50">
          <div className="flex items-center justify-around h-16">
            {mobileNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                  isActive(item.path)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive(item.path) ? "drop-shadow-[0_0_8px_hsla(0,84%,48%,0.6)]" : ""}`} />
                <span className="text-[10px] font-semibold">{item.label}</span>
                {isActive(item.path) && (
                  <motion.div
                    layoutId="bottomNav"
                    className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
                    style={{ boxShadow: "0 0 10px hsla(0,84%,48%,0.6)" }}
                  />
                )}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Chat Widget */}
      <button 
        onClick={() => setChatOpen(true)}
        className="fixed bottom-40 lg:bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg animate-pulse-neon hover:scale-110 transition-transform"
      >
        <MessageCircle className="w-6 h-6 text-primary-foreground" />
      </button>

      {/* Chat Modal */}
      <AnimatePresence>
        {chatOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setChatOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-4 right-4 w-80 h-96 bg-sidebar border border-border/50 rounded-xl shadow-2xl z-50 flex flex-col glass-card"
            >
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">ShofTV Support</h3>
                    <p className="text-xs text-muted-foreground">Online now</p>
                  </div>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg text-sm ${
                        message.isBot
                          ? 'bg-muted text-foreground'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-border/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!chatMessage.trim()}
                    className="px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
