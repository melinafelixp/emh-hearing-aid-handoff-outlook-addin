import * as React from "react";
import { SubmitState } from "../hooks/useCampaignForm";

interface FormActionsProps {
  isValid: boolean;
  submitState: SubmitState;
  submitError: string;
  onSubmit: () => void;
  onReset: () => void;
}

export function FormActions({ isValid, submitState, submitError, onSubmit, onReset }: FormActionsProps) {
  const [confirmingReset, setConfirmingReset] = React.useState(false);

  return (
    <section>
      {submitState === "error" && submitError && <div className="emh-error-banner">{submitError}</div>}
      {submitState === "success" && (
        <div className="emh-success-banner">Handoff email created — review it in Outlook before sending.</div>
      )}

      <button
        type="button"
        className="emh-primary-cta"
        disabled={!isValid || submitState === "submitting"}
        onClick={onSubmit}
      >
        {submitState === "submitting" ? "Creating Handoff Email…" : "Create Handoff Email"}
      </button>

      {!confirmingReset ? (
        <button type="button" className="emh-secondary-action" onClick={() => setConfirmingReset(true)}>
          Reset Campaign
        </button>
      ) : (
        <div className="emh-callout emh-callout-warning" style={{ marginTop: 8 }}>
          <strong>Reset the entire campaign?</strong> This clears all fields (saved clinic profiles are
          kept).
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button
              type="button"
              className="emh-btn emh-btn-secondary"
              onClick={() => {
                onReset();
                setConfirmingReset(false);
              }}
            >
              Yes, reset
            </button>
            <button
              type="button"
              className="emh-btn emh-btn-secondary"
              onClick={() => setConfirmingReset(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
