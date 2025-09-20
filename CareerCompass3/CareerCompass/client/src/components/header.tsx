import { Moon, Sun, Compass } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Compass className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">CareerCompass</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className={`text-sm font-medium hover:text-primary transition-colors ${location === '/' ? 'text-primary' : ''}`} data-testid="nav-home">
            Home
          </Link>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Career Paths</a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Skills Assessment</a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Resources</a>
        </nav>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            data-testid="button-theme-toggle"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" data-testid="button-get-started">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}
