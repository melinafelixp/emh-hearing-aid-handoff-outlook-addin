import { HearingAidCampaign, SeedResult } from "./types";
import {
  BASE_TEST_SEEDS,
  BASE_LIVE_SEEDS,
  STACIE_FIRST_DEPLOYMENT_ONLY_BASE,
  SONOVA_FIXED_LIVE_SEEDS,
  SONOVA_MARKETING_SPECIALISTS,
  EVAN_EMAIL,
} from "./contacts";
import { isSonovaSource } from "./sourceConfig";

/** Case-insensitive de-dupe that preserves the first-seen casing/order. */
function dedupeEmails(emails: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of emails) {
    const email = raw.trim();
    if (!email) continue;
    const key = email.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(email);
  }
  return result;
}

if (!EVAN_EMAIL) {
  // eslint-disable-next-line no-console
  console.warn(
    "[EMH Hearing Aid Handoff] EVAN_EMAIL is not configured — Evan will be omitted from " +
      "Test and Live Seeds until src/lib/contacts.ts is updated."
  );
}

export function getTestSeeds(): string[] {
  return dedupeEmails(BASE_TEST_SEEDS);
}

export function getLiveSeeds(campaign: HearingAidCampaign): string[] {
  let liveSeeds = [...BASE_LIVE_SEEDS];

  if (campaign.source === "SonaRev") {
    liveSeeds = [...liveSeeds, ...campaign.additionalClientLiveSeeds];
  }

  if (isSonovaSource(campaign.source)) {
    liveSeeds = [...liveSeeds, ...SONOVA_FIXED_LIVE_SEEDS];
    if (campaign.marketingSpecialist) {
      liveSeeds.push(SONOVA_MARKETING_SPECIALISTS[campaign.marketingSpecialist]);
    }
  }

  // Stacie's fixed contacts + client are deliberately NOT added here —
  // they are first-deployment-only and live in getFirstDeploymentOnlySeeds().

  return dedupeEmails(liveSeeds);
}

export function getFirstDeploymentOnlySeeds(campaign: HearingAidCampaign): string[] {
  if (campaign.source !== "Stacie") return [];
  return dedupeEmails([...STACIE_FIRST_DEPLOYMENT_ONLY_BASE, ...campaign.stacieClientEmails]);
}

export function getSeedResult(campaign: HearingAidCampaign): SeedResult {
  return {
    testSeeds: getTestSeeds(),
    liveSeeds: getLiveSeeds(campaign),
    firstDeploymentOnlySeeds: getFirstDeploymentOnlySeeds(campaign),
  };
}
