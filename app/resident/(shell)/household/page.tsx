"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/segmented";
import { InitialsTile } from "@/components/ui/initials-tile";
import { useStore } from "@/lib/store";
import type { ResidencyType } from "@/lib/types";

export default function ResidentHouseholdPage() {
  const household = useStore((s) => s.household);
  const addHouseholdMember = useStore((s) => s.addHouseholdMember);

  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [residency, setResidency] = useState<ResidencyType>("Permanent");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !relationship.trim()) return;
    addHouseholdMember(name, relationship, residency);
    setName("");
    setRelationship("");
  }

  return (
    <div className="max-w-2xl space-y-[18px]">
      <div>
        <h1 className="text-[24px] font-bold text-text">My household</h1>
        <p className="mt-1 text-[13.5px] text-muted">
          Everyone here can sign in as your household and let their own
          visitors in.
        </p>
      </div>

      <Card className="divide-y divide-primary/7 p-0">
        {household.map((member) => (
          <div key={member.id} className="flex items-center gap-3 p-4">
            <InitialsTile name={member.name} size={34} />
            <div>
              <p className="text-[13.5px] font-semibold text-text">
                {member.name}
              </p>
              <p className="font-mono text-[10.5px] text-faint">
                {member.relationship.toUpperCase()} · {member.residency.toUpperCase()}
              </p>
            </div>
          </div>
        ))}
      </Card>

      <Card className="p-5">
        <h2 className="mb-4 text-[14px] font-bold text-text">
          Add household member
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Full name">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
          </Field>
          <Field label="Relationship">
            <Input
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="e.g. Spouse, Son, House help"
            />
          </Field>
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
          <Button type="submit" className="self-start">
            Add member
          </Button>
        </form>
      </Card>
    </div>
  );
}
