import { useStore } from "@/lib/store";

/** the actual resident record behind the current session — not a hardcoded name */
export function useSignedInResident() {
  const residentId = useStore((s) => s.resident.residentId);
  const residents = useStore((s) => s.residents);
  return residents.find((r) => r.id === residentId);
}
