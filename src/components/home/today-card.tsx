import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Building2, MapPin, ArrowRight } from "lucide-react";
import { AnimatedSky } from "./animated-sky";
import { Button } from "@/components/ui/button";
import { greetingFor, type Greeting } from "@/lib/use-now";
import type { Booking } from "@/lib/app-store";
import { DESK_BY_ID, FLOORS } from "@/data/desks";
import { AMENITY_BY_ID } from "@/lib/amenities";

type Props = {
  now: Date;
  firstName: string;
  booking: Booking | undefined;
};

export function TodayCard({ now, firstName, booking }: Props) {
  const greeting: Greeting = greetingFor(now, firstName);
  const desk = booking?.deskId ? DESK_BY_ID[booking.deskId] : undefined;
  const floor = desk ? FLOORS[desk.floor] : undefined;

  return (
    <section className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)]">
      <AnimatedSky partOfDay={greeting.partOfDay} />
      <div className="relative z-10 grid gap-5 sm:grid-cols-2 p-6 sm:p-8 min-h-[260px]">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-end text-white drop-shadow-sm"
        >
          <p className="font-display text-3xl sm:text-4xl font-semibold leading-tight">
            {greeting.text}.
          </p>
          <p className="mt-2 text-white/90 max-w-xs">
            {booking
              ? "Here's where you're working today."
              : "Where would you like to work today?"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          className="flex flex-col justify-end"
        >
          {booking && desk && floor ? (
            <div className="rounded-[var(--radius-md)] bg-[var(--color-surface)]/96 backdrop-blur p-5">
              <div className="text-xs uppercase tracking-wider text-[var(--color-fg-muted)]">
                Today's desk
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-2xl font-semibold">{desk.number}</span>
                <span className="text-sm text-[var(--color-fg-muted)]">
                  {floor.label} · {booking.start}–{booking.end}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {desk.amenities.slice(0, 4).map((a) => {
                  const am = AMENITY_BY_ID[a];
                  const Icon = am.icon;
                  return (
                    <span
                      key={a}
                      className="inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-[var(--color-surface-2)] px-2 py-0.5 text-xs"
                    >
                      <Icon className="h-3 w-3" aria-hidden />
                      {am.label}
                    </span>
                  );
                })}
                {desk.amenities.length > 4 && (
                  <span className="text-xs text-[var(--color-fg-muted)] self-center">
                    +{desk.amenities.length - 4} more
                  </span>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <Button asChild variant="primary" size="sm">
                  <Link to="/wayfinder">
                    <MapPin className="h-4 w-4" aria-hidden />
                    Wayfinder
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="sm">
                  <Link to="/bookings">Manage</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-[var(--radius-md)] bg-[var(--color-surface)]/96 backdrop-blur p-5">
              <div className="text-xs uppercase tracking-wider text-[var(--color-fg-muted)]">
                No booking today
              </div>
              <p className="mt-1 font-display text-xl font-semibold">
                Book a desk in seconds
              </p>
              <Button asChild variant="primary" size="md" className="mt-4 w-full sm:w-auto">
                <Link to="/book">
                  <Building2 className="h-4 w-4" aria-hidden />
                  Find a desk
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
