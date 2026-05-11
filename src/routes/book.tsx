import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Building2, CalendarCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FloorMap } from "@/components/map/floor-map";
import { AmenityFilter } from "@/components/map/amenity-filter";
import { FLOORS, DESK_BY_ID, type FloorId } from "@/data/desks";
import { AMENITY_BY_ID, type AmenityId } from "@/lib/amenities";
import { useAppStore, todayISO } from "@/lib/app-store";
import { getTeam } from "@/data/app";

export const Route = createFileRoute("/book")({
  component: BookPage,
});

const MAX_DESK_HORIZON_DAYS = 28;
const MAX_ROOM_HORIZON_DAYS = 90;
const PA_ROOM_HORIZON_DAYS = 365;

function addDays(iso: string, n: number) {
  const d = new Date(iso);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function BookPage() {
  const { user, addBooking, bookingsForDate } = useAppStore();
  const [floor, setFloor] = useState<FloorId>("ground");
  const [date, setDate] = useState<string>(todayISO());
  const [amenityFilters, setAmenityFilters] = useState<AmenityId[]>([]);
  const [selectedDeskId, setSelectedDeskId] = useState<string | null>(null);
  const todayBookings = bookingsForDate(date);

  const teamUserIds = useMemo(() => new Set(getTeam(user).map((u) => u.id)), [user]);

  const selectedDesk = selectedDeskId ? DESK_BY_ID[selectedDeskId] : null;
  const horizonDay = Math.min(
    MAX_DESK_HORIZON_DAYS,
    user.bookingWindowDays ?? MAX_DESK_HORIZON_DAYS,
  );
  const maxDate = addDays(todayISO(), horizonDay);
  const minDate = todayISO();

  const handleConfirm = () => {
    if (!selectedDesk) return;
    addBooking({
      type: "desk",
      deskId: selectedDesk.id,
      date,
      start: "09:00",
      end: "17:30",
    });
    toast.success("Desk booked", {
      description: `${selectedDesk.number} · ${formatDate(date)}`,
    });
    setSelectedDeskId(null);
  };

  return (
    <div className="grid gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Book a space</h1>
        <p className="text-sm text-[var(--color-fg-muted)]">
          Desks up to 4 weeks ahead. Meeting rooms up to 3 months
          {user.appRole === "pa" ? " (1 year as PA)" : ""}.
        </p>
      </header>

      <Tabs defaultValue="desk">
        <TabsList>
          <TabsTrigger value="desk">
            <Building2 className="h-4 w-4 mr-1.5" aria-hidden />
            Book a desk
          </TabsTrigger>
          <TabsTrigger value="room">
            <CalendarCheck className="h-4 w-4 mr-1.5" aria-hidden />
            Book a meeting space
          </TabsTrigger>
        </TabsList>

        <TabsContent value="desk">
          <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
            <aside className="grid gap-4 lg:sticky lg:top-20 lg:self-start">
              <Card>
                <CardHeader>
                  <CardTitle>When?</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 grid gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => date > minDate && setDate(addDays(date, -1))}
                      aria-label="Previous day"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <input
                      type="date"
                      value={date}
                      min={minDate}
                      max={maxDate}
                      onChange={(e) => setDate(e.target.value)}
                      className="flex-1 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => date < maxDate && setDate(addDays(date, 1))}
                      aria-label="Next day"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-xs text-[var(--color-fg-muted)]">
                    {formatDate(date)} · {todayBookings.length} desks booked already
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Floor</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 flex gap-2">
                  {Object.values(FLOORS).map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFloor(f.id)}
                      className={`flex-1 rounded-[var(--radius-md)] border px-3 py-2 text-sm font-medium transition-colors ${
                        f.id === floor
                          ? "bg-[var(--color-primary)] text-[var(--color-primary-fg)] border-[var(--color-primary)]"
                          : "bg-[var(--color-surface-2)] border-[var(--color-border)] hover:border-[var(--color-border-strong)]"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </CardContent>
              </Card>

              <AmenityFilter
                selected={amenityFilters}
                onToggle={(id) =>
                  setAmenityFilters((cur) =>
                    cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id],
                  )
                }
                userDefaults={user.amenities}
                onApplyDefaults={() => setAmenityFilters(user.amenities)}
                onClear={() => setAmenityFilters([])}
              />
            </aside>

            <section className="grid gap-4">
              <FloorMap
                floor={floor}
                selectedDeskId={selectedDeskId}
                onSelect={setSelectedDeskId}
                amenityFilters={amenityFilters}
                bookingsForDate={todayBookings}
                currentUserId={user.id}
                teamUserIds={teamUserIds}
              />

              {selectedDesk ? (
                <Card>
                  <CardHeader className="flex flex-row items-start justify-between gap-4">
                    <div>
                      <CardTitle>Desk {selectedDesk.number}</CardTitle>
                      <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                        {FLOORS[selectedDesk.floor].label} ·{" "}
                        {FLOORS[selectedDesk.floor].zones.find((z) => z.id === selectedDesk.zone)?.name}
                      </p>
                    </div>
                    <Button variant="primary" onClick={handleConfirm}>
                      Confirm booking
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedDesk.amenities.map((a) => {
                        const am = AMENITY_BY_ID[a];
                        const Icon = am.icon;
                        const matches = user.amenities.includes(a);
                        return (
                          <Badge
                            key={a}
                            variant={matches ? "primary" : "default"}
                            title={am.description}
                          >
                            <Icon className="h-3 w-3" aria-hidden />
                            {am.label}
                          </Badge>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-6 text-sm text-[var(--color-fg-muted)]">
                    Pick a desk on the map to see its amenities and confirm a booking. Hover a
                    teammate-coloured dot to see who's there.
                  </CardContent>
                </Card>
              )}
            </section>
          </div>
        </TabsContent>

        <TabsContent value="room">
          <Card>
            <CardHeader>
              <CardTitle>Meeting rooms</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-[var(--color-fg-muted)]">
              <p>
                Booking horizon: <strong>{user.appRole === "pa" ? "1 year" : "3 months"}</strong>{" "}
                {user.appRole === "pa" && "(PA on behalf of execs)"}.
              </p>
              <p>
                Meeting-room booking UI is scoped for the next sprint — the data model and
                horizon enforcement are specified in the engineering hand-off doc.
              </p>
              <p className="text-xs">
                Horizon constants: <code>MAX_ROOM_HORIZON_DAYS = {MAX_ROOM_HORIZON_DAYS}</code>,{" "}
                <code>PA_ROOM_HORIZON_DAYS = {PA_ROOM_HORIZON_DAYS}</code>.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
