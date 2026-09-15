"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatClock } from "@/lib/format";
import { OFFICER } from "@/lib/mock-data";

export default function ResultDeniedPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code = "" } = use(searchParams);
  const router = useRouter();

  const spaced = code.split("").join(" ");

  return (
    <div className="mx-auto max-w-[520px] pt-8 text-center">
      <div className="rounded-card border border-red/32 bg-surface p-9">
        <div className="mx-auto flex size-[56px] items-center justify-center rounded-full bg-red/16 text-[22px] text-red">
          ✕
        </div>
        <h1 className="mt-5 text-[20px] font-bold text-red">
          No pass for {spaced}
        </h1>
        <p className="mt-2 font-mono text-[10.5px] text-faint">
          ATTEMPT LOGGED {formatClock()} · {OFFICER.gate.toUpperCase()} · {OFFICER.id}
        </p>

        <div className="mt-5 rounded-field border border-red/24 bg-red/8 p-3.5 text-left text-[12.5px] leading-relaxed text-red">
          This code doesn&rsquo;t match any active pass. It may have been
          mistyped, already used, expired, or the visitor was never invited.
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2.5">
        <Button variant="ghost" size="lg" onClick={() => router.push("/security/gate")}>
          Try the code again
        </Button>
        <Button variant="amber" size="lg" onClick={() => router.push("/security/walkup")}>
          Log as walk-up & ping household
        </Button>
        <Button variant="danger" size="lg" onClick={() => router.push("/security/gate")}>
          Turn away
        </Button>
      </div>

      <p className="mt-5 font-mono text-[10.5px] leading-relaxed text-faint">
        3 failed codes at one gate within 10 minutes flags the admin
        dashboard.
      </p>
    </div>
  );
}
