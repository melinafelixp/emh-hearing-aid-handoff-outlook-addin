import * as React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App";
import "../styles/theme.css";

/* global Office */

Office.onReady(() => {
  const container = document.getElementById("app-root");
  if (!container) return;
  const root = createRoot(container);
  root.render(<App />);
});
