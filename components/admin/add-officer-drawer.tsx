"use client";

import { useState } from "react";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { GATE_NAME } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

export function AddOfficerDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const addOfficer = useStore((s) => s.addOfficer);
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");

  const canSubmit = name.trim().length > 1 && /^\d{4}$/.test(pin);

  function submit(keepOpen: boolean) {
    if (!canSubmit) return;
    addOfficer({ name, gate: GATE_NAME, pin });
    setName("");
    setPin("");
    if (!keepOpen) onOpenChange(false);
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} title="Add security officer">
      <div className="flex flex-1 flex-col gap-4">
        <Field label="Full name">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
        </Field>

        <Field label="Gate">
          <Input value={GATE_NAME} disabled className="text-muted" />
        </Field>

        <Field label="4-digit PIN — becomes their shift login">
          <Input
            mono
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="e.g. 4471"
            className="border-[1.5px] border-primary tracking-[0.3em]"
          />
        </Field>

        <div className="rounded-field border border-primary/12 bg-surface p-3.5 text-[12px] leading-relaxed text-muted">
          They start a shift at the gate console with this PIN alone — no
          name or ID needed there. Registering here is the only way an
          officer account is created.
        </div>
      </div>

      <div className="flex flex-col gap-2.5 border-t border-primary/10 pt-4">
        <Button disabled={!canSubmit} onClick={() => submit(false)}>
          Register officer
        </Button>
        <Button variant="ghost" disabled={!canSubmit} onClick={() => submit(true)}>
          Save & add another
        </Button>
      </div>
    </Drawer>
  );
}
