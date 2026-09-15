"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { MonoLabel } from "@/components/ui/mono-label";
import { InitialsTile } from "@/components/ui/initials-tile";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { useSignedInResident } from "@/hooks/use-signed-in-resident";
import { useResidentEstate } from "@/hooks/use-current-estate";

const NAV_ITEMS = [
  { href: "/resident/home", label: "Home" },
  { href: "/resident/passes", label: "Visitors & passes" },
  { href: "/resident/household", label: "My household" },
  { href: "/resident/notices", label: "Estate notices" },
  { href: "/resident/report", label: "Report an issue", primaryOnly: true },
];

export function ResidentSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const signOut = useStore((s) => s.signOutResident);
  const me = useSignedInResident();
  const estate = useResidentEstate();
  const navItems = NAV_ITEMS.filter((item) => !item.primaryOnly || me?.isPrimary);

  return (
    <aside className="flex w-[236px] shrink-0 flex-col gap-7 border-r border-primary/10 bg-chrome p-6">
      <Logo />

      <div className="rounded-card border border-primary/10 bg-surface p-3.5">
        <p className="text-[14px] font-bold text-text">House {me?.house}</p>
        <MonoLabel className="mt-0.5">{estate?.name.toUpperCase()}</MonoLabel>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-[10px] px-3 py-2.5 text-[13px] transition-colors",
                active
                  ? "bg-primary/14 font-bold text-primary"
                  : "font-medium text-muted hover:text-text"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => {
          signOut();
          router.replace("/resident/sign-in");
        }}
        className="flex items-center gap-2.5 rounded-[10px] p-2 text-left hover:bg-surface"
      >
        <InitialsTile name={me?.name ?? "?"} size={30} />
        <span className="min-w-0">
          <span className="block truncate text-[13px] font-semibold text-text">
            {me?.name}
          </span>
          <span className="block text-[11px] text-faint">Sign out</span>
        </span>
      </button>
    </aside>
  );
}
