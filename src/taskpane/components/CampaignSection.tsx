import * as React from "react";
import { ClinicProfile, JobSource } from "../../lib/types";
import { JOB_SOURCES } from "../../lib/types";

interface CampaignSectionProps {
  source: JobSource | null;
  onSourceChange: (source: JobSource) => void;
  clinicName: string;
  onClinicNameChange: (name: string) => void;
  clinicSuggestions: ClinicProfile[];
  recentClinics: ClinicProfile[];
  onApplyClinic: (profile: ClinicProfile) => void;
  appliedClinicProfile: ClinicProfile | null;
  clinicNameError?: string;
  sourceError?: string;
}

export function CampaignSection({
  source,
  onSourceChange,
  clinicName,
  onClinicNameChange,
  clinicSuggestions,
  recentClinics,
  onApplyClinic,
  appliedClinicProfile,
  clinicNameError,
  sourceError,
}: CampaignSectionProps) {
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  return (
    <section className="emh-section">
      <h2 className="emh-section-title">Campaign</h2>

      <div className="emh-field">
        <label className="emh-label emh-label-required">Job Source</label>
        <div className="emh-source-grid">
          {JOB_SOURCES.map((s) => (
            <button
              type="button"
              key={s}
              className={`emh-source-card${source === s ? " selected" : ""}`}
              onClick={() => onSourceChange(s)}
            >
              {s}
            </button>
          ))}
        </div>
        {sourceError && <div className="emh-field-error">{sourceError}</div>}
      </div>

      <div className="emh-field emh-suggestions">
        <label className="emh-label emh-label-required" htmlFor="clinicName">
          Clinic Name
        </label>
        <input
          id="clinicName"
          className="emh-input"
          type="text"
          value={clinicName}
          placeholder="e.g. Better Hearing Center"
          autoComplete="off"
          onChange={(e) => {
            onClinicNameChange(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
        />
        {showSuggestions && clinicSuggestions.length > 0 && (
          <div className="emh-suggestion-list">
            {clinicSuggestions.map((c) => (
              <div
                key={c.id}
                className="emh-suggestion-item"
                onMouseDown={() => onApplyClinic(c)}
              >
                {c.clinicName}
              </div>
            ))}
          </div>
        )}
        {clinicNameError && <div className="emh-field-error">{clinicNameError}</div>}

        {appliedClinicProfile && (
          <div className="emh-callout emh-callout-info">
            Loaded saved info for <strong>{appliedClinicProfile.clinicName}</strong> — review
            before sending. Deployment dates are never reused.
          </div>
        )}

        {!clinicName && recentClinics.length > 0 && (
          <div className="emh-recent-clinics">
            {recentClinics.map((c) => (
              <button
                type="button"
                key={c.id}
                className="emh-recent-chip"
                onClick={() => onApplyClinic(c)}
              >
                {c.clinicName}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
