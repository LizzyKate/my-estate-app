import * as React from "react";
import { cn } from "@/lib/utils";

export function TableShell({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-card border border-primary/10 bg-sunken",
        className
      )}
    >
      {children}
    </div>
  );
}

export function TableHeaderRow({
  columns,
  children,
}: {
  columns: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{ gridTemplateColumns: columns }}
      className="grid gap-3.5 border-b border-primary/7 px-[18px] py-2.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-faint"
    >
      {children}
    </div>
  );
}

export function TableRow({
  columns,
  className,
  children,
}: {
  columns: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{ gridTemplateColumns: columns }}
      className={cn(
        "grid items-center gap-3.5 border-b border-primary/7 px-[18px] py-[15px] text-[13.5px] last:border-b-0",
        className
      )}
    >
      {children}
    </div>
  );
}

export function EmptyRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-[18px] py-10 text-center text-[13.5px] text-muted">
      {children}
    </div>
  );
}
