import Link from "next/link";
import { Logo } from "@/components/logo";
import { MonoLabel } from "@/components/ui/mono-label";

const SURFACES = [
  {
    href: "/resident",
    label: "Resident",
    desc: "Sign in, invite visitors, approve walk-ups, see estate notices.",
  },
  {
    href: "/security",
    label: "Security",
    desc: "Start a shift, check codes at the gate, log walk-ups.",
  },
  {
    href: "/admin",
    label: "Estate admin",
    desc: "Register residents, publish notices, watch live gate numbers.",
  },
];

// Local-testing convenience only — never linked from the real app. "/"
// intentionally redirects straight to resident sign-in (that's the
// production behavior), so this is the fast way back to the other two
// surfaces while developing.
export default function DevPickerPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 p-6">
      <Logo />
      <div className="text-center">
        <h1 className="text-[26px] font-bold text-text">
          Phase 0 — pick a surface
        </h1>
        <p className="mt-2 max-w-md text-[13.5px] text-muted">
          Resident, security and admin are separate authenticated apps in
          production. This picker only exists for local development —
          it&rsquo;s not linked from anywhere in the real app.
        </p>
      </div>

      <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-3">
        {SURFACES.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="flex flex-col gap-2 rounded-card border border-primary/10 bg-surface p-5 transition-colors hover:border-primary/24"
          >
            <MonoLabel>{s.label}</MonoLabel>
            <p className="text-[13px] leading-relaxed text-muted">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
