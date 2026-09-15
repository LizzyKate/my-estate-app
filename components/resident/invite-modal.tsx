"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/segmented";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import type { Category, Pass } from "@/lib/types";

const CATEGORIES: { value: Category; label: string; sub: string }[] = [
  { value: "VISITOR", label: "Visitor", sub: "GUEST" },
  { value: "DELIVERY", label: "Delivery", sub: "RIDER / COURIER" },
  { value: "SERVICE", label: "Service", sub: "TECHNICIAN" },
];

const WINDOWS = [
  { value: "14:00–18:00", label: "14:00–18:00" },
  { value: "18:00–22:00", label: "18:00–22:00" },
  { value: "ANY TIME", label: "Any time" },
];

export function InviteModal({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (pass: Pass) => void;
}) {
  const createPass = useStore((s) => s.createPass);
  const [cat, setCat] = useState<Category>("VISITOR");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [windowVal, setWindowVal] = useState<(typeof WINDOWS)[number]["value"] | "">("");
  const [plate, setPlate] = useState("");
  const [groupPass, setGroupPass] = useState(false);
  const [repeatWeekly, setRepeatWeekly] = useState(false);

  const canSubmit = name.trim().length > 1 && phone.trim().length > 6 && windowVal;

  function reset() {
    setCat("VISITOR");
    setName("");
    setPhone("");
    setWindowVal("");
    setPlate("");
    setGroupPass(false);
    setRepeatWeekly(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    const pass = createPass({
      name,
      cat,
      phone,
      window: windowVal,
      plate,
      groupPass,
      repeatWeekly,
    });
    reset();
    onOpenChange(false);
    onCreated(pass);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} width={720} title="Invite a visitor">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <h2 className="text-[22px] font-bold text-text">Invite a visitor</h2>

        <div className="grid grid-cols-3 gap-3">
          {CATEGORIES.map((c) => {
            const active = c.value === cat;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => setCat(c.value)}
                className={cn(
                  "flex h-[64px] flex-col items-center justify-center gap-1 rounded-field border",
                  active
                    ? "border-primary bg-primary text-primary-ink"
                    : "border-primary/12 bg-sunken text-muted"
                )}
              >
                <span className="text-[14px] font-bold">{c.label}</span>
                <span className="font-mono text-[9.5px] tracking-[0.1em]">
                  {c.sub}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Visitor name">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
          </Field>
          <Field label="Phone">
            <Input mono value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="080X XXX XXXX" />
          </Field>
          <Field label="Date">
            <Input value="Today" disabled className="text-muted" />
          </Field>
          <Field label="Vehicle (optional)">
            <Input mono value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="Plate number" />
          </Field>
        </div>

        <Field label="Arrival window">
          <SegmentedControl
            options={WINDOWS}
            value={windowVal || WINDOWS[0].value}
            onChange={(v) => setWindowVal(v)}
          />
        </Field>

        <div className="flex flex-col gap-2.5">
          <Toggle
            checked={groupPass}
            onChange={setGroupPass}
            label="Group pass"
            hint="ONE CODE COVERS EVERYONE IN THE PARTY"
          />
          <Toggle
            checked={repeatWeekly}
            onChange={setRepeatWeekly}
            label="Repeat weekly"
            hint="FOR THE REGULAR GENERATOR TECHNICIAN, CLEANER, ETC."
          />
        </div>

        <p className="font-mono text-[11px] leading-relaxed text-faint">
          A 6-digit code is generated and sent by SMS. You can revoke it any
          time.
        </p>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="ghost"
            size="default"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" size="default" className="flex-1" disabled={!canSubmit}>
            Create pass
          </Button>
        </div>
      </form>
    </Modal>
  );
}
