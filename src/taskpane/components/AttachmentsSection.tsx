import * as React from "react";
import { AttachmentInfo } from "../../lib/types";

interface AttachmentsSectionProps {
  htmlAttachment: AttachmentInfo | null;
  onAttachHtml: (file: File) => void;
  onRemoveHtml: () => void;
  htmlAttachmentError?: string;
}

export function AttachmentsSection({
  htmlAttachment,
  onAttachHtml,
  onRemoveHtml,
  htmlAttachmentError,
}: AttachmentsSectionProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <section className="emh-section">
      <h2 className="emh-section-title">Attachments</h2>

      <div className="emh-field">
        <label className="emh-label emh-label-required">Campaign HTML</label>
        {htmlAttachment ? (
          <div className="emh-attachment-row">
            <span className="emh-attachment-name emh-attachment-status-ok">
              ✓ {htmlAttachment.fileName}
            </span>
            <button type="button" className="emh-btn emh-btn-link" onClick={onRemoveHtml}>
              Remove
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="emh-btn emh-btn-file"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose HTML file…
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".html,.htm"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onAttachHtml(file);
            e.target.value = "";
          }}
        />
        {!htmlAttachment && (
          <div className="emh-callout emh-callout-warning" style={{ marginTop: 8 }}>
            <strong>HTML Required</strong> — attach the final campaign HTML before creating the handoff
            email.
          </div>
        )}
        {htmlAttachmentError && <div className="emh-field-error">{htmlAttachmentError}</div>}
      </div>
    </section>
  );
}
