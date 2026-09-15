import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  Announcement,
  AnnouncementCategory,
  ArrivalWindow,
  AttemptLogEntry,
  Category,
  Estate,
  GateDevice,
  HouseholdMember,
  MaintenanceItem,
  Officer,
  Pass,
  Resident,
  ResidencyType,
  Walkup,
} from "./types";
import {
  SEED_ANNOUNCEMENTS,
  SEED_ATTEMPT_LOG,
  SEED_ESTATE,
  SEED_HOUSEHOLD,
  SEED_MAINTENANCE,
  SEED_OFFICERS,
  SEED_PASSES,
  SEED_RESIDENTS,
  SEED_WALKUPS,
} from "./mock-data";
import { formatClock, groupCode, slugify, stripCode } from "./format";

/** the code the mock "SMS" always sends, so the prototype affordance works */
export const MOCK_OTP = "482901";

const OTP_LOCK_MINUTES = 15;
const MAX_OTP_ATTEMPTS = 3;

function normalizePhone(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

function generateDeviceToken() {
  return Array.from({ length: 24 }, () =>
    "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)],
  ).join("");
}

interface ResidentSession {
  status: "signed_out" | "otp_pending" | "signed_in";
  estateId: string | null;
  residentId: number | null;
  phone: string;
  otpAttempts: number;
  lockedUntil: number | null;
}

interface OfficerSession {
  shiftActive: boolean;
  startedAt: string | null;
  officerId: string | null;
}

/** which estate THIS BROWSER is approved for — set only by opening a valid
 * activation link from the estate admin. Independent of any officer shift. */
interface DeviceAuth {
  estateId: string | null;
  deviceId: string | null;
}

interface AdminSession {
  status: "signed_out" | "signed_in";
  estateId: string | null;
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

interface AddOfficerInput {
  name: string;
  gate: string;
  pin: string;
}

interface PublishAnnouncementInput {
  title: string;
  body: string;
  category: AnnouncementCategory;
  status: "published" | "draft";
}

interface RegisterEstateInput {
  estateName: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
}

interface Store {
  // data — every record carries an estateId; callers filter by whichever
  // session (resident/officer/admin) they're rendering for
  estates: Estate[];
  devices: GateDevice[];
  passes: Pass[];
  walkups: Walkup[];
  household: HouseholdMember[];
  residents: Resident[];
  officers: Officer[];
  announcements: Announcement[];
  maintenance: MaintenanceItem[];
  attemptLog: AttemptLogEntry[];
  lastCreatedPassId: number | null;
  lastCheckedInPassId: number | null;

  // sessions
  resident: ResidentSession;
  officer: OfficerSession;
  admin: AdminSession;
  deviceAuth: DeviceAuth;

  // estate lifecycle
  registerEstate: (input: RegisterEstateInput) => { ok: boolean; error?: string };

  // resident actions
  requestOtp: (estateId: string, phone: string) => boolean;
  verifyOtp: (code: string) => "ok" | "wrong" | "locked";
  signOutResident: () => void;
  createPass: (input: CreatePassInput) => Pass;
  revokePass: (id: number) => void;
  resolveWalkup: (id: number, decision: "approved" | "denied") => void;
  addHouseholdMember: (
    name: string,
    relationship: string,
    residency: ResidencyType,
  ) => void;
  reportIssue: (title: string, category: string) => void;

  // device actions — activation is what a physical gate device does once,
  // by opening the link the estate admin generated for it
  activateDevice: (estateId: string, token: string) => { ok: boolean; estateName?: string };

  // officer actions
  startShift: (pin: string) => boolean;
  endShift: () => void;
  submitCode: (digits: string) => { pass: Pass | null };
  checkInPass: (id: number) => void;
  checkOutPass: (id: number) => void;
  logWalkup: (input: LogWalkupInput) => Walkup;
  dismissWalkup: (id: number) => void;

  // admin actions
  adminLogin: (email: string, password: string) => boolean;
  adminSignOut: () => void;
  addResident: (input: AddResidentInput) => void;
  addOfficer: (input: AddOfficerInput) => void;
  addDevice: (label: string) => GateDevice;
  revokeDevice: (id: string) => void;
  publishAnnouncement: (input: PublishAnnouncementInput) => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      estates: [SEED_ESTATE],
      devices: [],
      passes: SEED_PASSES,
      walkups: SEED_WALKUPS,
      household: SEED_HOUSEHOLD,
      residents: SEED_RESIDENTS,
      officers: SEED_OFFICERS,
      announcements: SEED_ANNOUNCEMENTS,
      maintenance: SEED_MAINTENANCE,
      attemptLog: SEED_ATTEMPT_LOG,
      lastCreatedPassId: null,
      lastCheckedInPassId: null,

      resident: {
        status: "signed_out",
        estateId: null,
        residentId: null,
        phone: "",
        otpAttempts: 0,
        lockedUntil: null,
      },
      officer: {
        shiftActive: false,
        startedAt: null,
        officerId: null,
      },
      admin: {
        status: "signed_out",
        estateId: null,
      },
      deviceAuth: {
        estateId: null,
        deviceId: null,
      },

      registerEstate: (input) => {
        const email = input.adminEmail.trim().toLowerCase();
        const emailTaken = get().estates.some(
          (e) => e.adminEmail.toLowerCase() === email,
        );
        if (emailTaken) {
          return { ok: false, error: "That admin email is already registered." };
        }
        const baseSlug = slugify(input.estateName) || "estate";
        const existingSlugs = new Set(get().estates.map((e) => e.slug));
        let slug = baseSlug;
        let n = 2;
        while (existingSlugs.has(slug)) {
          slug = `${baseSlug}-${n++}`;
        }
        const estate: Estate = {
          id: slug,
          name: input.estateName.trim(),
          slug,
          adminName: input.adminName.trim(),
          adminEmail: input.adminEmail.trim(),
          adminPassword: input.adminPassword,
          createdAt: new Date().toISOString(),
        };
        set({
          estates: [...get().estates, estate],
          admin: { status: "signed_in", estateId: estate.id },
        });
        return { ok: true };
      },

      requestOtp: (estateId, phone) => {
        const match = get().residents.find(
          (r) =>
            r.estateId === estateId &&
            normalizePhone(r.phone) === normalizePhone(phone),
        );
        if (!match) return false;
        set({
          resident: {
            status: "otp_pending",
            estateId,
            residentId: match.id,
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
            estateId: null,
            residentId: null,
            phone: "",
            otpAttempts: 0,
            lockedUntil: null,
          },
        }),

      createPass: (input) => {
        const { resident, residents } = get();
        const me = residents.find((r) => r.id === resident.residentId);
        const code = groupCode(
          String(Math.floor(100000 + Math.random() * 900000)),
        );
        const pass: Pass = {
          id: Date.now(),
          estateId: resident.estateId ?? "",
          name: input.name,
          cat: input.cat,
          code,
          window: input.window,
          host: me?.name ?? "",
          house: me?.house ?? "",
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

      resolveWalkup: (id, decision) =>
        set({
          walkups: get().walkups.map((w) =>
            w.id === id
              ? { ...w, status: decision, resolvedAt: formatClock() }
              : w,
          ),
        }),

      addHouseholdMember: (name, relationship, residency) => {
        const { resident } = get();
        if (!resident.residentId || !resident.estateId) return;
        set({
          household: [
            ...get().household,
            {
              id: Date.now(),
              estateId: resident.estateId,
              residentId: resident.residentId,
              name,
              relationship,
              residency,
            },
          ],
        });
      },

      reportIssue: (title, category) => {
        const { resident, residents } = get();
        const me = residents.find((r) => r.id === resident.residentId);
        if (!me || !resident.estateId) return;
        set({
          maintenance: [
            {
              id: Date.now(),
              estateId: resident.estateId,
              title,
              category: category.toUpperCase(),
              resident: me.name,
              house: me.house,
              loggedAt: "just now",
              status: "NEW",
            },
            ...get().maintenance,
          ],
        });
      },

      activateDevice: (estateId, token) => {
        const device = get().devices.find(
          (d) => d.estateId === estateId && d.token === token,
        );
        if (!device) return { ok: false };
        const estate = get().estates.find((e) => e.id === estateId);
        set({
          devices: get().devices.map((d) =>
            d.id === device.id && !d.activatedAt
              ? { ...d, activatedAt: new Date().toISOString() }
              : d,
          ),
          deviceAuth: { estateId, deviceId: device.id },
        });
        return { ok: true, estateName: estate?.name };
      },

      startShift: (pin) => {
        const { deviceAuth } = get();
        if (!deviceAuth.estateId) return false;
        const match = get().officers.find(
          (o) => o.estateId === deviceAuth.estateId && o.pin === pin,
        );
        if (!match) return false;
        set({
          officer: {
            shiftActive: true,
            startedAt: formatClock(),
            officerId: match.id,
          },
        });
        return true;
      },

      endShift: () =>
        set({
          officer: { shiftActive: false, startedAt: null, officerId: null },
        }),

      submitCode: (digits) => {
        const { deviceAuth, officer, passes } = get();
        const clean = stripCode(digits);
        const match = passes.find(
          (p) =>
            p.estateId === deviceAuth.estateId &&
            p.status === "waiting" &&
            stripCode(p.code) === clean,
        );
        const onDuty = get().officers.find((o) => o.id === officer.officerId);
        set({
          attemptLog: [
            {
              id: Date.now(),
              estateId: deviceAuth.estateId ?? "",
              code: groupCode(clean),
              gate: onDuty?.gate ?? "",
              officerId: onDuty?.id ?? "",
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
        const { officer, deviceAuth } = get();
        const onDuty = get().officers.find((o) => o.id === officer.officerId);
        const walkup: Walkup = {
          id: Date.now(),
          estateId: deviceAuth.estateId ?? "",
          name: input.name,
          phone: input.phone,
          house: input.house,
          reason: input.reason,
          status: "pending",
          officerId: onDuty?.id ?? "",
          gate: onDuty?.gate ?? "",
          loggedAt: formatClock(),
        };
        set({ walkups: [walkup, ...get().walkups] });
        return walkup;
      },

      dismissWalkup: (id) =>
        set({
          walkups: get().walkups.map((w) =>
            w.id === id ? { ...w, dismissed: true } : w,
          ),
        }),

      adminLogin: (email, password) => {
        const match = get().estates.find(
          (e) =>
            e.adminEmail.toLowerCase() === email.trim().toLowerCase() &&
            e.adminPassword === password,
        );
        if (!match) return false;
        set({ admin: { status: "signed_in", estateId: match.id } });
        return true;
      },

      adminSignOut: () => set({ admin: { status: "signed_out", estateId: null } }),

      addResident: (input) => {
        const { admin } = get();
        if (!admin.estateId) return;
        set({
          residents: [
            {
              id: Date.now(),
              estateId: admin.estateId,
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
        });
      },

      addOfficer: (input) => {
        const { admin } = get();
        if (!admin.estateId) return;
        set({
          officers: [
            ...get().officers,
            {
              id: `OFF-${Math.floor(1000 + Math.random() * 9000)}`,
              estateId: admin.estateId,
              ...input,
            },
          ],
        });
      },

      addDevice: (label) => {
        const { admin } = get();
        const device: GateDevice = {
          id: `DEV-${Math.floor(1000 + Math.random() * 9000)}`,
          estateId: admin.estateId ?? "",
          label,
          token: generateDeviceToken(),
          createdAt: new Date().toISOString(),
          activatedAt: null,
        };
        set({ devices: [...get().devices, device] });
        return device;
      },

      revokeDevice: (id) =>
        set({ devices: get().devices.filter((d) => d.id !== id) }),

      publishAnnouncement: (input) => {
        const { admin } = get();
        if (!admin.estateId) return;
        set({
          announcements: [
            {
              id: Date.now(),
              estateId: admin.estateId,
              title: input.title,
              body: input.body,
              category: input.category,
              publishedAt: "just now",
              seenBy: 0,
              status: input.status,
            },
            ...get().announcements,
          ],
        });
      },
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
