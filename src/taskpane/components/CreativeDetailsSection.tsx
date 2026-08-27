import * as React from "react";

interface CreativeDetailsSectionProps {
  useCustomSubjectLine: boolean;
  onUseCustomSubjectLineChange: (value: boolean) => void;
  customSubjectLine: string;
  onCustomSubjectLineChange: (value: string) => void;
  resolvedSubjectLine: string;
  customSubjectLineError?: string;

  useCustomPht: boolean;
  onUseCustomPhtChange: (value: boolean) => void;
  customPht: string;
  onCustomPhtChange: (value: string) => void;
  resolvedPht: string;
  customPhtError?: string;
}

export function CreativeDetailsSection({
  useCustomSubjectLine,
  onUseCustomSubjectLineChange,
  customSubjectLine,
  onCustomSubjectLineChange,
  resolvedSubjectLine,
  customSubjectLineError,
  useCustomPht,
  onUseCustomPhtChange,
  customPht,
  onCustomPhtChange,
  resolvedPht,
  customPhtError,
}: CreativeDetailsSectionProps) {
  return (
    <section className="emh-section">
      <h2 className="emh-section-title">Email Creative Details</h2>

      <div className="emh-field">
        <label className="emh-label">Subject Line</label>
        <div className="emh-toggle-row">
          <input
            id="customSubjectToggle"
            type="checkbox"
            checked={useCustomSubjectLine}
            onChange={(e) => onUseCustomSubjectLineChange(e.target.checked)}
          />
          <label htmlFor="customSubjectToggle">Use Custom Subject Line (Other)</label>
        </div>
        {useCustomSubjectLine ? (
          <>
            <input
              className="emh-input"
              type="text"
              value={customSubjectLine}
              placeholder="Enter custom subject line"
              onChange={(e) => onCustomSubjectLineChange(e.target.value)}
            />
            {customSubjectLineError && <div className="emh-field-error">{customSubjectLineError}</div>}
          </>
        ) : (
          <div className="emh-input" style={{ background: "#f0f3f3", color: "#5a5f5c" }}>
            {resolvedSubjectLine}
          </div>
        )}
      </div>

      <div className="emh-field">
        <label className="emh-label">PHT (Preheader Text)</label>
        <div className="emh-toggle-row">
          <input
            id="customPhtToggle"
            type="checkbox"
            checked={useCustomPht}
            onChange={(e) => onUseCustomPhtChange(e.target.checked)}
          />
          <label htmlFor="customPhtToggle">Use Custom PHT (Other)</label>
        </div>
        {useCustomPht ? (
          <>
            <input
              className="emh-input"
              type="text"
              value={customPht}
              placeholder="Enter custom PHT"
              onChange={(e) => onCustomPhtChange(e.target.value)}
            />
            {customPhtError && <div className="emh-field-error">{customPhtError}</div>}
          </>
        ) : (
          <div className="emh-input" style={{ background: "#f0f3f3", color: "#5a5f5c" }}>
            {resolvedPht}
          </div>
        )}
      </div>
    </section>
  );
}
