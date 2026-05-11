import { AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import type { Booking } from "@/lib/app-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

type Props = {
  booking: Booking | undefined;
  now: Date;
  onCheckIn: () => void;
};

export function ReminderPanel({ booking, now, onCheckIn }: Props) {
  if (!booking) return null;

  const hour = now.getHours();
  const minute = now.getMinutes();
  const before10am = hour < 10;
  const checkedIn = !!booking.checkedInAt;
  const past10am = !checkedIn && (hour > 10 || (hour === 10 && minute > 0));
  const wrapUpSoon = checkedIn && (() => {
    const [eh, em] = booking.end.split(":").map(Number);
    const endMin = (eh ?? 0) * 60 + (em ?? 0);
    const nowMin = hour * 60 + minute;
    return endMin - nowMin <= 60 && endMin - nowMin > 0;
  })();

  if (checkedIn && !wrapUpSoon) {
    return (
      <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 text-sm">
        <CheckCircle2 className="h-4 w-4 text-[var(--color-success)]" aria-hidden />
        <span>You're checked in. Have a productive day.</span>
      </div>
    );
  }

  if (wrapUpSoon) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[oklch(0.8_0.14_75)] bg-[oklch(0.97_0.05_75)] dark:bg-[oklch(0.32_0.1_75)] dark:border-[oklch(0.5_0.14_75)] px-4 py-3 text-sm">
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4" aria-hidden />
          <span>
            Your morning slot wraps up by <strong>{booking.end}</strong> — fancy a change of desk?
          </span>
        </div>
        <Button variant="outline" size="sm">
          Find a new desk
        </Button>
      </div>
    );
  }

  if (past10am) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        role="alert"
        className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-[var(--radius-lg)] border-2 border-[var(--color-danger)] bg-[var(--color-danger-soft)] dark:bg-[oklch(0.28_0.12_27)] dark:border-[oklch(0.6_0.2_27)] px-4 py-3.5"
      >
        <div className="flex items-start gap-3">
          <span className={cn("pulse-ring inline-flex items-center justify-center rounded-full bg-[var(--color-danger)] text-white h-8 w-8 shrink-0")}>
            <AlertCircle className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <div className="font-semibold text-[var(--color-danger)] dark:text-[oklch(0.92_0.1_27)]">
              Desk released — please rebook
            </div>
            <div className="text-sm text-[var(--color-fg-muted)] mt-0.5">
              The 10am rule kicked in and your desk is back in the pool. Pick a new one to keep your day.
            </div>
          </div>
        </div>
        <Button variant="danger" size="md">
          Rebook now
        </Button>
      </motion.div>
    );
  }

  // Pre-10am, not yet checked in → calm but clear nudge
  const minutesUntil10 = (10 - hour) * 60 - minute;
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-[var(--radius-lg)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-3.5 shadow-[var(--shadow-card)]"
    >
      <div className="flex items-start gap-3">
        <span className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary-soft-fg)] h-8 w-8 shrink-0">
          <Clock className="h-4 w-4" aria-hidden />
        </span>
        <div>
          <div className="font-semibold">Check in by 10:00</div>
          <div className="text-sm text-[var(--color-fg-muted)] mt-0.5 flex items-center gap-2">
            <span>
              {minutesUntil10 > 0
                ? `${minutesUntil10} min remaining`
                : "Last chance — desk releases at 10am"}
            </span>
            {minutesUntil10 <= 30 && minutesUntil10 > 0 && (
              <Badge variant="warning">Closing soon</Badge>
            )}
          </div>
        </div>
      </div>
      <Button variant="primary" size="md" onClick={onCheckIn}>
        Check in now
      </Button>
    </motion.div>
  );
}
