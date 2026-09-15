"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/logo";
import { AuthShell } from "@/components/resident/auth-shell";
import { Button } from "@/components/ui/button";
import { MonoLabel } from "@/components/ui/mono-label";
import { useStore } from "@/lib/store";
import type { Estate } from "@/lib/types";

export default function ResidentSignInPage() {
  return (
    <Suspense fallback={null}>
      <ResidentSignInForm />
    </Suspense>
  );
}

function ResidentSignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const estates = useStore((s) => s.estates);
  const requestOtp = useStore((s) => s.requestOtp);
  const [estate, setEstate] = useState<Estate | null>(null);
  const [number, setNumber] = useState("");
  const [unregistered, setUnregistered] = useState(false);

  // the estate admin's link is the only way in: /resident/sign-in?estate=greenview-gardens
  useEffect(() => {
    const slug = searchParams.get("estate");
    if (!slug) return;
    const match = estates.find((e) => e.slug === slug);
    if (match) setEstate(match);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const digits = number.replace(/\D/g, "");
  const canSubmit = digits.length >= 10;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !estate) return;
    const ok = requestOtp(estate.id, `+234${digits}`);
    if (ok) {
      router.push("/resident/verify");
    } else {
      setUnregistered(true);
    }
  }

  if (!estate) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg p-6">
        <div className="w-full max-w-[440px] rounded-modal border border-primary/14 bg-sunken p-6 text-center sm:p-9">
          <Logo className="mb-8 justify-center" />
          <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-red/12 text-[20px] text-red">
            ✕
          </div>
          <h1 className="text-[20px] font-bold text-text">
            This link isn&rsquo;t valid
          </h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
            You need the sign-in link your estate admin sent you. Ask them
            to resend it from{" "}
            <span className="font-mono text-[12.5px] text-text">
              Residents → Resident sign-in link
            </span>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthShell>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <MonoLabel className="mb-3 text-primary">{estate.name}</MonoLabel>
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
            We don&rsquo;t recognize this number at {estate.name}. Only
            numbers registered by your estate admin can sign in — contact
            estate management to be added as a resident.
          </div>
        )}
      </form>
    </AuthShell>
  );
}
