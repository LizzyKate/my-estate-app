"use client";

import { Button } from "@/components/ui/button";
import { Placeholder } from "@/components/ui/placeholder";
import { MonoLabel } from "@/components/ui/mono-label";
import type { Walkup } from "@/lib/types";
import { useStore } from "@/lib/store";

export function WalkupApprovalCard({ walkup }: { walkup: Walkup }) {
  const resolveWalkup = useStore((s) => s.resolveWalkup);

  return (
    <div className="flex gap-4 rounded-card border border-amber/34 bg-surface p-4">
      <Placeholder caption="Gate photo" className="h-[76px] w-16 shrink-0" />
      <div className="min-w-0 flex-1">
        <MonoLabel className="text-amber-text">
          Someone is at the main gate
        </MonoLabel>
        <p className="mt-1 text-[19px] font-bold text-text">{walkup.name}</p>
        <p className="mt-1 truncate font-mono text-[11.5px] text-faint">
          {walkup.phone} · {walkup.reason} · House {walkup.house} ·{" "}
          {walkup.officerId}
        </p>
        <div className="mt-3 flex gap-2.5">
          <Button
            variant="success"
            size="lg"
            className="h-12 flex-1"
            onClick={() => resolveWalkup("approved")}
          >
            Let them in
          </Button>
          <Button
            variant="danger"
            size="lg"
            className="h-12 flex-1"
            onClick={() => resolveWalkup("denied")}
          >
            Turn away
          </Button>
        </div>
      </div>
    </div>
  );
}
