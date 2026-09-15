"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PassListTable } from "@/components/security/pass-list-table";
import { useStore } from "@/lib/store";

export default function TodaysLogPage() {
  const router = useRouter();
  const estateId = useStore((s) => s.deviceAuth.estateId);
  const allPasses = useStore((s) => s.passes);
  const passes = allPasses.filter((p) => p.estateId === estateId && p.status === "out");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-text">Today&rsquo;s log</h1>
          <p className="mt-1 font-mono text-[11px] text-faint">
            {passes.length} logged
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => router.push("/security/gate")}>
          Back to code entry
        </Button>
      </div>
      <PassListTable passes={passes} action="view" emptyLabel="Nothing logged yet." />
    </div>
  );
}
