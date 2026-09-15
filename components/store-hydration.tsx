"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

/**
 * Rehydrates the persisted mock store after mount (skipHydration is on so the
 * first client render always matches the server-rendered seed data — no
 * hydration mismatch — then this swaps in whatever's in localStorage).
 */
export function StoreHydration() {
  useEffect(() => {
    useStore.persist.rehydrate();
  }, []);

  return null;
}
