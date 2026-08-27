import * as React from "react";
import { JobSource, MarketingSpecialistName, MARKETING_SPECIALISTS } from "../../lib/types";
import { EmailListInput } from "./EmailListInput";
import { STACIE_CONTACTS } from "../../lib/contacts";
import { isSonovaSource } from "../../lib/sourceConfig";

interface SourceSpecificSectionProps {
  source: JobSource | null;
  additionalClientLiveSeeds: string[];
  onAdditionalClientLiveSeedsChange: (values: string[]) => void;
  stacieClientEmails: string[];
  onStacieClientEmailsChange: (values: string[]) => void;
  stacieClientEmailsError?: string;
  marketingSpecialist: MarketingSpecialistName | null;
  onMarketingSpecialistChange: (name: MarketingSpecialistName) => void;
  marketingSpecialistError?: string;
}

export function SourceSpecificSection({
  source,
  additionalClientLiveSeeds,
  onAdditionalClientLiveSeedsChange,
  stacieClientEmails,
  onStacieClientEmailsChange,
  stacieClientEmailsError,
  marketingSpecialist,
  onMarketingSpecialistChange,
  marketingSpecialistError,
}: SourceSpecificSectionProps) {
  if (!source) return null;

  return (
    <section className="emh-section">
      <h2 className="emh-section-title">Source-Specific Details</h2>

      {source === "SonaRev" && (
        <div className="emh-field">
          <label className="emh-label">Additional Client Live Seed</label>
          <EmailListInput
            values={additionalClientLiveSeeds}
            onChange={onAdditionalClientLiveSeedsChange}
          />
          <div className="emh-helper">
            Optional — add the client's email if they should receive live deployments.
          </div>
        </div>
      )}

      {source === "Stacie" && (
        <div className="emh-field">
          <label className="emh-label emh-label-required">Client Email</label>
          <EmailListInput values={stacieClientEmails} onChange={onStacieClientEmailsChange} />
          {stacieClientEmailsError && <div className="emh-field-error">{stacieClientEmailsError}</div>}
          <div className="emh-callout emh-callout-warning">
            <strong>First Deployment Only — Stacie + Client</strong>
            <ul className="emh-seed-list" style={{ marginTop: 6 }}>
              <li>{STACIE_CONTACTS.work}</li>
              <li>{STACIE_CONTACTS.personal}</li>
              {stacieClientEmails.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {isSonovaSource(source) && (
        <div className="emh-field">
          <label className="emh-label emh-label-required">Marketing Specialist</label>
          <select
            className="emh-select"
            value={marketingSpecialist ?? ""}
            onChange={(e) => onMarketingSpecialistChange(e.target.value as MarketingSpecialistName)}
          >
            <option value="" disabled>
              Select a Marketing Specialist…
            </option>
            {MARKETING_SPECIALISTS.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          {marketingSpecialistError && <div className="emh-field-error">{marketingSpecialistError}</div>}
          <div className="emh-callout emh-callout-info">
            Cassie + Alicia + the selected Marketing Specialist will be included in Live Seeds.
          </div>
        </div>
      )}
    </section>
  );
}
