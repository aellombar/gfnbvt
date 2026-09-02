"use client";

import { useState } from "react";

export function AgeGate({ onVerified }: { onVerified: () => void }) {
  const [declined, setDeclined] = useState(false);

  if (declined) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-6">
        <div className="slab max-w-sm p-8">
          <p className="tag">[ signal ended ]</p>
          <h1 className="display mt-4 text-3xl">Come back another time</h1>
          <p className="mt-4 text-sm text-paper-dim">
            Adults only. Thanks for being straight with us.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden p-4 sm:p-8">
      {/* Standby colour bars, cropped to a hairline strip. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex h-2">
        {["#ece7dd", "#ffc531", "#7de3ff", "#3ec96b", "#ff2f6d", "#2a2a33"].map(
          (colour) => (
            <span key={colour} className="flex-1" style={{ background: colour }} />
          ),
        )}
      </div>

      <div className="w-full max-w-2xl">
        <div className="flex items-end justify-between border-b border-rule pb-3">
          <p className="tag">[ ch 01 · after hours ]</p>
          <p className="tag">18+ only</p>
        </div>

        <h1 className="display chroma mt-6 text-[15vw] leading-[0.82] sm:text-[7.5rem]">
          Baddie
          <br />
          Casino
        </h1>

        <div className="mt-8 grid gap-6 sm:grid-cols-[1fr_auto]">
          <div className="max-w-md space-y-3 text-sm leading-relaxed text-paper-dim">
            <p>
              An 18+ hands-free pacing game with fictional, AI-generated adult
              characters. Sexual themes throughout.
            </p>
            <p>
              Simulated gambling with virtual chips only. There is no
              real-money wagering of any kind.
            </p>
            <p className="text-paper-dim/70">
              Entering confirms you are at least 18, or the legal age of
              majority where you live — whichever is greater.
            </p>
          </div>

          <div className="flex flex-col justify-end gap-2">
            <button type="button" onClick={onVerified} className="btn-paper">
              Enter — I am 18+
            </button>
            <button
              type="button"
              onClick={() => setDeclined(true)}
              className="btn-ghost"
            >
              Take me out
            </button>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-3 border-t border-rule pt-3">
          <span className="rec-dot" />
          <p className="tag">standby · press enter to begin transmission</p>
        </div>
      </div>
    </div>
  );
}
