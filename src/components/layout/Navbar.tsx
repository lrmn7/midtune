import { Link, NavLink } from "react-router-dom";
import { Logo } from "@/components/ui/Logo";

const navLinks = [
  { to: "/", label: "home" },
  { to: "/tracks", label: "tracks" },
  { to: "/license", label: "license" },
  { to: "/faq", label: "faq" },
  { to: "https://ko-fi.com/eleremen", label: "donate", external: true },
];

export function Navbar() {
  return (
    <header
      className="sticky top-0 z-30 bg-paper/85 backdrop-blur border-b border-foreground/80"
      style={{ background: "color-mix(in oklab, var(--paper) 88%, transparent)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link to="/" aria-label="Midtune home">
          <Logo size="md" />
        </Link>
        <nav className="hidden md:flex items-center gap-6 font-mono text-xs uppercase tracking-[0.18em]">
          {navLinks.map((l) =>
            l.external ? (
              <a
                key={l.to}
                href={l.to}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </a>
            ) : (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `transition-colors ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`
                }
              >
                {l.label}
              </NavLink>
            )
          )}
        </nav>
        <Link
          to="/tracks"
          className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 bg-foreground text-background font-mono text-xs uppercase tracking-wider hover:bg-brown transition-colors"
        >
          browse archive →
        </Link>
      </div>
      <div className="md:hidden border-t border-foreground/40">
        <nav className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.18em] overflow-x-auto">
          {navLinks.map((l) =>
            l.external ? (
              <a
                key={l.to}
                href={l.to}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
              >
                {l.label}
              </a>
            ) : (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `transition-colors whitespace-nowrap ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`
                }
              >
                {l.label}
              </NavLink>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
