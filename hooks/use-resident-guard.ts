"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useStoreHydrated } from "./use-store-hydrated";

/** redirects to sign-in if the mock resident session isn't fully authenticated */
export function useResidentGuard() {
  const status = useStore((s) => s.resident.status);
  const hydrated = useStoreHydrated();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && status !== "signed_in") router.replace("/resident/sign-in");
  }, [hydrated, status, router]);

  return hydrated && status === "signed_in";
}
