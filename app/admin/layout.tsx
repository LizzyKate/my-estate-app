import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="min-w-0 flex-1 px-7 py-7">{children}</main>
    </div>
  );
}
