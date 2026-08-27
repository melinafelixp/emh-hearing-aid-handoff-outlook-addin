import * as React from "react";
import { SeedResult } from "../../lib/types";

interface SeedPreviewSectionProps {
  seeds: SeedResult;
}

export function SeedPreviewSection({ seeds }: SeedPreviewSectionProps) {
  return (
    <section className="emh-section">
      <h2 className="emh-section-title">Seed Preview</h2>
      <div className="emh-seed-columns">
        <div>
          <label className="emh-label">Test Seeds</label>
          <ul className="emh-seed-list">
            {seeds.testSeeds.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
        <div>
          <label className="emh-label">Live Seeds</label>
          <ul className="emh-seed-list">
            {seeds.liveSeeds.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
        {seeds.firstDeploymentOnlySeeds.length > 0 && (
          <div>
            <label className="emh-label">First Deployment Only</label>
            <ul className="emh-seed-list">
              {seeds.firstDeploymentOnlySeeds.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
