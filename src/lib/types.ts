// Core data types for the EMH Hearing Aid Campaign Handoff tool.
// Kept separate from DMH's types — this tool has its own business rules.

export type JobSource = "SonaRev" | "Stacie" | "Phonak" | "Unitron";

export const JOB_SOURCES: JobSource[] = ["SonaRev", "Stacie", "Phonak", "Unitron"];

export type MarketingSpecialistName = "Raymond Smith" | "Kristin Sherman" | "Bradley Weil";

export const MARKETING_SPECIALISTS: MarketingSpecialistName[] = [
  "Raymond Smith",
  "Kristin Sherman",
  "Bradley Weil",
];

export interface AttachmentInfo {
  fileName: string;
  base64: string; // office.js expects base64 content for setSelectedDataAsync attachments
  fileType: "html" | "counts";
}

export interface HearingAidCampaign {
  source: JobSource | null;
  clinicName: string;

  firstDeploymentDate: string; // ISO date string (yyyy-mm-dd), campaign-specific, never reused from clinic memory
  // secondDeploymentDate is always derived — see dateUtils.calculateSecondDeploymentDate

  useStandardQuantity: boolean;
  emailsPerDeployment: number; // defaults to 25000

  zipCodes: string[]; // stored as strings — leading zeros matter
  countsAttachment: AttachmentInfo | null;

  useCustomSubjectLine: boolean;
  customSubjectLine: string; // only used when useCustomSubjectLine is true

  useCustomPht: boolean;
  customPht: string; // only used when useCustomPht is true

  // SonaRev-only
  additionalClientLiveSeeds: string[];

  // Stacie-only
  stacieClientEmails: string[];

  // Phonak / Unitron (Sonova) only
  marketingSpecialist: MarketingSpecialistName | null;

  htmlAttachment: AttachmentInfo | null;
}

export interface ClinicProfile {
  id: string;
  clinicName: string;
  normalizedClinicName: string;
  lastSource?: JobSource;
  commonZipCodes?: string[];
  clientEmails?: string[];
  lastMarketingSpecialist?: MarketingSpecialistName;
  lastQuantity?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  // field-keyed errors, for inline display next to the offending control
  fieldErrors: Partial<Record<string, string>>;
}

export interface SeedResult {
  testSeeds: string[]; // display-friendly, deduped, normalized email list
  liveSeeds: string[];
  firstDeploymentOnlySeeds: string[]; // Stacie-only; empty for every other source
}

export function emptyCampaign(): HearingAidCampaign {
  return {
    source: null,
    clinicName: "",
    firstDeploymentDate: "",
    useStandardQuantity: true,
    emailsPerDeployment: 25000,
    zipCodes: [],
    countsAttachment: null,
    useCustomSubjectLine: false,
    customSubjectLine: "",
    useCustomPht: false,
    customPht: "",
    additionalClientLiveSeeds: [],
    stacieClientEmails: [],
    marketingSpecialist: null,
    htmlAttachment: null,
  };
}
