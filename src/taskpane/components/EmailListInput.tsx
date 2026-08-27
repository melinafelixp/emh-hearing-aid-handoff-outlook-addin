import * as React from "react";
import { isValidEmail } from "../../lib/validation";

interface EmailListInputProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function EmailListInput({ values, onChange, placeholder }: EmailListInputProps) {
  const [input, setInput] = React.useState("");

  const commit = () => {
    const parsed = input
      .split(/[\s,;]+/)
      .map((v) => v.trim())
      .filter(Boolean);
    if (parsed.length === 0) return;
    const merged = [...values];
    for (const email of parsed) {
      if (!merged.some((v) => v.toLowerCase() === email.toLowerCase())) merged.push(email);
    }
    onChange(merged);
    setInput("");
  };

  return (
    <div>
      <input
        className="emh-input"
        type="text"
        value={input}
        placeholder={placeholder ?? "name@example.com"}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
        }}
        onBlur={commit}
      />
      {values.length > 0 && (
        <div className="emh-chip-row">
          {values.map((email) => (
            <span
              className="emh-chip"
              key={email}
              style={!isValidEmail(email) ? { borderColor: "#b3261e", color: "#b3261e" } : undefined}
            >
              {email}
              <button
                type="button"
                aria-label={`Remove ${email}`}
                onClick={() => onChange(values.filter((v) => v !== email))}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
