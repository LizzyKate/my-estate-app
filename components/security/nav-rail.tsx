"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { OFFICER } from "@/lib/mock-data";

export function SecurityNavRail() {
  const pathname = usePathname();
  const router = useRouter();
  const passes = useStore((s) => s.passes);
  const walkup = useStore((s) => s.walkup);
  const endShift = useStore((s) => s.endShift);

  const waiting = passes.filter((p) => p.status === "waiting").length;
  const onsite = passes.filter((p) => p.status === "onsite").length;
  const logged = passes.filter((p) => p.status === "out").length;
  const walkupPending = walkup?.status === "pending";

  const items = [
    { href: "/security/gate", label: "Gate check", count: null },
    { href: "/security/expected", label: "Expected today", count: waiting },
    { href: "/security/onsite", label: "On site now", count: onsite },
    {
      href: "/security/walkup",
      label: "Walk-ups",
      count: walkupPending ? 1 : 0,
      amber: walkupPending,
    },
    { href: "/security/log", label: "Today's log", count: logged },
  ];

  return (
    <aside className="flex w-[212px] shrink-0 flex-col gap-1 border-r border-primary/10 bg-chrome p-4">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center justify-between rounded-[10px] px-3 py-2.5 text-[13px] transition-colors",
              active
                ? "bg-primary/14 font-bold text-primary"
                : "font-medium text-muted hover:text-text"
            )}
          >
            <span>{item.label}</span>
            {item.count !== null && (
              <span
                className={cn(
                  "font-mono text-[9.5px] font-bold",
                  item.amber ? "text-amber" : "text-faint"
                )}
              >
                {item.count}
              </span>
            )}
          </Link>
        );
      })}

      <div className="mt-auto flex flex-col gap-2.5 pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            endShift();
            router.replace("/security/sign-in");
          }}
        >
          End shift
        </Button>
        <p className="border-t border-dashed border-primary/16 pt-2.5 font-mono text-[9.5px] leading-relaxed text-faint">
          EVERY ACTION IS STAMPED {OFFICER.id}
        </p>
      </div>
    </aside>
  );
}
