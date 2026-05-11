import { Link, useRouterState } from "@tanstack/react-router";
import { Home, CalendarCheck, Users, Map } from "lucide-react";
import { cn } from "@/lib/cn";

const ITEMS = [
  { to: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  { to: "/bookings", label: "My Bookings", icon: CalendarCheck, match: (p: string) => p.startsWith("/bookings") },
  { to: "/team", label: "My Team", icon: Users, match: (p: string) => p.startsWith("/team") },
  { to: "/wayfinder", label: "Wayfinder", icon: Map, match: (p: string) => p.startsWith("/wayfinder") },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-md md:left-1/2 md:right-auto md:bottom-6 md:-translate-x-1/2 md:rounded-[var(--radius-pill)] md:border md:shadow-[var(--shadow-pop)] md:px-1.5 md:py-1.5 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 px-2"
    >
      <ul className="flex items-center justify-around gap-1 md:gap-0.5">
        {ITEMS.map((it) => {
          const Icon = it.icon;
          const active = it.match(pathname);
          return (
            <li key={it.to} className="flex-1 md:flex-initial">
              <Link
                to={it.to}
                className={cn(
                  "group flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 rounded-[var(--radius-md)] md:rounded-[var(--radius-pill)] py-1.5 md:py-2 md:px-4 text-[10px] md:text-sm font-medium transition-colors duration-[var(--duration-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]",
                  active
                    ? "text-[var(--color-primary-soft-fg)] bg-[var(--color-primary-soft)]"
                    : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-surface-2)]",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-[var(--duration-fast)]",
                    active && "scale-110",
                  )}
                  aria-hidden
                />
                <span>{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
