import { HearingAidCampaign } from "./types";
import {
  calculateSecondDeploymentDate,
  formatDeploymentDatesCompact,
  getDeploymentMonthName,
} from "./dateUtils";
import { getSeedResult } from "./seedLogic";
import { STACIE_CONTACTS } from "./contacts";

export const STANDARD_PHT = "Take the first step toward clearer and more connected living.";

export function standardSubjectLineFor(clinicName: string): string {
  const name = clinicName.trim() || "[Clinic Name]";
  return `Visit ${name} Today to Discover Better Hearing!`;
}

/** The campaign creative Subject Line — standard unless the user opted into a custom one. */
export function generateCampaignSubjectLine(campaign: HearingAidCampaign): string {
  if (campaign.useCustomSubjectLine) {
    return campaign.customSubjectLine.trim() || standardSubjectLineFor(campaign.clinicName);
  }
  return standardSubjectLineFor(campaign.clinicName);
}

/** The campaign PHT — standard unless the user opted into custom PHT. */
export function generateCampaignPht(campaign: HearingAidCampaign): string {
  if (campaign.useCustomPht) {
    return campaign.customPht.trim() || STANDARD_PHT;
  }
  return STANDARD_PHT;
}

/** "Better Hearing Center August Campaign" — month always comes from Deployment #1. */
export function generateOutlookSubject(campaign: HearingAidCampaign): string {
  const clinic = campaign.clinicName.trim() || "[Clinic Name]";
  const month = getDeploymentMonthName(campaign.firstDeploymentDate);
  if (!month) return `${clinic} Campaign`;
  return `${clinic} ${month} Campaign`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function multilineCell(lines: string[]): string {
  if (lines.length === 0) return "";
  return lines.map((line) => escapeHtml(line)).join("<br>");
}

function targetingCellContent(campaign: HearingAidCampaign): string {
  const hasZips = campaign.zipCodes.length > 0;
  const hasCounts = !!campaign.countsAttachment;

  if (hasZips && hasCounts) {
    return `${multilineCell(campaign.zipCodes)}<br>Counts file attached.`;
  }
  if (hasCounts) {
    return "See attached counts file.";
  }
  if (hasZips) {
    return multilineCell(campaign.zipCodes);
  }
  return ""; // validation should prevent generation reaching this state
}

/**
 * Builds the full Outlook-compatible HTML body for the handoff email.
 * Deliberately conservative: table-based layout, inline styles only, no
 * flexbox/grid, no external fonts, no JS.
 */
export function generateEmailHtml(campaign: HearingAidCampaign): string {
  const secondDeploymentDate = calculateSecondDeploymentDate(campaign.firstDeploymentDate);
  const seeds = getSeedResult(campaign);
  const subjectLine = generateCampaignSubjectLine(campaign);
  const pht = generateCampaignPht(campaign);
  const quantityDisplay = campaign.emailsPerDeployment.toLocaleString("en-US");
  const clinicName = campaign.clinicName.trim();

  const rows: Array<[string, string]> = [
    ["Emails per Deployment", escapeHtml(quantityDisplay)],
    ["Deployment Dates", escapeHtml(formatDeploymentDatesCompact(campaign.firstDeploymentDate, secondDeploymentDate))],
    ["ZIP(s) / Targeting", targetingCellContent(campaign)],
    ["Subject Line", escapeHtml(subjectLine)],
    ["PHT", escapeHtml(pht)],
    ["Test Seed", multilineCell(seeds.testSeeds)],
    ["Live Seed", multilineCell(seeds.liveSeeds)],
  ];

  // No font-family is set anywhere below, by design: the generated email should
  // inherit Outlook's normal compose typography rather than imposing EMH fonts.
  const tableRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="border:1px solid #d9dcdb;padding:8px 12px;background-color:#f4f7f7;font-weight:bold;vertical-align:top;width:170px;">${escapeHtml(
            label
          )}</td>
          <td style="border:1px solid #d9dcdb;padding:8px 12px;vertical-align:top;">${value}</td>
        </tr>`
    )
    .join("");

  const stacieSection =
    campaign.source === "Stacie" && seeds.firstDeploymentOnlySeeds.length > 0
      ? `
      <p style="margin:20px 0 6px 0;">
        Please send the first email deployment to these email addresses:
      </p>
      <p style="margin:0 0 16px 0;">
        ${multilineCell(seeds.firstDeploymentOnlySeeds)}
      </p>`
      : "";

  return `
<div>
  <p style="margin:0 0 12px 0;">Hi!</p>
  <p style="margin:0 0 16px 0;">Sending in details for a hearing aid campaign: ${escapeHtml(
    clinicName
  )}</p>
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:640px;">
    <thead>
      <tr>
        <td style="border:1px solid #d9dcdb;padding:8px 12px;background-color:#00afaf;color:#ffffff;font-weight:bold;">Detail</td>
        <td style="border:1px solid #d9dcdb;padding:8px 12px;background-color:#00afaf;color:#ffffff;font-weight:bold;">Campaign Information</td>
      </tr>
    </thead>
    <tbody>${tableRows}
    </tbody>
  </table>
  ${stacieSection}
  <p style="margin:20px 0 0 0;">Please let me know if you have any questions or need anything else!</p>
  <p style="margin:16px 0 0 0;">Thanks!</p>
</div>`.trim();
}

// Re-exported for anywhere the UI needs to reference Stacie's fixed contacts directly
// (e.g. the seed preview callout) without importing contacts.ts twice.
export { STACIE_CONTACTS };
