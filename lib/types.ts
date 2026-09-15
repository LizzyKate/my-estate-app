export type Category = "VISITOR" | "DELIVERY" | "SERVICE";

export type PassStatus = "waiting" | "onsite" | "out";

export type ArrivalWindow = "14:00–18:00" | "18:00–22:00" | "ANY TIME" | string;

export interface Pass {
  id: number;
  name: string;
  cat: Category;
  /** grouped for display, e.g. "482 901" */
  code: string;
  window: ArrivalWindow;
  /** resident who created the pass */
  host: string;
  house: string;
  plate: string;
  status: PassStatus;
  /** belongs to the signed-in household */
  mine: boolean;
  issuedAt: string;
  checkedInAt?: string;
  checkedOutAt?: string;
  groupPass?: boolean;
  repeatWeekly?: boolean;
}

export type WalkupStatus = "pending" | "approved" | "denied";

export type WalkupStep = "push_sent" | "whatsapp_fallback" | "resolved";

export interface Walkup {
  id: number;
  name: string;
  phone: string;
  house: string;
  reason: string;
  status: WalkupStatus;
  officerId: string;
  gate: string;
  loggedAt: string;
  resolvedAt?: string;
}

export type ResidencyType = "Permanent" | "Temporary";

export type ResidentStatus = "ACTIVE" | "NOT SIGNED IN" | "MOVED OUT";

export interface Resident {
  id: number;
  name: string;
  role: "Head of household" | "Household member";
  house: string;
  phone: string;
  lastLogin: string | null;
  householdSize: number;
  status: ResidentStatus;
  residency: ResidencyType;
}

export interface HouseholdMember {
  id: number;
  name: string;
  relationship: string;
  residency: ResidencyType;
}

export type AnnouncementCategory = "UTILITY" | "SECURITY" | "EVENT" | "DUES";

export interface Announcement {
  id: number;
  title: string;
  body: string;
  category: AnnouncementCategory;
  publishedAt: string;
  seenBy: number;
  status: "published" | "draft";
}

export type MaintenanceStatus = "NEW" | "IN PROGRESS" | "RESOLVED";

export interface MaintenanceItem {
  id: number;
  title: string;
  category: string;
  resident: string;
  house: string;
  loggedAt: string;
  status: MaintenanceStatus;
}

export interface Officer {
  id: string;
  name: string;
  gate: string;
  pin: string;
}

export interface AttemptLogEntry {
  id: number;
  code: string;
  gate: string;
  officerId: string;
  timestamp: string;
  result: "matched" | "no_match";
}
