"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSecurityNavItems } from "@/hooks/use-security-nav-items";

export function SecurityMobileNav() {
  const pathname = usePathname();
  const items = useSecurityNavItems();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-primary/10 bg-chrome lg:hidden">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold",
              active ? "text-primary" : "text-muted"
            )}
          >
            {item.shortLabel}
            {!!item.count && (
              <span
                className={cn(
                  "absolute top-1.5 right-1/4 rounded-full px-1 font-mono text-[8.5px]",
                  item.amber ? "bg-amber text-amber-ink" : "bg-ghost text-faint"
                )}
              >
                {item.count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
