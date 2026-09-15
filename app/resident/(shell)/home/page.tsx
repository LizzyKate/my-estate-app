"use client";

import { Card } from "@/components/ui/card";
import { AnnouncementStrip } from "@/components/resident/announcement-strip";
import { WalkupApprovalCard } from "@/components/resident/walkup-approval-card";
import { PassesTable } from "@/components/resident/passes-table";
import { HouseholdList } from "@/components/resident/household-list";
import { InviteFlow } from "@/components/resident/invite-flow";
import { useStore } from "@/lib/store";
import { useSignedInResident } from "@/hooks/use-signed-in-resident";
import { formatClock, formatDay, getGreeting } from "@/lib/format";

export default function ResidentHomePage() {
  const estateId = useStore((s) => s.resident.estateId);
  const residentId = useStore((s) => s.resident.residentId);
  const allPasses = useStore((s) => s.passes);
  const allHousehold = useStore((s) => s.household);
  const allMaintenance = useStore((s) => s.maintenance);
  const allAnnouncements = useStore((s) => s.announcements);
  const allWalkups = useStore((s) => s.walkups);
  const me = useSignedInResident();

  const mine = allPasses.filter(
    (p) => p.estateId === estateId && p.residentId === residentId
  );
  const household = allHousehold.filter(
    (h) => h.estateId === estateId && h.residentId === residentId
  );
  const announcements = allAnnouncements.filter(
    (a) => a.estateId === estateId && a.status === "published"
  );
  const waiting = mine.filter((p) => p.status === "waiting").length;
  const onsite = mine.filter((p) => p.status === "onsite").length;
  const openIssue = allMaintenance.find(
    (m) => m.estateId === estateId && m.house === me?.house && m.status !== "RESOLVED"
  );
  const pendingWalkup = allWalkups.find(
    (w) => w.estateId === estateId && w.status === "pending" && w.house === me?.house
  );

  if (!me) return null;

  return (
    <div className="flex flex-col gap-[18px] lg:flex-row lg:items-start">
      <div className="min-w-0 flex-1 space-y-[18px]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[27px] leading-[1.2] font-bold text-text">
              {getGreeting()}, {me.name.split(" ")[0]}
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
          <HouseholdList members={household} isPrimary={me.isPrimary} />
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
