"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { MonoLabel } from "@/components/ui/mono-label";
import { cn } from "@/lib/utils";
import { ESTATE_NAME, PILOT_DAY, PILOT_TOTAL_DAYS } from "@/lib/mock-data";

export const ADMIN_NAV_ITEMS = [
  { href: "/admin/residents", label: "Residents", shortLabel: "Residents" },
  { href: "/admin/gate", label: "Visitor log", shortLabel: "Log" },
  { href: "/admin/announcements", label: "Announcements", shortLabel: "Notices" },
  { href: "/admin/maintenance", label: "Maintenance", shortLabel: "Maint." },
  { href: "/admin/officers", label: "Security officers", shortLabel: "Officers" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const pct = Math.round((PILOT_DAY / PILOT_TOTAL_DAYS) * 100);

  return (
    <aside className="hidden w-[228px] shrink-0 flex-col gap-7 border-r border-primary/10 bg-chrome p-6 lg:flex">
      <Logo />

      <div className="rounded-card border border-primary/10 bg-surface p-3.5">
        <p className="text-[14px] font-bold text-text">{ESTATE_NAME}</p>
        <MonoLabel className="mt-0.5">ESTATE ADMIN</MonoLabel>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {ADMIN_NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-[10px] px-3 py-2.5 text-[13px] transition-colors",
                active
                  ? "bg-primary/14 font-bold text-primary"
                  : "font-medium text-muted hover:text-text"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-card border border-primary/10 bg-surface p-3.5">
        <MonoLabel>
          Pilot · Day {PILOT_DAY} of {PILOT_TOTAL_DAYS}
        </MonoLabel>
        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-ghost">
          <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </aside>
  );
}
