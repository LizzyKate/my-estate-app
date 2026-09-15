import { useStore } from "@/lib/store";

/**
 * the actual person behind the current session — the primary resident, or a
 * household member they added. Household data (house, estate) always comes
 * from the primary; identity (name, id) comes from whoever actually signed in.
 */
export function useSignedInResident() {
  const residentId = useStore((s) => s.resident.residentId);
  const memberId = useStore((s) => s.resident.memberId);
  const residents = useStore((s) => s.residents);
  const household = useStore((s) => s.household);

  const primary = residents.find((r) => r.id === residentId);
  if (!primary) return undefined;

  if (!memberId) {
    return { ...primary, isPrimary: true as const };
  }

  const member = household.find((h) => h.id === memberId);
  if (!member) return undefined;

  return {
    ...primary,
    id: member.id,
    name: member.name,
    role: member.relationship,
    phone: member.phone,
    isPrimary: false as const,
  };
}
