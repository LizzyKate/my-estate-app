"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useStoreHydrated } from "./use-store-hydrated";

/** redirects to officer sign-in if no shift is active */
export function useOfficerGuard() {
  const shiftActive = useStore((s) => s.officer.shiftActive);
  const hydrated = useStoreHydrated();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !shiftActive) router.replace("/security/sign-in");
  }, [hydrated, shiftActive, router]);

  return hydrated && shiftActive;
}
