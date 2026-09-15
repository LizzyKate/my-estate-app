"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/resident/auth-shell";
import { OtpBoxes } from "@/components/ui/code-boxes";
import { useCountdown } from "@/hooks/use-countdown";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { MOCK_OTP, useStore } from "@/lib/store";

export default function ResidentVerifyPage() {
  const router = useRouter();
  const resident = useStore((s) => s.resident);
  const verifyOtp = useStore((s) => s.verifyOtp);
  const hydrated = useStoreHydrated();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { label, restart, expired } = useCountdown(24);

  useEffect(() => {
    if (hydrated && resident.status === "signed_out") router.replace("/resident/sign-in");
  }, [hydrated, resident.status, router]);

  function handleVerify(next: string) {
    setCode(next);
    setError(null);
    if (next.length !== 6) return;
    const result = verifyOtp(next);
    if (result === "ok") {
      router.push("/resident/home");
    } else if (result === "locked") {
      setError(
        "Too many wrong attempts. This number is locked for 15 minutes."
      );
    } else {
      setError("That code doesn't match. Try again.");
      setCode("");
    }
  }

  return (
    <AuthShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-[31px] leading-[1.2] font-bold tracking-[-0.02em] text-text">
            Enter the code
          </h1>
          <p className="mt-2 text-[14px] leading-[1.6] text-muted">
            We sent a 6-digit code to {resident.phone || "your number"}.
          </p>
        </div>

        <OtpBoxes value={code} onChange={handleVerify} autoFocus />

        {error && (
          <p className="text-[13px] font-medium text-red">{error}</p>
        )}

        <div className="flex items-center gap-4 font-mono text-[12.5px]">
          {expired ? (
            <button
              type="button"
              onClick={() => restart(24)}
              className="font-semibold text-primary"
            >
              Resend code
            </button>
          ) : (
            <span className="text-faint">Resend in {label}</span>
          )}
          <span className="text-subtle">·</span>
          <button type="button" className="font-semibold text-primary">
            Call me instead
          </button>
        </div>

        <div className="rounded-field border border-primary/12 bg-sunken p-3.5 text-[12.5px] leading-[1.6] text-muted">
          Codes expire after 10 minutes. Three wrong attempts locks this
          number for 15 minutes.
        </div>

        <div className="rounded-field border border-dashed border-primary/20 bg-sunken/60 p-3.5">
          <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-faint">
            Mock SMS · prototype only
          </p>
          <p className="mb-3 text-[13px] text-muted">
            Your MyEstate code is{" "}
            <span className="font-mono font-bold text-text">
              {MOCK_OTP.slice(0, 3)} {MOCK_OTP.slice(3)}
            </span>
            . Valid for 10 minutes.
          </p>
          <button
            type="button"
            onClick={() => handleVerify(MOCK_OTP)}
            className="text-[12.5px] font-semibold text-primary underline underline-offset-2"
          >
            Use code from SMS
          </button>
        </div>
      </div>
    </AuthShell>
  );
}
