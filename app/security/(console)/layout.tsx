"use client";

import { SecurityTopBar } from "@/components/security/top-bar";
import { SecurityNavRail } from "@/components/security/nav-rail";
import { SecurityMobileNav } from "@/components/security/mobile-nav";
import { useOfficerGuard } from "@/hooks/use-officer-guard";

export default function SecurityConsoleLayout({
  children,
}: LayoutProps<"/security">) {
  const authed = useOfficerGuard();
  if (!authed) return null;

  return (
    <div className="flex h-screen flex-col">
      <SecurityTopBar />
      <div className="flex min-h-0 flex-1">
        <SecurityNavRail />
        <main className="min-w-0 flex-1 overflow-y-auto p-4 pb-20 sm:p-7 lg:pb-7">
          {children}
        </main>
      </div>
      <SecurityMobileNav />
    </div>
  );
}
