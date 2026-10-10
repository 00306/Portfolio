import { useState } from "react";
import "../styles/copyButton.css";

const COPIED_RESET_MS = 1600;

function CopyIcon() {
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true">
      <path d="M96 288V104a40 40 0 0 1 40-40h152" />
      <rect x="160" y="128" width="256" height="320" rx="40" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true">
      <path d="M112 272l96 96 192-224" />
    </svg>
  );
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), COPIED_RESET_MS);
    } catch {}
  };

  return (
    <button
      type="button"
      className="copy-button"
      onClick={copy}
      aria-label={copied ? "복사됨" : "복사"}
      title={copied ? "복사됨" : "복사"}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
}
