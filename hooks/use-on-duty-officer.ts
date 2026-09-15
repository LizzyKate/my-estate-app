import { useStore } from "@/lib/store";

/** the officer who actually signed in for the current shift (or undefined before/after one) */
export function useOnDutyOfficer() {
  const officerId = useStore((s) => s.officer.officerId);
  const officers = useStore((s) => s.officers);
  return officers.find((o) => o.id === officerId);
}
