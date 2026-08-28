import { ClinicProfile, JobSource, MarketingSpecialistName } from "../lib/types";

// ─────────────────────────────────────────────────────────────────────────
// Storage abstraction. The UI and campaign logic should only ever call the
// functions exported at the bottom of this file (getClinics, searchClinics,
// saveClinic, updateClinic) — never touch localStorage directly elsewhere in
// the app. That's what makes it possible to swap this out for a shared
// backend (e.g. Supabase, so autocomplete works across the whole EMH team)
// later without changing a single component.
// ─────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "emh-hearing-aid-clinics";

interface ClinicStorageAdapter {
  getAll(): Promise<ClinicProfile[]>;
  upsert(profile: ClinicProfile): Promise<ClinicProfile>;
}

function normalizeClinicName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

class LocalStorageClinicAdapter implements ClinicStorageAdapter {
  async getAll(): Promise<ClinicProfile[]> {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.warn("[EMH Hearing Aid Handoff] Failed to read clinic history:", err);
      return [];
    }
  }

  async upsert(profile: ClinicProfile): Promise<ClinicProfile> {
    try {
      const all = await this.getAll();
      const idx = all.findIndex((c) => c.normalizedClinicName === profile.normalizedClinicName);
      if (idx >= 0) {
        const existing = all[idx];
        // A campaign that didn't supply a client email (e.g. Stacie without one) should
        // never erase a client email learned from a previous campaign for this clinic —
        // only overwrite when the current campaign actually provided one.
        const clientEmails =
          profile.clientEmails && profile.clientEmails.length > 0
            ? profile.clientEmails
            : existing.clientEmails;
        all[idx] = { ...existing, ...profile, clientEmails, updatedAt: new Date().toISOString() };
      } else {
        all.push(profile);
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      return profile;
    } catch (err) {
      console.warn("[EMH Hearing Aid Handoff] Failed to save clinic history:", err);
      return profile;
    }
  }
}

// Swap this single line for a Supabase-backed adapter (or any shared backend)
// when one becomes available to this project. Nothing else needs to change.
const adapter: ClinicStorageAdapter = new LocalStorageClinicAdapter();

export async function getClinics(): Promise<ClinicProfile[]> {
  return adapter.getAll();
}

export async function searchClinics(query: string): Promise<ClinicProfile[]> {
  const q = normalizeClinicName(query);
  if (!q) return [];
  const all = await adapter.getAll();
  return all
    .filter((c) => c.normalizedClinicName.includes(q))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 8);
}

export async function getRecentClinics(limit = 5): Promise<ClinicProfile[]> {
  const all = await adapter.getAll();
  return [...all].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, limit);
}

export interface SaveClinicInput {
  clinicName: string;
  source?: JobSource;
  zipCodes?: string[];
  clientEmails?: string[];
  marketingSpecialist?: MarketingSpecialistName;
  quantity?: number;
}

/** Creates or updates a clinic's reusable profile. Never stores deployment dates. */
export async function saveClinic(input: SaveClinicInput): Promise<ClinicProfile> {
  const normalized = normalizeClinicName(input.clinicName);
  const now = new Date().toISOString();
  const profile: ClinicProfile = {
    id: normalized,
    clinicName: input.clinicName.trim(),
    normalizedClinicName: normalized,
    lastSource: input.source,
    commonZipCodes: input.zipCodes,
    clientEmails: input.clientEmails,
    lastMarketingSpecialist: input.marketingSpecialist,
    lastQuantity: input.quantity,
    createdAt: now,
    updatedAt: now,
  };
  return adapter.upsert(profile);
}

export const updateClinic = saveClinic;
