import Link from "next/link";
import { InitialsTile } from "@/components/ui/initials-tile";
import type { HouseholdMember } from "@/lib/types";

export function HouseholdList({ members }: { members: HouseholdMember[] }) {
  return (
    <div className="flex flex-col gap-3.5">
      {members.map((member) => (
        <div key={member.id} className="flex items-center gap-2.5">
          <InitialsTile name={member.name} size={30} />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-text">
              {member.name}
            </p>
            <p className="font-mono text-[10.5px] text-faint">
              {member.relationship.toUpperCase()} · {member.residency.toUpperCase()}
            </p>
          </div>
        </div>
      ))}
      <Link
        href="/resident/household"
        className="rounded-field border border-primary/12 bg-ghost px-3 py-2.5 text-center text-[12.5px] font-semibold text-muted hover:text-text"
      >
        + Add household member
      </Link>
    </div>
  );
}
