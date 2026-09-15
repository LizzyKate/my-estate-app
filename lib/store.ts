import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  Announcement,
  AnnouncementCategory,
  ArrivalWindow,
  AttemptLogEntry,
  Category,
  HouseholdMember,
  MaintenanceItem,
  Pass,
  Resident,
  ResidencyType,
  Walkup,
} from "./types";
import {
  OFFICER,
  SEED_ANNOUNCEMENTS,
  SEED_ATTEMPT_LOG,
  SEED_HOUSEHOLD,
  SEED_MAINTENANCE,
  SEED_PASSES,
  SEED_RESIDENTS,
  SIGNED_IN_RESIDENT,
} from "./mock-data";
import { formatClock, groupCode, stripCode } from "./format";

/** the code the mock "SMS" always sends, so the prototype affordance works */
export const MOCK_OTP = "482901";

const OTP_LOCK_MINUTES = 15;
const MAX_OTP_ATTEMPTS = 3;

function normalizePhone(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

interface ResidentSession {
  status: "signed_out" | "otp_pending" | "signed_in";
  phone: string;
  otpAttempts: number;
  lockedUntil: number | null;
}

interface OfficerSession {
  shiftActive: boolean;
  startedAt: string | null;
}

interface CreatePassInput {
  name: string;
  cat: Category;
  phone: string;
  window: ArrivalWindow;
  plate: string;
  groupPass: boolean;
  repeatWeekly: boolean;
}

interface LogWalkupInput {
  name: string;
  phone: string;
  house: string;
  reason: string;
}

interface AddResidentInput {
  name: string;
  house: string;
  phone: string;
  role: Resident["role"];
  residency: ResidencyType;
}

interface PublishAnnouncementInput {
  title: string;
  body: string;
  category: AnnouncementCategory;
  status: "published" | "draft";
}

interface Store {
  // data
  passes: Pass[];
  walkup: Walkup | null;
  walkupHistory: Walkup[];
  household: HouseholdMember[];
  residents: Resident[];
  announcements: Announcement[];
  maintenance: MaintenanceItem[];
  attemptLog: AttemptLogEntry[];
  lastCreatedPassId: number | null;
  lastCheckedInPassId: number | null;

  // sessions
  resident: ResidentSession;
  officer: OfficerSession;

  // resident actions
  requestOtp: (phone: string) => boolean;
  verifyOtp: (code: string) => "ok" | "wrong" | "locked";
  signOutResident: () => void;
  createPass: (input: CreatePassInput) => Pass;
  revokePass: (id: number) => void;
  resolveWalkup: (decision: "approved" | "denied") => void;
  addHouseholdMember: (
    name: string,
    relationship: string,
    residency: ResidencyType,
  ) => void;
  reportIssue: (title: string, category: string) => void;

  // officer actions
  startShift: (pin: string) => boolean;
  endShift: () => void;
  submitCode: (digits: string) => { pass: Pass | null };
  checkInPass: (id: number) => void;
  checkOutPass: (id: number) => void;
  logWalkup: (input: LogWalkupInput) => Walkup;
  dismissWalkup: () => void;

  // admin actions
  addResident: (input: AddResidentInput) => void;
  publishAnnouncement: (input: PublishAnnouncementInput) => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      passes: SEED_PASSES,
      walkup: null,
      walkupHistory: [],
      household: SEED_HOUSEHOLD,
      residents: SEED_RESIDENTS,
      announcements: SEED_ANNOUNCEMENTS,
      maintenance: SEED_MAINTENANCE,
      attemptLog: SEED_ATTEMPT_LOG,
      lastCreatedPassId: null,
      lastCheckedInPassId: null,

      resident: {
        status: "signed_out",
        phone: "",
        otpAttempts: 0,
        lockedUntil: null,
      },
      officer: {
        shiftActive: false,
        startedAt: null,
      },

      requestOtp: (phone) => {
        const match = get().residents.some(
          (r) => normalizePhone(r.phone) === normalizePhone(phone),
        );
        if (!match) return false;
        set({
          resident: {
            status: "otp_pending",
            phone,
            otpAttempts: 0,
            lockedUntil: null,
          },
        });
        return true;
      },

      verifyOtp: (code) => {
        const { resident } = get();
        if (resident.lockedUntil && resident.lockedUntil > Date.now()) {
          return "locked";
        }
        if (stripCode(code) === MOCK_OTP) {
          set({
            resident: {
              ...resident,
              status: "signed_in",
              otpAttempts: 0,
              lockedUntil: null,
            },
          });
          return "ok";
        }
        const attempts = resident.otpAttempts + 1;
        const locked = attempts >= MAX_OTP_ATTEMPTS;
        set({
          resident: {
            ...resident,
            otpAttempts: attempts,
            lockedUntil: locked ? Date.now() + OTP_LOCK_MINUTES * 60_000 : null,
          },
        });
        return locked ? "locked" : "wrong";
      },

      signOutResident: () =>
        set({
          resident: {
            status: "signed_out",
            phone: "",
            otpAttempts: 0,
            lockedUntil: null,
          },
        }),

      createPass: (input) => {
        const code = groupCode(
          String(Math.floor(100000 + Math.random() * 900000)),
        );
        const pass: Pass = {
          id: Date.now(),
          name: input.name,
          cat: input.cat,
          code,
          window: input.window,
          host: SIGNED_IN_RESIDENT.name,
          house: SIGNED_IN_RESIDENT.house,
          plate: input.plate,
          status: "waiting",
          mine: true,
          issuedAt: formatClock(),
          groupPass: input.groupPass,
          repeatWeekly: input.repeatWeekly,
        };
        set({ passes: [pass, ...get().passes], lastCreatedPassId: pass.id });
        return pass;
      },

      revokePass: (id) =>
        set({ passes: get().passes.filter((p) => p.id !== id) }),

      resolveWalkup: (decision) => {
        const { walkup } = get();
        if (!walkup) return;
        const resolved: Walkup = {
          ...walkup,
          status: decision,
          resolvedAt: formatClock(),
        };
        set({
          walkup: resolved,
          walkupHistory: [resolved, ...get().walkupHistory],
        });
      },

      addHouseholdMember: (name, relationship, residency) =>
        set({
          household: [
            ...get().household,
            { id: Date.now(), name, relationship, residency },
          ],
        }),

      reportIssue: (title, category) =>
        set({
          maintenance: [
            {
              id: Date.now(),
              title,
              category: category.toUpperCase(),
              resident: SIGNED_IN_RESIDENT.name,
              house: SIGNED_IN_RESIDENT.house,
              loggedAt: "just now",
              status: "NEW",
            },
            ...get().maintenance,
          ],
        }),

      startShift: (pin) => {
        if (pin !== OFFICER.pin) return false;
        set({ officer: { shiftActive: true, startedAt: formatClock() } });
        return true;
      },

      endShift: () => set({ officer: { shiftActive: false, startedAt: null } }),

      submitCode: (digits) => {
        const clean = stripCode(digits);
        const match = get().passes.find(
          (p) => p.status === "waiting" && stripCode(p.code) === clean,
        );
        set({
          attemptLog: [
            {
              id: Date.now(),
              code: groupCode(clean),
              gate: OFFICER.gate,
              officerId: OFFICER.id,
              timestamp: formatClock(),
              result: match ? "matched" : "no_match",
            },
            ...get().attemptLog,
          ],
        });
        return { pass: match ?? null };
      },

      checkInPass: (id) => {
        set({
          passes: get().passes.map((p) =>
            p.id === id
              ? { ...p, status: "onsite", checkedInAt: formatClock() }
              : p,
          ),
          lastCheckedInPassId: id,
        });
      },

      checkOutPass: (id) => {
        set({
          passes: get().passes.map((p) =>
            p.id === id
              ? { ...p, status: "out", checkedOutAt: formatClock() }
              : p,
          ),
        });
      },

      logWalkup: (input) => {
        const walkup: Walkup = {
          id: Date.now(),
          name: input.name,
          phone: input.phone,
          house: input.house,
          reason: input.reason,
          status: "pending",
          officerId: OFFICER.id,
          gate: OFFICER.gate,
          loggedAt: formatClock(),
        };
        set({ walkup });
        return walkup;
      },

      dismissWalkup: () => set({ walkup: null }),

      addResident: (input) =>
        set({
          residents: [
            {
              id: Date.now(),
              name: input.name,
              role: input.role,
              house: input.house,
              phone: input.phone,
              lastLogin: null,
              householdSize: 1,
              status: "NOT SIGNED IN",
              residency: input.residency,
            },
            ...get().residents,
          ],
        }),

      publishAnnouncement: (input) =>
        set({
          announcements: [
            {
              id: Date.now(),
              title: input.title,
              body: input.body,
              category: input.category,
              publishedAt: "just now",
              seenBy: 0,
              status: input.status,
            },
            ...get().announcements,
          ],
        }),
    }),
    {
      name: "myestate-mock-store",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);

export const otpLockMinutes = OTP_LOCK_MINUTES;
export const maxOtpAttempts = MAX_OTP_ATTEMPTS;
