import { useStore } from "@/lib/store";

function useEstateById(id: string | null) {
  const estates = useStore((s) => s.estates);
  return estates.find((e) => e.id === id);
}

export function useResidentEstate() {
  const estateId = useStore((s) => s.resident.estateId);
  return useEstateById(estateId);
}

export function useOfficerEstate() {
  const estateId = useStore((s) => s.deviceAuth.estateId);
  return useEstateById(estateId);
}

export function useAdminEstate() {
  const estateId = useStore((s) => s.admin.estateId);
  return useEstateById(estateId);
}
