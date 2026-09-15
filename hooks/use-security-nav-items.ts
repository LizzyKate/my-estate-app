import { useStore } from "@/lib/store";

export interface SecurityNavItem {
  href: string;
  label: string;
  shortLabel: string;
  count: number | null;
  amber?: boolean;
}

/** shared nav-item + live-count computation for the desktop rail and mobile tab bar */
export function useSecurityNavItems(): SecurityNavItem[] {
  const estateId = useStore((s) => s.deviceAuth.estateId);
  const allPasses = useStore((s) => s.passes);
  const allWalkups = useStore((s) => s.walkups);

  const passes = allPasses.filter((p) => p.estateId === estateId);
  const walkupPending = allWalkups.some(
    (w) => w.estateId === estateId && w.status === "pending"
  );

  const waiting = passes.filter((p) => p.status === "waiting").length;
  const onsite = passes.filter((p) => p.status === "onsite").length;
  const logged = passes.filter((p) => p.status === "out").length;

  return [
    { href: "/security/gate", label: "Gate check", shortLabel: "Gate", count: null },
    {
      href: "/security/expected",
      label: "Expected today",
      shortLabel: "Expected",
      count: waiting,
    },
    { href: "/security/onsite", label: "On site now", shortLabel: "On site", count: onsite },
    {
      href: "/security/walkup",
      label: "Walk-ups",
      shortLabel: "Walk-ups",
      count: walkupPending ? 1 : 0,
      amber: walkupPending,
    },
    { href: "/security/log", label: "Today's log", shortLabel: "Log", count: logged },
  ];
}
