import * as React from "react";

interface EmailPreviewSectionProps {
  outlookSubject: string;
  html: string;
}

export function EmailPreviewSection({ outlookSubject, html }: EmailPreviewSectionProps) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <section className="emh-section">
      <button
        type="button"
        className="emh-preview-toggle"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        {expanded ? "▾" : "▸"} Preview Email
      </button>
      {expanded && (
        <div className="emh-preview-body">
          <div className="emh-helper" style={{ marginBottom: 8 }}>
            <strong>Subject:</strong> {outlookSubject || "—"}
          </div>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      )}
    </section>
  );
}
