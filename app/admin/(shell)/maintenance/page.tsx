"use client";

import { MaintenanceQueue } from "@/components/admin/maintenance-queue";
import { useStore } from "@/lib/store";

export default function AdminMaintenancePage() {
  const estateId = useStore((s) => s.admin.estateId);
  const allMaintenance = useStore((s) => s.maintenance);
  const maintenance = allMaintenance.filter((m) => m.estateId === estateId);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-text">Maintenance</h1>
        <p className="mt-1 text-[13.5px] text-muted">
          Flat queue, no workflows in Phase 0 — status only.
        </p>
      </div>
      <MaintenanceQueue items={maintenance} />
    </div>
  );
}
