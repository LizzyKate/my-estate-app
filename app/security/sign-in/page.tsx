"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { MonoLabel } from "@/components/ui/mono-label";
import { PinBoxes } from "@/components/ui/code-boxes";
import { NumericKeypad } from "@/components/ui/keypad";
import { OFFICER } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

export default function SecuritySignInPage() {
  const router = useRouter();
  const startShift = useStore((s) => s.startShift);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  function handleStart() {
    if (pin.length !== 4) return;
    if (startShift(pin)) {
      router.push("/security/gate");
    } else {
      setError(true);
      setPin("");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-6">
      <div className="w-full max-w-[520px] rounded-modal border border-primary/14 bg-sunken p-9">
        <Logo className="mb-8" />

        <MonoLabel>Gate & officer</MonoLabel>
        <p className="mt-2 mb-7 font-mono text-[15px] text-text">
          {OFFICER.gate.toUpperCase()} · {OFFICER.id} {OFFICER.name}
        </p>

        <MonoLabel>Officer PIN</MonoLabel>
        <div className="mt-2.5 mb-7">
          <PinBoxes value={pin} />
        </div>

        {error && (
          <p className="mb-4 text-[13px] font-medium text-red">
            That PIN doesn&rsquo;t match this officer. Try again.
          </p>
        )}

        <NumericKeypad
          className="mx-auto mb-7 w-fit"
          onDigit={(d) => {
            setError(false);
            setPin((p) => (p.length < 4 ? p + d : p));
          }}
          onBackspace={() => setPin((p) => p.slice(0, -1))}
        />

        <Button
          size="lg"
          className="w-full"
          disabled={pin.length !== 4}
          onClick={handleStart}
        >
          Start shift
        </Button>

        <p className="mt-5 text-center text-[11.5px] leading-relaxed text-faint">
          Session ends automatically at shift end or after 15 minutes idle.
          Every gate action is stamped with the officer id.
        </p>
      </div>
    </div>
  );
}
