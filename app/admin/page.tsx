"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";

export default function AdminIndexPage() {
  const status = useStore((s) => s.admin.status);
  const hydrated = useStoreHydrated();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    router.replace(status === "signed_in" ? "/admin/residents" : "/admin/sign-in");
  }, [hydrated, status, router]);

  return null;
}
