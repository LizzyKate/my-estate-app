"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { InitialsTile, categoryTintText } from "@/components/ui/initials-tile";
import { EmptyRow, TableHeaderRow, TableRow, TableShell } from "@/components/ui/table";
import { useStore } from "@/lib/store";
import type { Pass } from "@/lib/types";

const COLUMNS = "1.5fr 1fr .9fr .9fr 120px";

export function PassListTable({
  passes,
  action,
  emptyLabel,
}: {
  passes: Pass[];
  action: "verify" | "checkout" | "view";
  emptyLabel: string;
}) {
  const router = useRouter();
  const checkOutPass = useStore((s) => s.checkOutPass);

  return (
    <TableShell>
      <TableHeaderRow columns={COLUMNS}>
        <span>Visitor</span>
        <span>Host · house</span>
        <span>Code</span>
        <span>Window</span>
        <span />
      </TableHeaderRow>
      {passes.length === 0 && <EmptyRow>{emptyLabel}</EmptyRow>}
      {passes.map((pass) => (
        <TableRow key={pass.id} columns={COLUMNS}>
          <div className="flex items-center gap-3">
            <InitialsTile name={pass.name} category={pass.cat} />
            <div className="min-w-0">
              <p className="truncate text-[13.5px] font-bold text-text">
                {pass.name}
              </p>
              <p className={`font-mono text-[11px] ${categoryTintText[pass.cat]}`}>
                {pass.cat}
              </p>
            </div>
          </div>
          <span className="truncate text-[13px] text-muted">
            {pass.host} · {pass.house}
          </span>
          <span className="font-mono text-[13px] font-bold text-text">
            {pass.code}
          </span>
          <span className="font-mono text-[12px] text-muted">{pass.window}</span>
          <div className="justify-self-end">
            {action === "verify" && (
              <Button size="sm" onClick={() => router.push(`/security/verify/${pass.id}`)}>
                Verify
              </Button>
            )}
            {action === "checkout" && (
              <Button variant="ghost" size="sm" onClick={() => checkOutPass(pass.id)}>
                Check out
              </Button>
            )}
            {action === "view" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/security/result/success/${pass.id}?view=1`)}
              >
                View
              </Button>
            )}
          </div>
        </TableRow>
      ))}
    </TableShell>
  );
}
