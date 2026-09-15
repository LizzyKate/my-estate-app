"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { MonoLabel } from "@/components/ui/mono-label";
import { useStore } from "@/lib/store";

export default function AdminSignInPage() {
  const router = useRouter();
  const adminLogin = useStore((s) => s.adminLogin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const canSubmit = email.trim().length > 3 && password.length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    if (adminLogin(email, password)) {
      router.push("/admin/residents");
    } else {
      setError(true);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-6">
      <div className="w-full max-w-[440px] rounded-modal border border-primary/14 bg-sunken p-6 sm:p-9">
        <Logo className="mb-8" />

        <h1 className="text-[24px] font-bold tracking-[-0.01em] text-text">
          Estate admin sign in
        </h1>
        <p className="mt-2 mb-7 text-[13.5px] text-muted">
          Sign in to your estate&rsquo;s management console.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Email">
            <Input
              type="email"
              autoFocus
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(false);
              }}
              placeholder="admin@yourestate.ng"
            />
          </Field>

          <Field label="Password">
            <Input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="••••••••"
            />
          </Field>

          {error && (
            <p className="text-[13px] font-medium text-red">
              That email or password doesn&rsquo;t match an admin account.
            </p>
          )}

          <Button type="submit" size="lg" className="mt-2 w-full" disabled={!canSubmit}>
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-[13px] text-muted">
          First time here?{" "}
          <Link href="/#register" className="font-semibold text-primary">
            Register your estate
          </Link>
          .
        </p>

        <div className="mt-5 rounded-field border border-dashed border-primary/20 bg-sunken/60 p-3.5">
          <MonoLabel>Demo credentials</MonoLabel>
          <p className="mt-1.5 font-mono text-[12px] text-muted">
            admin@oakwoodestate.ng · oakwood2026
          </p>
        </div>
      </div>
    </div>
  );
}
