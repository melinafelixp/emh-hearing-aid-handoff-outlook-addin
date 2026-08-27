import * as React from "react";
import { formatLongDate } from "../../lib/dateUtils";

interface DeploymentSectionProps {
  firstDeploymentDate: string;
  onFirstDeploymentDateChange: (date: string) => void;
  secondDeploymentDate: string;
  useStandardQuantity: boolean;
  onUseStandardQuantityChange: (value: boolean) => void;
  emailsPerDeployment: number;
  onQuantityChange: (value: number) => void;
  firstDeploymentDateError?: string;
  quantityError?: string;
}

export function DeploymentSection({
  firstDeploymentDate,
  onFirstDeploymentDateChange,
  secondDeploymentDate,
  useStandardQuantity,
  onUseStandardQuantityChange,
  emailsPerDeployment,
  onQuantityChange,
  firstDeploymentDateError,
  quantityError,
}: DeploymentSectionProps) {
  return (
    <section className="emh-section">
      <h2 className="emh-section-title">Deployment</h2>

      <div className="emh-field">
        <label className="emh-label emh-label-required" htmlFor="firstDeployment">
          First Deployment Date
        </label>
        <input
          id="firstDeployment"
          className="emh-input"
          type="date"
          value={firstDeploymentDate}
          onChange={(e) => onFirstDeploymentDateChange(e.target.value)}
        />
        {firstDeploymentDateError && <div className="emh-field-error">{firstDeploymentDateError}</div>}
      </div>

      <div className="emh-field">
        <label className="emh-label">Second Deployment Date</label>
        <input
          className="emh-input"
          type="text"
          readOnly
          value={secondDeploymentDate ? formatLongDate(secondDeploymentDate) : "—"}
          style={{ background: "#f0f3f3", color: "#5a5f5c" }}
        />
        <div className="emh-helper">Automatically scheduled 14 days after Deployment 1.</div>
      </div>

      <div className="emh-field">
        <label className="emh-label">Emails per Deployment</label>
        <div className="emh-toggle-row">
          <input
            id="stdQty"
            type="checkbox"
            checked={useStandardQuantity}
            onChange={(e) => {
              const checked = e.target.checked;
              onUseStandardQuantityChange(checked);
              if (checked) onQuantityChange(25000);
            }}
          />
          <label htmlFor="stdQty">Use standard quantity — 25,000</label>
        </div>
        {!useStandardQuantity && (
          <input
            className="emh-input"
            type="number"
            min={1}
            step={1000}
            value={emailsPerDeployment}
            onChange={(e) => onQuantityChange(Number(e.target.value))}
          />
        )}
        {useStandardQuantity && (
          <div className="emh-helper">{emailsPerDeployment.toLocaleString("en-US")} emails per deployment.</div>
        )}
        {quantityError && <div className="emh-field-error">{quantityError}</div>}
      </div>
    </section>
  );
}
