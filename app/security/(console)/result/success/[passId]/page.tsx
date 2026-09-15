"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MonoLabel } from "@/components/ui/mono-label";
import { useCountdown } from "@/hooks/use-countdown";
import { useOnDutyOfficer } from "@/hooks/use-on-duty-officer";
import { useStore } from "@/lib/store";

export default function ResultSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ passId: string }>;
  searchParams: Promise<{ view?: string }>;
}) {
  const { passId } = use(params);
  const { view } = use(searchParams);
  const router = useRouter();
  const estateId = useStore((s) => s.deviceAuth.estateId);
  const allPasses = useStore((s) => s.passes);
  const pass = allPasses.find((p) => String(p.id) === passId && p.estateId === estateId);
  const officer = useOnDutyOfficer();

  const { label } = useCountdown(8, () => {
    if (!view) router.push("/security/gate");
  });

  if (!pass) return null;

  return (
    <div className="mx-auto max-w-[520px] pt-8 text-center">
      <div
        className="rounded-card border border-green/30 p-9"
        style={{
          background:
            "radial-gradient(120% 70% at 50% 0%, #10241C 0%, #0D131F 60%)",
        }}
      >
        <div className="mx-auto flex size-[62px] items-center justify-center rounded-full bg-green text-[26px] text-green-ink">
          ✓
        </div>
        <h1 className="mt-5 text-[30px] font-bold text-text">
          {pass.name.split(" ")[0]} is in.
        </h1>
        <p className="mt-2 text-[13.5px] text-muted">
          Checked in by {officer?.id} {officer?.name}. {pass.host} has been
          notified.
        </p>

        <div className="mt-6 flex justify-center gap-8">
          <div>
            <MonoLabel>Code</MonoLabel>
            <p className="mt-1 font-mono text-[15px] font-bold text-text">
              {pass.code} · now spent
            </p>
          </div>
          <div>
            <MonoLabel>Expected out</MonoLabel>
            <p className="mt-1 font-mono text-[15px] font-bold text-text">
              {pass.window.split("–")[1] ?? pass.window}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-3">
        <Button size="lg" className="w-full" onClick={() => router.push("/security/gate")}>
          Next visitor {!view && `(${label})`}
        </Button>
        <button
          type="button"
          className="text-[12.5px] font-semibold text-muted hover:text-text"
        >
          Print gate slip
        </button>
      </div>
    </div>
  );
}
