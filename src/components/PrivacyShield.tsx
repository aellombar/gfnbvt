"use client";

import { useEffect, useState } from "react";

/**
 * Esc swaps the whole screen for something neutral and kills audio instantly.
 * Any key brings you back exactly where you were.
 */
export function PrivacyShield({
  onToggle,
}: {
  onToggle: (hidden: boolean) => void;
}) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !hidden) {
        event.preventDefault();
        setHidden(true);
        onToggle(true);
        return;
      }
      if (hidden) {
        event.preventDefault();
        setHidden(false);
        onToggle(false);
      }
    };

    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [hidden, onToggle]);

  if (!hidden) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#f6f7f9] text-[#1f2328]"
      onClick={() => {
        setHidden(false);
        onToggle(false);
      }}
    >
      <div className="mx-auto max-w-3xl px-8 py-14">
        <div className="h-3 w-40 rounded bg-[#dfe3e8]" />
        <div className="mt-8 space-y-3">
          {[92, 76, 88, 61, 84, 70, 90, 54].map((width, index) => (
            <div
              key={index}
              className="h-3 rounded bg-[#e8ebef]"
              style={{ width: `${width}%` }}
            />
          ))}
        </div>
        <div className="mt-10 h-32 rounded-lg bg-[#eef1f4]" />
        <p className="mt-10 font-mono text-[10px] tracking-[0.2em] text-[#98a2ad]">
          PRESS ANY KEY TO RESUME
        </p>
      </div>
    </div>
  );
}
