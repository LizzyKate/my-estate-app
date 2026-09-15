"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { InitialsTile } from "@/components/ui/initials-tile";
import { formatClock } from "@/lib/format";
import { OFFICER } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

export function SecurityTopBar() {
  const router = useRouter();
  const [clock, setClock] = useState(formatClock());
  const startedAt = useStore((s) => s.officer.startedAt);
  const endShift = useStore((s) => s.endShift);

  useEffect(() => {
    const id = setInterval(() => setClock(formatClock()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="flex h-[62px] shrink-0 items-center gap-3 overflow-hidden border-b border-primary/10 bg-chrome px-3 sm:gap-4 sm:px-5">
      <Logo className="shrink-0" />
      <span className="hidden h-6 w-px shrink-0 bg-primary/12 md:block" />
      <span className="hidden shrink-0 truncate font-mono text-[11.5px] tracking-[0.08em] text-faint uppercase md:block">
        Gate console · {OFFICER.gate}
      </span>
      <Chip tone="green" dot className="hidden shrink-0 sm:inline-flex">
        Online
      </Chip>
      <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-4">
        <span className="tabular font-mono text-[13px] font-bold text-text sm:text-[15px]">
          {clock}
        </span>
        <div className="flex items-center gap-2">
          <InitialsTile name={OFFICER.name} size={28} />
          <div className="hidden sm:block">
            <p className="text-[12px] font-semibold text-text">{OFFICER.name}</p>
            <p className="font-mono text-[10px] text-faint">
              {OFFICER.id} · since {startedAt}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={() => {
            endShift();
            router.replace("/security/sign-in");
          }}
        >
          End
        </Button>
      </div>
    </header>
  );
}
