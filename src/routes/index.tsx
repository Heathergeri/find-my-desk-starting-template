import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Building2, Users, CalendarPlus } from "lucide-react";
import { useAppStore } from "@/lib/app-store";
import { useNow } from "@/lib/use-now";
import { TodayCard } from "@/components/home/today-card";
import { ReminderPanel } from "@/components/home/reminder-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTeam } from "@/data/app";
import { Avatar } from "@/components/ui/avatar";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { user, myBookingForToday, checkIn } = useAppStore();
  const now = useNow();
  const todays = myBookingForToday();
  const firstName = user.fullName.split(" ")[0] ?? user.fullName;
  const team = getTeam(user).slice(0, 6);

  return (
    <div className="grid gap-6">
      <TodayCard now={now} firstName={firstName} booking={todays} />

      <ReminderPanel
        booking={todays}
        now={now}
        onCheckIn={() => {
          if (todays) {
            checkIn(todays.id);
            toast.success("Checked in", { description: "Welcome in." });
          }
        }}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <QuickAction
          to="/book"
          icon={<Building2 className="h-5 w-5" aria-hidden />}
          title="Book a desk"
          subtitle="Up to 4 weeks ahead"
        />
        <QuickAction
          to="/book"
          icon={<CalendarPlus className="h-5 w-5" aria-hidden />}
          title="Book a meeting space"
          subtitle="Up to 3 months ahead"
        />
        <QuickAction
          to="/team"
          icon={<Users className="h-5 w-5" aria-hidden />}
          title="Sit with your team"
          subtitle={`${team.length} teammates nearby`}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your team this week</CardTitle>
            <p className="text-sm text-[var(--color-fg-muted)] mt-1">
              Coming in from {user.team} · {user.location}
            </p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/team">See all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-wrap gap-3">
            {team.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--color-border)] py-1.5 pl-1.5 pr-3"
              >
                <Avatar initials={t.initials} name={t.fullName} size={28} />
                <div className="leading-tight">
                  <div className="text-sm font-medium">{t.fullName}</div>
                  <div className="text-[11px] text-[var(--color-fg-muted)]">{t.role}</div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function QuickAction({
  to,
  icon,
  title,
  subtitle,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      to={to}
      className="group rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all duration-[var(--duration-base)] ease-[var(--ease-out-soft)] hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-pop)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
    >
      <div className="inline-flex items-center justify-center h-10 w-10 rounded-[var(--radius-md)] bg-[var(--color-primary-soft)] text-[var(--color-primary-soft-fg)]">
        {icon}
      </div>
      <div className="mt-3 font-display text-lg font-semibold">{title}</div>
      <div className="text-sm text-[var(--color-fg-muted)]">{subtitle}</div>
    </Link>
  );
}
