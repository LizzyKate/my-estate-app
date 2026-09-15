"use client";

import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminMobileHeader } from "@/components/admin/mobile-header";
import { AdminMobileNav } from "@/components/admin/mobile-nav";
import { useAdminGuard } from "@/hooks/use-admin-guard";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const authed = useAdminGuard();
  if (!authed) return null;

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminMobileHeader />
      <AdminSidebar />
      <main className="min-w-0 flex-1 px-4 py-5 pb-20 sm:px-7 sm:py-7 lg:pb-7">
        {children}
      </main>
      <AdminMobileNav />
    </div>
  );
}
