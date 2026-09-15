"use client";

import { Card } from "@/components/ui/card";
import { AnnouncementStrip } from "@/components/resident/announcement-strip";
import { WalkupApprovalCard } from "@/components/resident/walkup-approval-card";
import { PassesTable } from "@/components/resident/passes-table";
import { HouseholdList } from "@/components/resident/household-list";
import { InviteFlow } from "@/components/resident/invite-flow";
import { useStore } from "@/lib/store";
import { SIGNED_IN_RESIDENT } from "@/lib/mock-data";
import { formatClock, formatDay, getGreeting } from "@/lib/format";

export default function ResidentHomePage() {
  const passes = useStore((s) => s.passes);
  const household = useStore((s) => s.household);
  const maintenance = useStore((s) => s.maintenance);
  const announcements = useStore((s) => s.announcements);
  const walkup = useStore((s) => s.walkup);

  const mine = passes.filter((p) => p.mine);
  const waiting = mine.filter((p) => p.status === "waiting").length;
  const onsite = mine.filter((p) => p.status === "onsite").length;
  const openIssue = maintenance.find((m) => m.resident === SIGNED_IN_RESIDENT.name && m.status !== "RESOLVED");
  const pendingWalkup = walkup && walkup.status === "pending" && walkup.house === SIGNED_IN_RESIDENT.house ? walkup : null;

  return (
    <div className="flex flex-col gap-[18px] lg:flex-row lg:items-start">
      <div className="min-w-0 flex-1 space-y-[18px]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[27px] leading-[1.2] font-bold text-text">
              {getGreeting()}, {SIGNED_IN_RESIDENT.name.split(" ")[0]}
            </h1>
            <p className="mt-1 font-mono text-[12px] text-faint">
              {formatDay()} · {formatClock()} · {waiting} waiting · {onsite} on site
            </p>
          </div>
          <InviteFlow />
        </div>

        {announcements[0] && <AnnouncementStrip announcement={announcements[0]} />}

        {pendingWalkup && <WalkupApprovalCard walkup={pendingWalkup} />}

        <PassesTable passes={mine} title="My passes today" />
      </div>

      <div className="w-full space-y-4 lg:w-[312px] lg:shrink-0">
        <Card className="p-4">
          <h3 className="mb-3.5 text-[13px] font-bold text-text">My household</h3>
          <HouseholdList members={household} />
        </Card>

        {openIssue && (
          <Card className="p-4">
            <h3 className="mb-2 text-[13px] font-bold text-text">Open maintenance issue</h3>
            <p className="text-[13px] text-text">{openIssue.title}</p>
            <p className="mt-1 font-mono text-[10.5px] text-faint">
              {openIssue.category} · {openIssue.loggedAt} · {openIssue.status}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
