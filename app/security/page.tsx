"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";

export default function SecurityIndexPage() {
  const shiftActive = useStore((s) => s.officer.shiftActive);
  const hydrated = useStoreHydrated();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    router.replace(shiftActive ? "/security/gate" : "/security/sign-in");
  }, [hydrated, shiftActive, router]);

  return null;
}
