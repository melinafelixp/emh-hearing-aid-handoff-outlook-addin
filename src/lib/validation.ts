import { HearingAidCampaign, ValidationResult } from "./types";
import { getSourceConfig } from "./sourceConfig";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ZIP_RE = /^\d{5}$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

export function isValidZip(zip: string): boolean {
  return ZIP_RE.test(zip.trim());
}

export function validateCampaign(campaign: HearingAidCampaign): ValidationResult {
  const errors: string[] = [];
  const fieldErrors: Partial<Record<string, string>> = {};

  const fail = (field: string, message: string) => {
    errors.push(message);
    fieldErrors[field] = message;
  };

  if (!campaign.source) {
    fail("source", "Select a Job Source.");
  }

  if (!campaign.clinicName.trim()) {
    fail("clinicName", "Clinic Name is required.");
  }

  if (!campaign.firstDeploymentDate) {
    fail("firstDeploymentDate", "First Deployment Date is required.");
  }

  if (!Number.isFinite(campaign.emailsPerDeployment) || campaign.emailsPerDeployment <= 0) {
    fail("emailsPerDeployment", "Emails per Deployment must be greater than 0.");
  }

  const hasZips = campaign.zipCodes.length > 0;
  const hasCounts = !!campaign.countsAttachment;
  if (!hasZips && !hasCounts) {
    fail("targeting", "Enter at least one ZIP code or attach a counts file.");
  }
  const invalidZips = campaign.zipCodes.filter((z) => !isValidZip(z));
  if (invalidZips.length > 0) {
    fail("zipCodes", `Invalid ZIP code(s): ${invalidZips.join(", ")}`);
  }

  if (campaign.useCustomSubjectLine && !campaign.customSubjectLine.trim()) {
    fail("customSubjectLine", "Enter a custom Subject Line, or switch back to Standard.");
  }

  if (campaign.useCustomPht && !campaign.customPht.trim()) {
    fail("customPht", "Enter custom PHT, or switch back to Standard.");
  }

  if (!campaign.htmlAttachment) {
    fail("htmlAttachment", "Attach the final campaign HTML before creating the handoff email.");
  }

  const sourceCfg = getSourceConfig(campaign.source);
  if (sourceCfg) {
    if (sourceCfg.requiresClientEmail) {
      if (campaign.stacieClientEmails.length === 0) {
        fail("stacieClientEmails", "Client Email is required for Stacie campaigns.");
      } else {
        const badClientEmails = campaign.stacieClientEmails.filter((e) => !isValidEmail(e));
        if (badClientEmails.length > 0) {
          fail("stacieClientEmails", `Invalid client email(s): ${badClientEmails.join(", ")}`);
        }
      }
    }

    if (sourceCfg.requiresMarketingSpecialist && !campaign.marketingSpecialist) {
      fail("marketingSpecialist", "Marketing Specialist is required for Sonova (Phonak/Unitron) campaigns.");
    }

    if (sourceCfg.allowsOptionalClientLiveSeed && campaign.additionalClientLiveSeeds.length > 0) {
      const badSeeds = campaign.additionalClientLiveSeeds.filter((e) => !isValidEmail(e));
      if (badSeeds.length > 0) {
        fail("additionalClientLiveSeeds", `Invalid client live seed email(s): ${badSeeds.join(", ")}`);
      }
    }
  }

  return { isValid: errors.length === 0, errors, fieldErrors };
}
