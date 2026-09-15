"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PassListTable } from "@/components/security/pass-list-table";
import { useStore } from "@/lib/store";

export default function OnSiteNowPage() {
  const router = useRouter();
  const allPasses = useStore((s) => s.passes);
  const passes = allPasses.filter((p) => p.status === "onsite");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-text">On site now</h1>
          <p className="mt-1 font-mono text-[11px] text-faint">
            {passes.length} on site
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => router.push("/security/gate")}>
          Back to code entry
        </Button>
      </div>
      <PassListTable passes={passes} action="checkout" emptyLabel="No one on site right now." />
    </div>
  );
}
