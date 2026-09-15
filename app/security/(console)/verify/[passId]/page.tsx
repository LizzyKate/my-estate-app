"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Placeholder } from "@/components/ui/placeholder";
import { MonoLabel } from "@/components/ui/mono-label";
import { useStore } from "@/lib/store";

export default function VerifyPage({
  params,
}: {
  params: Promise<{ passId: string }>;
}) {
  const { passId } = use(params);
  const router = useRouter();
  const estateId = useStore((s) => s.deviceAuth.estateId);
  const allPasses = useStore((s) => s.passes);
  const pass = allPasses.find((p) => String(p.id) === passId && p.estateId === estateId);
  const checkInPass = useStore((s) => s.checkInPass);

  useEffect(() => {
    if (!pass || pass.status !== "waiting") router.replace("/security/gate");
  }, [pass, router]);

  if (!pass || pass.status !== "waiting") return null;

  return (
    <div className="mx-auto max-w-[820px] space-y-5">
      <div className="flex items-center justify-between gap-4 rounded-field border border-green/32 bg-green/10 px-4 py-3.5">
        <div className="flex items-center gap-3">
          <span className="flex size-6 items-center justify-center rounded-full bg-green text-green-ink">
            ✓
          </span>
          <div>
            <p className="text-[14.5px] font-bold text-green">
              Code {pass.code} matches a pass for House {pass.house}
            </p>
            <p className="font-mono text-[10.5px] text-green/80">
              ISSUED {pass.issuedAt} · NOT YET USED
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => router.push("/security/gate")}
          className="font-mono text-[10.5px] font-bold tracking-[0.08em] text-green"
        >
          CLEAR & RE-ENTER
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-[260px_1fr]">
        <div className="flex flex-col gap-3">
          <Placeholder caption="Visitor photo" className="h-[280px] w-full" />
          <p className="font-mono text-[10.5px] leading-relaxed text-faint">
            Compare the face and plate against the pass before opening the
            gate.
          </p>
        </div>

        <div className="rounded-card bg-sunken p-6">
          <h1 className="text-[28px] font-bold text-text">{pass.name}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <Chip tone="primary">{pass.cat}</Chip>
            <Chip tone="green">Code valid</Chip>
            <Chip tone="neutral">Single use</Chip>
          </div>

          <p className="mt-5 font-mono text-[28px] font-bold text-primary">
            {pass.code}
          </p>
          <p className="font-mono text-[10.5px] text-faint">
            Expires at the end of {pass.window}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <FactTile label="Host household" value={`${pass.host} · ${pass.house}`} />
            <FactTile label="Host phone" value="080X XXX XXXX" />
            <FactTile label="Vehicle on pass" value={pass.plate || "—"} />
            <FactTile label="Arrival window" value={pass.window} />
          </div>

          <Button
            variant="success"
            size="xl"
            className="mt-6 w-full text-[16px]"
            onClick={() => {
              checkInPass(pass.id);
              router.push(`/security/result/success/${pass.id}`);
            }}
          >
            Check in — open the gate
          </Button>

          <div className="mt-3 grid grid-cols-3 gap-2.5">
            <Button variant="ghost" size="sm" className="h-10">
              Call host
            </Button>
            <Button variant="ghost" size="sm" className="h-10">
              Photo mismatch
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="h-10"
              onClick={() => router.push("/security/gate")}
            >
              Deny entry
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FactTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] bg-surface p-3">
      <MonoLabel>{label}</MonoLabel>
      <p className="mt-1 truncate text-[13px] font-semibold text-text">{value}</p>
    </div>
  );
}
