import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useStoreHydrated } from "./use-store-hydrated";

/** redirects to admin sign-in if the mock admin session isn't authenticated */
export function useAdminGuard() {
  const status = useStore((s) => s.admin.status);
  const hydrated = useStoreHydrated();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && status !== "signed_in") router.replace("/admin/sign-in");
  }, [hydrated, status, router]);

  return hydrated && status === "signed_in";
}
