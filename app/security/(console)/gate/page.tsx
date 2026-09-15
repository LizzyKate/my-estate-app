"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CodeReadout } from "@/components/ui/code-boxes";
import { NumericKeypad } from "@/components/ui/keypad";
import { StatTile } from "@/components/ui/stat-tile";
import { useStore } from "@/lib/store";

export default function GateCheckPage() {
  const router = useRouter();
  const submitCode = useStore((s) => s.submitCode);
  const passes = useStore((s) => s.passes);
  const walkup = useStore((s) => s.walkup);
  const [code, setCode] = useState("");

  const waiting = passes.filter((p) => p.status === "waiting").length;
  const onsite = passes.filter((p) => p.status === "onsite").length;

  function handleSubmit() {
    if (code.length !== 6) return;
    const { pass } = submitCode(code);
    if (pass) {
      router.push(`/security/verify/${pass.id}`);
    } else {
      router.push(`/security/result/denied?code=${code}`);
    }
    setCode("");
  }

  return (
    <div className="mx-auto flex max-w-[560px] flex-col items-center gap-8 pt-10 text-center">
      <div>
        <h1 className="text-[26px] font-bold text-text">Who is at the gate?</h1>
        <p className="mt-2 text-[13.5px] leading-[1.6] text-muted">
          Enter the 6-digit code the visitor was given, or log a walk-up if
          they don&rsquo;t have one.
        </p>
      </div>

      <CodeReadout value={code} />

      <NumericKeypad
        className="w-full max-w-[340px]"
        onDigit={(d) => setCode((c) => (c.length < 6 ? c + d : c))}
        onBackspace={() => setCode((c) => c.slice(0, -1))}
        onEnter={handleSubmit}
      />

      <div className="grid w-full grid-cols-1 gap-3">
        <Button size="xl" className="w-full" disabled={code.length !== 6} onClick={handleSubmit}>
          Check this code
        </Button>
        <Button
          variant="amber-ghost"
          size="lg"
          className="w-full"
          onClick={() => router.push("/security/walkup")}
        >
          No code — log walk-up
        </Button>
      </div>

      <div className="grid w-full grid-cols-3 gap-3">
        <StatTile label="Expected today" value={waiting} />
        <StatTile label="On site now" value={onsite} accent="green" />
        <StatTile
          label="Awaiting resident"
          value={walkup?.status === "pending" ? 1 : 0}
          accent={walkup?.status === "pending" ? "amber" : undefined}
        />
      </div>
    </div>
  );
}
