import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Home, ArrowLeft, Film } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    
    // Show toast notification
    toast.error("Page Not Found", {
      description: `The page "${location.pathname}" doesn't exist.`,
      duration: 4000,
    });
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          {/* 404 Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <Film className="h-32 w-32 text-muted-foreground/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-bold text-primary">404</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Page Not Found
          </h1>

          {/* Description */}
          <p className="mb-8 text-lg text-muted-foreground">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>

          {/* Attempted Path */}
          <div className="mb-8 rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              Attempted to access:{" "}
              <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                {location.pathname}
              </code>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              onClick={() => navigate(-1)}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            <Button
              size="lg"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Return to Home
            </Button>
          </div>

          {/* Additional Help */}
          <div className="mt-12 text-sm text-muted-foreground">
            <p>
              Need help? Try searching for movies or{" "}
              <button
                onClick={() => navigate("/")}
                className="text-primary underline hover:text-primary/90"
              >
                browse our collection
              </button>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
