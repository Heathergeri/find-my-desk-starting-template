import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, Mail, KeyRound, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

type Method = "email" | "sms" | "authenticator";

function LoginPage() {
  const navigate = useNavigate();
  const [method, setMethod] = useState<Method>("authenticator");
  const [code, setCode] = useState("");
  const valid = /^\d{6}$/.test(code);

  return (
    <div className="min-h-screen grid place-items-center bg-[var(--color-canvas)] px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="mb-6 flex items-center gap-2">
          <span
            className="inline-block h-7 w-7 rounded-[var(--radius-sm)]"
            style={{ background: "var(--color-primary)" }}
            aria-hidden
          />
          <span className="font-display text-xl font-semibold">
            Spaces<span className="text-[var(--color-primary)]">@LBG</span>
          </span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>
              Use your Lloyds SSO. We'll send a 2FA code as a fallback.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button size="lg" className="w-full">
              <ShieldCheck className="h-4 w-4" aria-hidden />
              Continue with Lloyds SSO
            </Button>

            <div className="relative my-2 text-center text-xs uppercase tracking-wider text-[var(--color-fg-muted)]">
              <span className="bg-[var(--color-surface)] relative z-10 px-2">or 2FA fallback</span>
              <span className="absolute left-0 right-0 top-1/2 h-px bg-[var(--color-border)]" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <MethodPick
                active={method === "authenticator"}
                onClick={() => setMethod("authenticator")}
                icon={<KeyRound className="h-4 w-4" />}
                label="Authenticator"
              />
              <MethodPick
                active={method === "sms"}
                onClick={() => setMethod("sms")}
                icon={<Smartphone className="h-4 w-4" />}
                label="SMS"
              />
              <MethodPick
                active={method === "email"}
                onClick={() => setMethod("email")}
                icon={<Mail className="h-4 w-4" />}
                label="Email"
              />
            </div>

            <label className="grid gap-1.5">
              <span className="text-sm font-medium">6-digit code</span>
              <input
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-lg font-mono tracking-[0.4em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
              />
            </label>

            <Button
              size="lg"
              disabled={!valid}
              onClick={() => navigate({ to: "/" })}
            >
              Verify and continue
            </Button>

            <p className="text-xs text-center text-[var(--color-fg-muted)]">
              Demo: any 6-digit code works.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function MethodPick({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border px-2 py-3 text-xs transition-colors",
        active
          ? "bg-[var(--color-primary)] text-[var(--color-primary-fg)] border-[var(--color-primary)]"
          : "bg-[var(--color-surface-2)] border-[var(--color-border)] hover:border-[var(--color-border-strong)]",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
