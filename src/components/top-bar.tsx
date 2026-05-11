import { Link } from "@tanstack/react-router";
import {
  Moon,
  Sun,
  Settings,
  LogOut,
  BarChart3,
  ChevronDown,
} from "lucide-react";
import { useAppStore } from "@/lib/app-store";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopBar() {
  const { user, state, updatePreferences } = useAppStore();
  const dark = state.preferences.theme === "dark";

  return (
    <header className="sticky top-0 z-20 w-full border-b border-[var(--color-border)] bg-[var(--color-canvas)]/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] rounded-[var(--radius-sm)]"
        >
          <span
            className="inline-block h-6 w-6 rounded-[var(--radius-sm)]"
            style={{ background: "var(--color-primary)" }}
            aria-hidden
          />
          Spaces<span className="text-[var(--color-primary)]">@LBG</span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-[var(--radius-pill)] py-1 pl-1 pr-2.5 hover:bg-[var(--color-surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]">
            <Avatar initials={user.initials} name={user.fullName} size={32} />
            <span className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-sm font-medium">{user.fullName.split(" ")[0]}</span>
              <span className="text-xs text-[var(--color-fg-muted)]">
                {user.role} · {user.location}
              </span>
            </span>
            <ChevronDown className="h-4 w-4 text-[var(--color-fg-muted)]" aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              {user.fullName}
              <div className="text-[10px] font-medium normal-case tracking-normal text-[var(--color-fg-subtle)] mt-0.5">
                {user.team} · {user.appRole === "manager" ? "Line manager" : user.appRole === "pa" ? "PA" : "Employee"}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/preferences">
                <Settings className="h-4 w-4" aria-hidden />
                Preferences
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                updatePreferences({ theme: dark ? "light" : "dark" });
              }}
            >
              {dark ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
              {dark ? "Light mode" : "Dark mode"}
            </DropdownMenuItem>
            {user.appRole === "manager" && (
              <DropdownMenuItem asChild>
                <Link to="/stats">
                  <BarChart3 className="h-4 w-4" aria-hidden />
                  Team stats
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/login">
                <LogOut className="h-4 w-4" aria-hidden />
                Sign out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
