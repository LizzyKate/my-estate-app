"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Placeholder } from "@/components/ui/placeholder";
import { MonoLabel } from "@/components/ui/mono-label";
import { Chip } from "@/components/ui/chip";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { SIGNED_IN_RESIDENT } from "@/lib/mock-data";
import type { Walkup, WalkupStatus } from "@/lib/types";

export default function WalkupPage() {
  const router = useRouter();
  const walkup = useStore((s) => s.walkup);
  const walkupHistory = useStore((s) => s.walkupHistory);
  const logWalkup = useStore((s) => s.logWalkup);
  const dismissWalkup = useStore((s) => s.dismissWalkup);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [house, setHouse] = useState(SIGNED_IN_RESIDENT.house);
  const [reason, setReason] = useState("");

  const canSubmit = name.trim() && phone.trim() && house.trim() && reason.trim();

  function handlePing(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    logWalkup({ name, phone, house, reason });
    setName("");
    setPhone("");
    setReason("");
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
      <Card className="h-fit max-w-[520px] p-6">
        <h1 className="mb-1 text-[20px] font-bold text-text">
          Log a walk-up
        </h1>
        <p className="mb-5 text-[13px] text-muted">
          No pass — ping the household directly.
        </p>
        <form onSubmit={handlePing} className="flex flex-col gap-4">
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Visitor's name" />
          </Field>
          <Field label="Phone">
            <Input mono value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="080X XXX XXXX" />
          </Field>
          <Field label="House" hint="This is what drives the ping.">
            <Input mono value={house} onChange={(e) => setHouse(e.target.value)} placeholder="e.g. 14B" />
          </Field>
          <Field label="Reason given">
            <Textarea rows={2} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why they're here" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Placeholder caption="Capture face" className="h-20" />
            <Placeholder caption="ID / plate" className="h-20" />
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => router.push("/security/gate")}>
              Back
            </Button>
            <Button
              type="submit"
              variant="amber"
              size="lg"
              className="flex-[2]"
              disabled={!canSubmit}
            >
              Ping household {house}
            </Button>
          </div>
        </form>
      </Card>

      <div className="space-y-4 rounded-card bg-chrome p-5">
        <MonoLabel>
          Awaiting approval · {walkup?.status === "pending" ? 1 : 0}
        </MonoLabel>

        {walkup ? (
          <PendingWalkupCard walkup={walkup} onDismiss={dismissWalkup} />
        ) : (
          <div className="rounded-card border border-dashed border-primary/16 p-6 text-center text-[12.5px] text-faint">
            No walk-up in progress.
          </div>
        )}

        {walkupHistory.length > 0 && (
          <div>
            <MonoLabel className="mb-2 block">Earlier this shift</MonoLabel>
            <div className="space-y-2">
              {walkupHistory.map((w) => (
                <div
                  key={w.id}
                  className="flex items-center justify-between rounded-field border border-primary/10 bg-surface px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[12.5px] font-semibold text-text">
                      {w.name}
                    </p>
                    <p className="font-mono text-[10px] text-faint">
                      House {w.house} · {w.resolvedAt}
                    </p>
                  </div>
                  <Chip tone={w.status === "approved" ? "green" : "red"}>
                    {w.status}
                  </Chip>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const STEP_LABELS = ["Push sent", "WhatsApp fallback delivered", "Seen / decided"];

function stepTone(step: number, status: WalkupStatus): "green" | "amber" | "red" | "neutral" {
  if (step === 0) return "green";
  if (step === 1) return status === "pending" ? "amber" : "green";
  if (status === "pending") return "neutral";
  return status === "approved" ? "green" : "red";
}

const INSTRUCTION: Record<WalkupStatus, { tone: "amber" | "green" | "red"; text: string }> = {
  pending: { tone: "amber", text: "Hold at the gate until the household responds." },
  approved: { tone: "green", text: "Approved — let them in." },
  denied: { tone: "red", text: "Declined — turn them away." },
};

function PendingWalkupCard({
  walkup,
  onDismiss,
}: {
  walkup: Walkup;
  onDismiss: () => void;
}) {
  const instruction = INSTRUCTION[walkup.status];

  return (
    <div className="rounded-card border border-amber/32 bg-surface p-4">
      <p className="text-[20px] font-bold text-text">{walkup.name}</p>
      <p className="mt-1 font-mono text-[10.5px] text-faint">
        {walkup.phone} · House {walkup.house} · {walkup.reason}
      </p>
      {walkup.status === "pending" && (
        <p className="mt-2 font-mono text-[11px] text-amber">4:52 until auto-decline</p>
      )}

      <div className="mt-4 flex flex-col gap-2.5">
        {STEP_LABELS.map((label, i) => {
          const tone = stepTone(i, walkup.status);
          return (
            <div key={label} className="flex items-center gap-2.5">
              <span
                className={cn(
                  "size-2 rounded-full",
                  tone === "green" && "bg-green",
                  tone === "amber" && "bg-amber",
                  tone === "red" && "bg-red",
                  tone === "neutral" && "bg-subtle"
                )}
              />
              <span className="font-mono text-[10.5px] text-muted">{label}</span>
            </div>
          );
        })}
      </div>

      <div
        className={cn(
          "mt-4 rounded-field border p-3 text-[12px] leading-relaxed",
          instruction.tone === "amber" && "border-amber/24 bg-amber/8 text-amber-text",
          instruction.tone === "green" && "border-green/30 bg-green/10 text-green",
          instruction.tone === "red" && "border-red/32 bg-red/10 text-red"
        )}
      >
        {instruction.text}
      </div>

      {walkup.status !== "pending" && (
        <Button variant="ghost" size="sm" className="mt-3 w-full" onClick={onDismiss}>
          Dismiss
        </Button>
      )}
    </div>
  );
}
