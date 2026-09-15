"use client";

import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { MonoLabel } from "@/components/ui/mono-label";
import { useStore } from "@/lib/store";
import { useAdminEstate } from "@/hooks/use-current-estate";

export function AdminMobileHeader() {
  const router = useRouter();
  const adminSignOut = useStore((s) => s.adminSignOut);
  const estate = useAdminEstate();

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-primary/10 bg-chrome px-4 lg:hidden">
      <Logo />
      <span className="h-5 w-px bg-primary/12" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12.5px] font-bold text-text">{estate?.name}</p>
        <MonoLabel>Estate admin</MonoLabel>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          adminSignOut();
          router.replace("/admin/sign-in");
        }}
      >
        Sign out
      </Button>
    </header>
  );
}
