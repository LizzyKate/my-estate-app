"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/field";
import { MonoLabel } from "@/components/ui/mono-label";
import { useStore } from "@/lib/store";

const SURFACES = [
  {
    label: "Residents",
    title: "Invite a guest in ten seconds.",
    desc: "A phone number, a name, an arrival window — the code goes out by SMS before the visitor's even left home. No account for them to create.",
  },
  {
    label: "Security",
    title: "One code, one decision.",
    desc: "Type the six digits, see the name and the household it belongs to, let them in. A wrong code logs itself — nobody has to remember to check.",
  },
  {
    label: "Estate admin",
    title: "Know who counts as a resident.",
    desc: "You register the households and the gate staff. Nobody else can — that's what makes the rest of it trustworthy.",
  },
];

const STEPS = [
  { n: "01", title: "A resident invites someone", body: "Name, phone, arrival window. A single-use code is generated and texted to the guest." },
  { n: "02", title: "Security reads it back", body: "The guard keys the code in at the gate. Matching name and household show up before the gate opens." },
  { n: "03", title: "Everyone finds out at once", body: "The resident gets a push the moment their guest is checked in. The admin dashboard updates live." },
];

export default function LandingPage() {
  const router = useRouter();
  const registerEstate = useStore((s) => s.registerEstate);

  const [estateName, setEstateName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    estateName.trim().length > 1 &&
    adminName.trim().length > 1 &&
    adminEmail.trim().length > 3 &&
    password.length >= 6 &&
    password === confirmPassword;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (!canSubmit) return;
    const result = registerEstate({ estateName, adminName, adminEmail, adminPassword: password });
    if (result.ok) {
      router.push("/admin/residents");
    } else {
      setError(result.error ?? "Couldn't register that estate.");
    }
  }

  return (
    <div className="min-h-screen">
      {/* nav */}
      <header className="flex items-center justify-between px-6 py-6 sm:px-10">
        <Logo />
        <nav className="flex items-center gap-5 font-mono text-[11.5px] font-semibold tracking-[0.04em] text-muted uppercase">
          <Link href="/admin/sign-in" className="hover:text-text">
            Admin sign in
          </Link>
        </nav>
      </header>

      {/* hero */}
      <section className="px-6 pt-10 pb-16 sm:px-10 sm:pt-16 sm:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <MonoLabel className="text-primary">
            Built for gated estates
          </MonoLabel>
          <h1 className="mt-4 text-[38px] leading-[1.1] font-bold tracking-[-0.02em] text-balance text-text sm:text-[54px]">
            Know exactly who&rsquo;s at your gate — and who let them in.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[16px] leading-[1.6] text-muted sm:text-[18px]">
            MyEstate replaces the phone call to the gatehouse with a code.
            Residents invite guests from their phone, security verifies in
            seconds, and management sees it all without picking up a radio.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#register">
              <Button size="xl" className="w-full sm:w-auto">
                Register your estate
              </Button>
            </a>
            <Link href="/admin/sign-in">
              <Button variant="ghost" size="xl" className="w-full sm:w-auto">
                Estate admin sign in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* three surfaces */}
      <section className="px-6 pb-16 sm:px-10 sm:pb-24">
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
          {SURFACES.map((s) => (
            <Card key={s.label} className="p-6">
              <MonoLabel>{s.label}</MonoLabel>
              <h3 className="mt-3 text-[18px] leading-[1.3] font-bold text-text">
                {s.title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
                {s.desc}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section className="border-t border-primary/10 bg-chrome px-6 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-[26px] font-bold text-text sm:text-[32px]">
            The loop that matters
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-[14px] leading-relaxed text-muted">
            Everything else in MyEstate exists to support this one exchange.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n}>
                <span className="font-mono text-[13px] font-bold text-primary">
                  {step.n}
                </span>
                <h3 className="mt-2 text-[16px] font-bold text-text">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* registration */}
      <section id="register" className="scroll-mt-10 px-6 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto max-w-md">
          <div className="mb-7 text-center">
            <h2 className="text-[26px] font-bold text-text">
              Register your estate
            </h2>
            <p className="mt-2 text-[13.5px] text-muted">
              You&rsquo;ll land straight in your own admin console — no
              waiting on a sales call.
            </p>
          </div>

          <Card className="p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Field label="Estate name">
                <Input
                  value={estateName}
                  onChange={(e) => setEstateName(e.target.value)}
                  placeholder="e.g. Greenview Gardens"
                />
              </Field>
              <Field label="Your name">
                <Input
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="Full name"
                />
              </Field>
              <Field label="Work email">
                <Input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@yourestate.ng"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Password">
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                  />
                </Field>
                <Field label="Confirm">
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                  />
                </Field>
              </div>

              {error && (
                <p className="text-[13px] font-medium text-red">{error}</p>
              )}

              <Button type="submit" size="lg" className="mt-1 w-full" disabled={!canSubmit}>
                Create estate account
              </Button>

              <p className="text-center text-[12px] leading-relaxed text-faint">
                You become the estate admin. Residents and security officers
                are added by you afterward — nobody signs up on their own.
              </p>
            </form>
          </Card>
        </div>
      </section>

      <footer className="border-t border-primary/10 px-6 py-8 text-center sm:px-10">
        <p className="font-mono text-[11px] text-faint">
          MyEstate · Phase 0 pilot
        </p>
      </footer>
    </div>
  );
}
