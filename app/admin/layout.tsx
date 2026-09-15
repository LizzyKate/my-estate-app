import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminMobileHeader } from "@/components/admin/mobile-header";
import { AdminMobileNav } from "@/components/admin/mobile-nav";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
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
