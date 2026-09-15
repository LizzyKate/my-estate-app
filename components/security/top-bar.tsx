"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { Chip } from "@/components/ui/chip";
import { InitialsTile } from "@/components/ui/initials-tile";
import { formatClock } from "@/lib/format";
import { OFFICER } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

export function SecurityTopBar() {
  const [clock, setClock] = useState(formatClock());
  const startedAt = useStore((s) => s.officer.startedAt);

  useEffect(() => {
    const id = setInterval(() => setClock(formatClock()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="flex h-[62px] shrink-0 items-center gap-4 border-b border-primary/10 bg-chrome px-5">
      <Logo />
      <span className="h-6 w-px bg-primary/12" />
      <span className="font-mono text-[11.5px] tracking-[0.08em] text-faint uppercase">
        Gate console · {OFFICER.gate}
      </span>
      <Chip tone="green" dot>
        Online
      </Chip>
      <div className="ml-auto flex items-center gap-4">
        <span className="tabular font-mono text-[15px] font-bold text-text">
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
      </div>
    </header>
  );
}
