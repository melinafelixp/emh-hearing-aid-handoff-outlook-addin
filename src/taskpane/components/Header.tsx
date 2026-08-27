import * as React from "react";

/**
 * No logo file has been supplied yet. This renders a simple EMH wordmark
 * placeholder in the brand secondary color — swap the <div className="emh-header-mark">
 * for an <img src="../../assets/emh-logo.png" /> once a logo is provided.
 */
export function Header() {
  return (
    <header className="emh-header">
      <div className="emh-header-mark" aria-hidden="true">
        EMH
      </div>
      <div className="emh-header-text">
        <h1>Hearing Aid Campaign Handoff</h1>
        <p>Build and send campaign deployment details</p>
      </div>
    </header>
  );
}
