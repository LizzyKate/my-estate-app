"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ResidentSidebar } from "@/components/resident/sidebar";
import { useResidentGuard } from "@/hooks/use-resident-guard";
import { cn } from "@/lib/utils";

const MOBILE_TABS = [
  { href: "/resident/home", label: "Home" },
  { href: "/resident/passes", label: "Passes" },
  { href: "/resident/notices", label: "Estate" },
];

export default function ResidentShellLayout({
  children,
}: LayoutProps<"/resident">) {
  const authed = useResidentGuard();
  const pathname = usePathname();

  if (!authed) return null;

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex">
        <ResidentSidebar />
      </div>
      <main className="flex-1 px-5 py-6 pb-24 sm:px-[30px] sm:py-[26px] lg:pb-[26px]">
        {children}
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-primary/10 bg-chrome lg:hidden">
        {MOBILE_TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex-1 py-3 text-center text-[12px] font-semibold",
                active ? "text-primary" : "text-muted"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
