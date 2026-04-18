import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import CinemaLayout from "@/components/layout/CinemaLayout";
import DiscoveryHub from "@/pages/DiscoveryHub";
import MovieDetail from "@/pages/MovieDetail";
import AdminDashboard from "@/pages/AdminDashboard";
import UserProfile from "@/pages/UserProfile";
import NotFound from "./pages/NotFound";
import Tickets from "./pages/Tickets";
import Support from "./pages/Support";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<CinemaLayout />}>
              <Route path="/" element={<DiscoveryHub />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/movies" element={<DiscoveryHub />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/support" element={<Support />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/profile" element={<UserProfile />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
