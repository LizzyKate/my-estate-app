import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * `fr` tracks have an implicit `auto` minimum, so unwrappable content (long
 * text, a `whitespace-nowrap` cell) can force a track — and everything
 * above it up to the viewport — wider than intended. Wrapping every token
 * in `minmax(0, …)` removes that automatic minimum so columns actually
 * shrink and truncate instead of blowing out the page.
 */
function safeColumns(columns: string) {
  return columns
    .split(" ")
    .map((token) => `minmax(0, ${token})`)
    .join(" ");
}

export function TableShell({
  className,
  minWidth,
  children,
}: {
  className?: string;
  /** forces this width and lets the table scroll horizontally below it, for
   * column sets too dense to reflow (leave unset for simpler tables that
   * already fit a narrow screen) */
  minWidth?: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-card border border-primary/10 bg-sunken",
        className
      )}
    >
      <div className="overflow-x-auto">
        <div style={minWidth ? { minWidth } : undefined}>{children}</div>
      </div>
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
      style={{ gridTemplateColumns: safeColumns(columns) }}
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
      style={{ gridTemplateColumns: safeColumns(columns) }}
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
