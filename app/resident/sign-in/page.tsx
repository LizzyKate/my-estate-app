"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/resident/auth-shell";
import { Button } from "@/components/ui/button";
import { MonoLabel } from "@/components/ui/mono-label";
import { useStore } from "@/lib/store";

export default function ResidentSignInPage() {
  const router = useRouter();
  const requestOtp = useStore((s) => s.requestOtp);
  const [number, setNumber] = useState("");
  const [unregistered, setUnregistered] = useState(false);

  const digits = number.replace(/\D/g, "");
  const canSubmit = digits.length >= 10;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    const ok = requestOtp(`+234${digits}`);
    if (ok) {
      router.push("/resident/verify");
    } else {
      setUnregistered(true);
    }
  }

  return (
    <AuthShell>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <h1 className="text-[31px] leading-[1.2] font-bold tracking-[-0.02em] text-text">
            Sign in
          </h1>
          <p className="mt-2 text-[14px] leading-[1.6] text-muted">
            Use the mobile number your estate admin registered for you.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <MonoLabel>Mobile number</MonoLabel>
          <div className="flex gap-2.5">
            <div className="flex h-[56px] w-[76px] shrink-0 items-center justify-center rounded-field border border-primary/12 bg-ghost font-mono text-[15px] text-text">
              +234
            </div>
            <input
              value={number}
              onChange={(e) => {
                setNumber(e.target.value);
                setUnregistered(false);
              }}
              inputMode="numeric"
              placeholder="802 555 0114"
              autoFocus
              className="h-[56px] flex-1 rounded-field border border-primary/12 bg-ghost px-4 font-mono text-[16px] tracking-[0.06em] text-text outline-none placeholder:text-subtle focus:border-[1.5px] focus:border-primary"
            />
          </div>
        </div>

        <Button type="submit" size="xl" className="w-full" disabled={!canSubmit}>
          Send me a code
        </Button>

        {unregistered && (
          <div className="rounded-field border border-amber/22 bg-amber/7 p-3.5 text-[12.5px] leading-[1.6] text-amber-text">
            We don&rsquo;t recognize this number. Only numbers registered by
            your estate admin can sign in — contact estate management to be
            added as a resident.
          </div>
        )}
      </form>
    </AuthShell>
  );
}
