import { JobSource } from "./types";

export interface SourceConfigEntry {
  label: JobSource;
  /** Internal grouping — Phonak and Unitron both behave as "sonova" for seed purposes. */
  group: "sonarev" | "stacie" | "sonova";
  requiresMarketingSpecialist: boolean;
  requiresClientEmail: boolean;
  allowsOptionalClientLiveSeed: boolean;
  hasFirstDeploymentOnlySeeds: boolean;
  /** Short helper copy shown in the UI for this source. */
  helperText: string;
}

export const sourceConfig: Record<JobSource, SourceConfigEntry> = {
  SonaRev: {
    label: "SonaRev",
    group: "sonarev",
    requiresMarketingSpecialist: false,
    requiresClientEmail: false,
    allowsOptionalClientLiveSeed: true,
    hasFirstDeploymentOnlySeeds: false,
    helperText: "Client live seed is optional.",
  },
  Stacie: {
    label: "Stacie",
    group: "stacie",
    requiresMarketingSpecialist: false,
    requiresClientEmail: false,
    allowsOptionalClientLiveSeed: false,
    hasFirstDeploymentOnlySeeds: true,
    helperText: "Stacie (+ client, if provided) receive Deployment #1 only.",
  },
  Phonak: {
    label: "Phonak",
    group: "sonova",
    requiresMarketingSpecialist: true,
    requiresClientEmail: false,
    allowsOptionalClientLiveSeed: false,
    hasFirstDeploymentOnlySeeds: false,
    helperText: "Cassie + Alicia + the selected Marketing Specialist will be included.",
  },
  Unitron: {
    label: "Unitron",
    group: "sonova",
    requiresMarketingSpecialist: true,
    requiresClientEmail: false,
    allowsOptionalClientLiveSeed: false,
    hasFirstDeploymentOnlySeeds: false,
    helperText: "Cassie + Alicia + the selected Marketing Specialist will be included.",
  },
};

/** Equivalent to `isSonova = source === "Phonak" || source === "Unitron"` */
export function isSonovaSource(source: JobSource | null): boolean {
  return source === "Phonak" || source === "Unitron";
}

export function getSourceConfig(source: JobSource | null): SourceConfigEntry | null {
  if (!source) return null;
  return sourceConfig[source];
}
