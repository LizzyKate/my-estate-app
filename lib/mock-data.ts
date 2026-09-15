import type {
  Announcement,
  AttemptLogEntry,
  HouseholdMember,
  MaintenanceItem,
  Officer,
  Pass,
  Resident,
  Walkup,
} from "./types";

export const ESTATE_NAME = "Oakwood Estate";
export const PILOT_DAY = 41;
export const PILOT_TOTAL_DAYS = 90;

/** the resident signed in for the Phase 0 demo */
export const SIGNED_IN_RESIDENT = {
  name: "Ada Obi",
  phone: "+234 802 555 0114",
  house: "14B",
};

export const OFFICER: Officer = {
  id: "OFF-2291",
  name: "T. Bello",
  gate: "Main Gate",
  pin: "4471",
};

export const SEED_PASSES: Pass[] = [
  {
    id: 1,
    name: "Sarah Connor",
    cat: "VISITOR",
    code: "482 901",
    window: "14:00–18:00",
    host: "Ada Obi",
    house: "14B",
    plate: "ABJ 442 XA",
    status: "waiting",
    mine: true,
    issuedAt: "09:12",
  },
  {
    id: 2,
    name: "Jumia rider",
    cat: "DELIVERY",
    code: "730 118",
    window: "ANY TIME",
    host: "Ada Obi",
    house: "14B",
    plate: "",
    status: "waiting",
    mine: true,
    issuedAt: "10:40",
  },
  {
    id: 3,
    name: "Musa Waziri",
    cat: "SERVICE",
    code: "201 774",
    window: "SAT 09:00",
    host: "Ada Obi",
    house: "14B",
    plate: "",
    status: "waiting",
    mine: true,
    issuedAt: "yesterday",
  },
  {
    id: 4,
    name: "Grace Okoro",
    cat: "VISITOR",
    code: "119 043",
    window: "10:00–14:00",
    host: "Tunde Ade",
    house: "07A",
    plate: "",
    status: "onsite",
    mine: false,
    issuedAt: "08:02",
    checkedInAt: "08:31",
  },
];

export const SEED_WALKUP: Walkup | null = null;

export const SEED_HOUSEHOLD: HouseholdMember[] = [
  { id: 1, name: "Ngozi Obi", relationship: "Spouse", residency: "Permanent" },
  { id: 2, name: "Emeka Obi", relationship: "Son", residency: "Permanent" },
  {
    id: 3,
    name: "Blessing Eze",
    relationship: "House help",
    residency: "Temporary",
  },
];

export const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    title: "Water tanker scheduled for Thursday",
    body: "Estate-wide supply will be topped up between 9am and 1pm. No action needed from residents.",
    category: "UTILITY",
    publishedAt: "2h ago",
    seenBy: 74,
    status: "published",
  },
  {
    id: 2,
    title: "Estate AGM this Saturday, 10am",
    body: "Clubhouse hall. Agenda: 2026 dues review and the new gate camera proposal.",
    category: "EVENT",
    publishedAt: "1d ago",
    seenBy: 96,
    status: "published",
  },
  {
    id: 3,
    title: "Perimeter gate tested tonight",
    body: "Security will test the back gate alarm between 11pm and midnight. Expect a short siren.",
    category: "SECURITY",
    publishedAt: "3d ago",
    seenBy: 108,
    status: "published",
  },
];

export const SEED_MAINTENANCE: MaintenanceItem[] = [
  {
    id: 1,
    title: "Streetlight out near Block C",
    category: "ELECTRICAL",
    resident: "Femi Alade",
    house: "22C",
    loggedAt: "3h ago",
    status: "NEW",
  },
  {
    id: 2,
    title: "Leaking pipe by the clubhouse",
    category: "PLUMBING",
    resident: "Ada Obi",
    house: "14B",
    loggedAt: "1d ago",
    status: "IN PROGRESS",
  },
  {
    id: 3,
    title: "Broken gate arm sensor",
    category: "SECURITY",
    resident: "Tunde Ade",
    house: "07A",
    loggedAt: "4d ago",
    status: "RESOLVED",
  },
];

export const SEED_RESIDENTS: Resident[] = [
  {
    id: 1,
    name: "Ada Obi",
    role: "Head of household",
    house: "14B",
    phone: "+234 802 555 0114",
    lastLogin: "Today, 08:41",
    householdSize: 4,
    status: "ACTIVE",
    residency: "Permanent",
  },
  {
    id: 2,
    name: "Tunde Ade",
    role: "Head of household",
    house: "07A",
    phone: "+234 803 220 9981",
    lastLogin: "Today, 07:58",
    householdSize: 3,
    status: "ACTIVE",
    residency: "Permanent",
  },
  {
    id: 3,
    name: "Femi Alade",
    role: "Head of household",
    house: "22C",
    phone: "+234 810 004 5521",
    lastLogin: "Yesterday, 19:12",
    householdSize: 2,
    status: "ACTIVE",
    residency: "Permanent",
  },
  {
    id: 4,
    name: "Chioma Nwosu",
    role: "Head of household",
    house: "03D",
    phone: "+234 701 337 2290",
    lastLogin: null,
    householdSize: 1,
    status: "NOT SIGNED IN",
    residency: "Permanent",
  },
  {
    id: 5,
    name: "Ibrahim Sule",
    role: "Head of household",
    house: "18A",
    phone: "+234 816 552 0043",
    lastLogin: "3d ago",
    householdSize: 5,
    status: "ACTIVE",
    residency: "Permanent",
  },
  {
    id: 6,
    name: "Grace Okoro",
    role: "Household member",
    house: "07A",
    phone: "+234 705 118 6642",
    lastLogin: "Today, 08:20",
    householdSize: 3,
    status: "ACTIVE",
    residency: "Temporary",
  },
  {
    id: 7,
    name: "Patrick Umeh",
    role: "Head of household",
    house: "11B",
    phone: "+234 802 990 1187",
    lastLogin: null,
    householdSize: 2,
    status: "NOT SIGNED IN",
    residency: "Permanent",
  },
  {
    id: 8,
    name: "Kemi Bakare",
    role: "Head of household",
    house: "09C",
    phone: "+234 909 441 2205",
    lastLogin: "2d ago",
    householdSize: 4,
    status: "MOVED OUT",
    residency: "Permanent",
  },
];

export const SEED_ATTEMPT_LOG: AttemptLogEntry[] = [];

export const ADMIN_STATS = {
  householdsActive: 112,
  appSignInsPct: 86,
  appSignIns: 96,
  passesThisWeek: 431,
  avgGateTimeSeconds: 38,
};
