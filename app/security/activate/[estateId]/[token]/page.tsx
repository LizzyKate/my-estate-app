"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export default function ActivateDevicePage({
  params,
}: {
  params: Promise<{ estateId: string; token: string }>;
}) {
  const { estateId, token } = use(params);
  const activateDevice = useStore((s) => s.activateDevice);
  const [result, setResult] = useState<{ ok: boolean; estateName?: string } | null>(null);

  useEffect(() => {
    setResult(activateDevice(estateId, token));
    // only ever run once per link visit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-6">
      <div className="w-full max-w-[440px] rounded-modal border border-primary/14 bg-sunken p-6 text-center sm:p-9">
        <Logo className="mb-8 justify-center" />

        {result === null && (
          <p className="text-[13.5px] text-muted">Activating this device…</p>
        )}

        {result?.ok && (
          <>
            <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-green text-[20px] text-green-ink">
              ✓
            </div>
            <h1 className="text-[20px] font-bold text-text">
              Device approved for {result.estateName}
            </h1>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
              This browser is now locked to {result.estateName}&rsquo;s gate.
              Any officer can start their shift here with their PIN.
            </p>
            <Link href="/security/sign-in">
              <Button size="lg" className="mt-6 w-full">
                Continue to sign in
              </Button>
            </Link>
          </>
        )}

        {result && !result.ok && (
          <>
            <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-red/12 text-[20px] text-red">
              ✕
            </div>
            <h1 className="text-[20px] font-bold text-text">
              This link isn&rsquo;t valid
            </h1>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
              It may have been revoked. Ask your estate admin to generate a
              new device activation link.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
