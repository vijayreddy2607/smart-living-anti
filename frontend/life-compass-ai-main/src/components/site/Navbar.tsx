import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 pt-4">
      <nav className="glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-5 py-3">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="font-semibold tracking-tight">
            Smart<span className="text-gradient">Living</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Overview</Link>
          <Link to="/plan" className="hover:text-foreground transition-colors">Plan</Link>
          <Link to="/results" className="hover:text-foreground transition-colors">Insights</Link>
          <Link to="/booking" className="hover:text-foreground transition-colors">Assistant</Link>
        </div>
        <Link
          to="/plan"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
        >
          Start Planning
        </Link>
      </nav>
    </header>
  );
}
