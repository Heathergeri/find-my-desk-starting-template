import { Check, Sparkles } from "lucide-react";
import { AMENITIES, type AmenityId } from "@/lib/amenities";
import { cn } from "@/lib/cn";

type Props = {
  selected: AmenityId[];
  onToggle: (id: AmenityId) => void;
  userDefaults: AmenityId[];
  onApplyDefaults: () => void;
  onClear: () => void;
};

export function AmenityFilter({ selected, onToggle, userDefaults, onApplyDefaults, onClear }: Props) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-base font-semibold">Amenities</h3>
        <div className="flex items-center gap-2 text-xs">
          {userDefaults.length > 0 && (
            <button
              type="button"
              onClick={onApplyDefaults}
              className="inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-[var(--color-primary-soft)] text-[var(--color-primary-soft-fg)] px-2 py-1 font-medium hover:brightness-95"
            >
              <Sparkles className="h-3 w-3" aria-hidden />
              My needs
            </button>
          )}
          {selected.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
            >
              Clear
            </button>
          )}
        </div>
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {AMENITIES.map((a) => {
          const Icon = a.icon;
          const active = selected.includes(a.id);
          return (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => onToggle(a.id)}
                aria-pressed={active}
                title={a.description}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border px-2.5 py-1 text-xs transition-colors duration-[var(--duration-fast)]",
                  active
                    ? "bg-[var(--color-primary)] text-[var(--color-primary-fg)] border-[var(--color-primary)]"
                    : "bg-[var(--color-surface-2)] text-[var(--color-fg)] border-[var(--color-border)] hover:border-[var(--color-border-strong)]",
                )}
              >
                {active ? <Check className="h-3 w-3" aria-hidden /> : <Icon className="h-3 w-3" aria-hidden />}
                {a.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
