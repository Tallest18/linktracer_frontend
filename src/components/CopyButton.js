import { useState } from 'react';

export function CopyButton({ text, className = '' }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }
  return (
    <button onClick={copy} title={copied ? 'Copied!' : 'Copy'}
      className={`p-1.5 rounded transition-all ${copied ? 'text-em-400' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-700'} ${className}`}>
      {copied ? (
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
          <path d="M2 7l4 4 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
          <rect x="4.5" y="4.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M9.5 4.5V3.5a1 1 0 00-1-1h-5a1 1 0 00-1 1v5a1 1 0 001 1H4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      )}
    </button>
  );
}
