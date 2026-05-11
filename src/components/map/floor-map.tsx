import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/cn";
import {
  DESKS_BY_FLOOR,
  FLOORS,
  desksMatchingAmenities,
  type Desk,
  type FloorId,
} from "@/data/desks";
import { AMENITY_BY_ID, type AmenityId } from "@/lib/amenities";
import { USER_BY_ID } from "@/data/app";
import type { Booking } from "@/lib/app-store";

type Props = {
  floor: FloorId;
  selectedDeskId: string | null;
  onSelect: (deskId: string) => void;
  amenityFilters: AmenityId[];
  bookingsForDate: Booking[];
  currentUserId: string;
  teamUserIds: Set<string>;
};

type DeskState =
  | "available"
  | "selected"
  | "team"
  | "occupied"
  | "filtered-out"
  | "mine";

function getState(
  desk: Desk,
  args: {
    selectedDeskId: string | null;
    teamUserIds: Set<string>;
    currentUserId: string;
    bookingByDesk: Map<string, Booking>;
    matchSet: Set<string>;
  },
): DeskState {
  const b = args.bookingByDesk.get(desk.id);
  if (b?.userId === args.currentUserId) return "mine";
  if (desk.id === args.selectedDeskId) return "selected";
  if (b) return args.teamUserIds.has(b.userId) ? "team" : "occupied";
  if (!args.matchSet.has(desk.id)) return "filtered-out";
  return "available";
}

export function FloorMap({
  floor,
  selectedDeskId,
  onSelect,
  amenityFilters,
  bookingsForDate,
  currentUserId,
  teamUserIds,
}: Props) {
  const floorData = FLOORS[floor];
  const desks = DESKS_BY_FLOOR[floor];

  const bookingByDesk = useMemo(() => {
    const map = new Map<string, Booking>();
    for (const b of bookingsForDate) {
      if (b.deskId) map.set(b.deskId, b);
    }
    return map;
  }, [bookingsForDate]);

  const matchSet = useMemo(
    () => new Set(desksMatchingAmenities(desks, amenityFilters).map((d) => d.id)),
    [desks, amenityFilters],
  );

  return (
    <div
      className="relative w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-2)]"
      style={{ aspectRatio: `${floorData.width} / ${floorData.height}` }}
    >
      <img
        src={floorData.image}
        alt={`${floorData.label} plan`}
        className="absolute inset-0 h-full w-full object-cover opacity-90 dark:opacity-60 dark:invert"
        draggable={false}
      />
      <div className="absolute inset-0 bg-[var(--color-surface)]/40 dark:bg-[var(--color-canvas)]/30" />

      {/* zone labels */}
      {floorData.zones.map((z) => (
        <div
          key={z.id}
          aria-hidden
          className="absolute hidden md:flex items-center justify-center pointer-events-none"
          style={{
            left: `${z.x}%`,
            top: `${z.y}%`,
            width: `${z.w}%`,
            height: `${z.h}%`,
          }}
        >
          <span className="rounded-[var(--radius-pill)] bg-[var(--color-surface)]/85 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--color-fg-muted)] border border-[var(--color-border)]">
            {z.name}
          </span>
        </div>
      ))}

      {/* desks */}
      {desks.map((d) => {
        const state = getState(d, {
          selectedDeskId,
          teamUserIds,
          currentUserId,
          bookingByDesk,
          matchSet,
        });
        const booking = bookingByDesk.get(d.id);
        const occupant = booking ? USER_BY_ID[booking.userId] : undefined;
        const interactive = state === "available" || state === "selected" || state === "team";
        return (
          <Tooltip key={d.id}>
            <TooltipTrigger asChild>
              <motion.button
                type="button"
                disabled={!interactive}
                onClick={() => interactive && onSelect(d.id)}
                whileHover={interactive ? { scale: 1.35 } : undefined}
                whileTap={interactive ? { scale: 1.1 } : undefined}
                transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                aria-label={`Desk ${d.number}`}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-canvas)]",
                  state === "available" &&
                    "h-3 w-3 md:h-3.5 md:w-3.5 bg-[var(--color-desk-available)] border-white shadow-[0_0_0_2px_oklch(0_0_0_/_0.15)] cursor-pointer",
                  state === "selected" &&
                    "h-4 w-4 md:h-5 md:w-5 bg-[var(--color-desk-selected)] border-white shadow-[0_0_0_3px_oklch(0.42_0.13_150_/_0.35)]",
                  state === "team" &&
                    "h-3.5 w-3.5 md:h-4 md:w-4 bg-[var(--color-desk-team)] border-white",
                  state === "occupied" &&
                    "h-2.5 w-2.5 md:h-3 md:w-3 bg-[var(--color-desk-unavailable)] border-[var(--color-border)] cursor-not-allowed",
                  state === "filtered-out" &&
                    "h-2 w-2 bg-[var(--color-desk-unavailable)]/40 border-transparent cursor-not-allowed",
                  state === "mine" &&
                    "h-4 w-4 md:h-5 md:w-5 bg-[var(--color-primary)] border-white shadow-[0_0_0_3px_oklch(0.42_0.13_150_/_0.5)]",
                )}
                style={{ left: `${d.x}%`, top: `${d.y}%` }}
              />
            </TooltipTrigger>
            <TooltipContent>
              {state === "team" && occupant ? (
                <div className="flex items-start gap-2 max-w-[220px]">
                  <Avatar initials={occupant.initials} name={occupant.fullName} size={28} />
                  <div className="leading-tight">
                    <div className="font-semibold text-[13px]">{occupant.fullName}</div>
                    <div className="text-[11px] opacity-80">{occupant.role}</div>
                    <div className="mt-1 text-[11px] opacity-90">
                      Desk {d.number} · {occupant.team}
                    </div>
                  </div>
                </div>
              ) : state === "occupied" ? (
                <div>
                  <div className="font-semibold">Desk {d.number}</div>
                  <div className="opacity-80">Booked</div>
                </div>
              ) : state === "mine" ? (
                <div>
                  <div className="font-semibold">Your desk · {d.number}</div>
                  <div className="opacity-80">{floorData.zones.find((z) => z.id === d.zone)?.name}</div>
                </div>
              ) : (
                <div className="max-w-[220px]">
                  <div className="font-semibold">Desk {d.number}</div>
                  <div className="opacity-80 text-[11px] mb-1">
                    {floorData.zones.find((z) => z.id === d.zone)?.name}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {d.amenities.slice(0, 4).map((a) => (
                      <Badge key={a} variant="outline" className="text-[10px]">
                        {AMENITY_BY_ID[a].label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </TooltipContent>
          </Tooltip>
        );
      })}

      {/* legend */}
      <div className="absolute bottom-2 left-2 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-[var(--radius-md)] bg-[var(--color-surface)]/95 px-2.5 py-1.5 text-[10px] text-[var(--color-fg-muted)] border border-[var(--color-border)]">
        <LegendDot color="var(--color-desk-available)" label="Available" />
        <LegendDot color="var(--color-desk-team)" label="Teammate" />
        <LegendDot color="var(--color-desk-selected)" label="Selected" />
        <LegendDot color="var(--color-desk-unavailable)" label="Booked" />
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
