"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { MonoLabel } from "@/components/ui/mono-label";
import { SegmentedControl } from "@/components/ui/segmented";
import { InitialsTile } from "@/components/ui/initials-tile";
import { useStore } from "@/lib/store";
import { useSignedInResident } from "@/hooks/use-signed-in-resident";
import { useResidentEstate } from "@/hooks/use-current-estate";
import type { ResidencyType } from "@/lib/types";

export default function ResidentHouseholdPage() {
  const estateId = useStore((s) => s.resident.estateId);
  const residentId = useStore((s) => s.resident.residentId);
  const allHousehold = useStore((s) => s.household);
  const household = allHousehold.filter(
    (h) => h.estateId === estateId && h.residentId === residentId
  );
  const addHouseholdMember = useStore((s) => s.addHouseholdMember);
  const removeHouseholdMember = useStore((s) => s.removeHouseholdMember);
  const me = useSignedInResident();
  const estate = useResidentEstate();
  const isPrimary = me?.isPrimary ?? false;

  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [phone, setPhone] = useState("");
  const [residency, setResidency] = useState<ResidencyType>("Permanent");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !relationship.trim() || !phone.trim()) return;
    addHouseholdMember(name, relationship, residency, phone);
    setName("");
    setRelationship("");
    setPhone("");
  }

  return (
    <div className="max-w-2xl space-y-[18px]">
      <div>
        <h1 className="text-[24px] font-bold text-text">My household</h1>
        <p className="mt-1 text-[13.5px] text-muted">
          Everyone here can sign in with their own phone number and let
          their own visitors in.
        </p>
      </div>

      {isPrimary && estate && <ResidentLinkCard slug={estate.slug} />}

      <Card className="divide-y divide-primary/7 p-0">
        {household.length === 0 && (
          <p className="p-4 text-[13px] text-muted">
            No household members added yet.
          </p>
        )}
        {household.map((member) => (
          <div key={member.id} className="flex items-center gap-3 p-4">
            <InitialsTile name={member.name} size={34} />
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-semibold text-text">
                {member.name}
              </p>
              <p className="font-mono text-[10.5px] text-faint">
                {member.relationship.toUpperCase()} · {member.residency.toUpperCase()} · {member.phone}
              </p>
            </div>
            {isPrimary && (
              <Button
                variant="danger"
                size="sm"
                className="shrink-0"
                onClick={() => removeHouseholdMember(member.id)}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
      </Card>

      {isPrimary ? (
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
            <Field label="Mobile number — becomes their login">
              <Input
                mono
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 80X XXX XXXX"
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
      ) : (
        <p className="font-mono text-[10.5px] leading-relaxed text-faint">
          Only the primary resident can add or remove household members.
        </p>
      )}
    </div>
  );
}

function ResidentLinkCard({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const link =
    typeof window !== "undefined"
      ? `${window.location.origin}/resident/sign-in?estate=${slug}`
      : "";

  function copyLink() {
    navigator.clipboard?.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-[13.5px] font-bold text-text">Household sign-in link</p>
        <p className="mt-0.5 text-[12.5px] text-muted">
          Send this to a household member after adding them — they sign in
          with their own phone number, no separate account needed.
        </p>
        <MonoLabel className="mt-2 block truncate">{link}</MonoLabel>
      </div>
      <Button variant="ghost" size="sm" className="shrink-0" onClick={copyLink}>
        {copied ? "Copied" : "Copy link"}
      </Button>
    </Card>
  );
}
