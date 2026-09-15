"use client";

import { useState } from "react";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Field, Input, inputClasses } from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/segmented";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import type { ResidencyType, Resident } from "@/lib/types";

export function AddResidentDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const addResident = useStore((s) => s.addResident);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [house, setHouse] = useState("");
  const [role, setRole] = useState<Resident["role"]>("Head of household");
  const [residency, setResidency] = useState<ResidencyType>("Permanent");

  const canSubmit = name.trim() && phone.trim() && house.trim();

  function submit(keepOpen: boolean) {
    if (!canSubmit) return;
    addResident({ name, house, phone, role, residency });
    setName("");
    setPhone("");
    setHouse("");
    if (!keepOpen) onOpenChange(false);
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} title="Add resident">
      <div className="flex flex-1 flex-col gap-4">
        <Field label="Full name">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
        </Field>

        <Field label="Phone — becomes their login">
          <Input
            mono
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+234 80X XXX XXXX"
            className="border-[1.5px] border-primary"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="House">
            <Input mono value={house} onChange={(e) => setHouse(e.target.value)} placeholder="e.g. 14B" />
          </Field>
          <Field label="Role">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Resident["role"])}
              className={cn(inputClasses, "appearance-none")}
            >
              <option>Head of household</option>
              <option>Household member</option>
            </select>
          </Field>
        </div>

        <Field label="Residency">
          <SegmentedControl
            options={[
              { value: "Permanent" as ResidencyType, label: "Permanent" },
              { value: "Temporary" as ResidencyType, label: "Temporary" },
            ]}
            value={residency}
            onChange={setResidency}
            mono={false}
          />
        </Field>

        <div className="rounded-field border border-primary/12 bg-surface p-3.5 text-[12px] leading-relaxed text-muted">
          They can sign in with this number only — no self-serve signup
          exists. Registering here is the only way an account is created.
        </div>
      </div>

      <div className="flex flex-col gap-2.5 border-t border-primary/10 pt-4">
        <Button disabled={!canSubmit} onClick={() => submit(false)}>
          Register resident
        </Button>
        <Button variant="ghost" disabled={!canSubmit} onClick={() => submit(true)}>
          Save & add another
        </Button>
      </div>
    </Drawer>
  );
}
