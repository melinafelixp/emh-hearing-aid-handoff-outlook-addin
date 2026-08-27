import * as React from "react";
import { AttachmentInfo } from "../../lib/types";
import { addZipsToList } from "../../lib/zipUtils";

interface TargetingSectionProps {
  zipCodes: string[];
  onZipCodesChange: (zips: string[]) => void;
  countsAttachment: AttachmentInfo | null;
  onAttachCountsFile: (file: File) => void;
  onRemoveCountsFile: () => void;
  targetingError?: string;
  zipCodesError?: string;
}

export function TargetingSection({
  zipCodes,
  onZipCodesChange,
  countsAttachment,
  onAttachCountsFile,
  onRemoveCountsFile,
  targetingError,
  zipCodesError,
}: TargetingSectionProps) {
  const [zipInput, setZipInput] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const commitZipInput = () => {
    if (!zipInput.trim()) return;
    onZipCodesChange(addZipsToList(zipCodes, zipInput));
    setZipInput("");
  };

  return (
    <section className="emh-section">
      <h2 className="emh-section-title">Targeting</h2>

      <div className="emh-field">
        <label className="emh-label">ZIP Code Targeting</label>
        <input
          className="emh-input"
          type="text"
          placeholder="Paste one or more ZIPs, then press Enter"
          value={zipInput}
          onChange={(e) => setZipInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitZipInput();
            }
          }}
          onBlur={commitZipInput}
        />
        <div className="emh-helper">Comma- or newline-separated pastes are split automatically.</div>
        {zipCodes.length > 0 && (
          <div className="emh-chip-row">
            {zipCodes.map((zip) => (
              <span className="emh-chip" key={zip}>
                {zip}
                <button
                  type="button"
                  aria-label={`Remove ${zip}`}
                  onClick={() => onZipCodesChange(zipCodes.filter((z) => z !== zip))}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        {zipCodesError && <div className="emh-field-error">{zipCodesError}</div>}
      </div>

      <div className="emh-field">
        <label className="emh-label">Attach Counts File Instead</label>
        {countsAttachment ? (
          <div className="emh-attachment-row">
            <span className="emh-attachment-name emh-attachment-status-ok">
              ✓ {countsAttachment.fileName}
            </span>
            <button type="button" className="emh-btn emh-btn-link" onClick={onRemoveCountsFile}>
              Remove
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="emh-btn emh-btn-file"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose counts file…
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onAttachCountsFile(file);
            e.target.value = "";
          }}
        />
        <div className="emh-helper">Optional — used instead of, or alongside, manual ZIP entry.</div>
      </div>

      {targetingError && <div className="emh-field-error">{targetingError}</div>}
    </section>
  );
}
