"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ADMIN_NAV_ITEMS } from "@/components/admin/sidebar";

export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-primary/10 bg-chrome lg:hidden">
      {ADMIN_NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex-1 py-3 text-center text-[11px] font-semibold",
              active ? "text-primary" : "text-muted"
            )}
          >
            {item.shortLabel}
          </Link>
        );
      })}
    </nav>
  );
}
