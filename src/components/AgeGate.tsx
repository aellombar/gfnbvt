"use client";

import { useState } from "react";

export function AgeGate({ onVerified }: { onVerified: () => void }) {
  const [declined, setDeclined] = useState(false);

  if (declined) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-6">
        <div className="panel max-w-md rounded-2xl p-8 text-center">
          <h1 className="text-xl font-semibold">Come back another time</h1>
          <p className="mt-3 text-sm text-white/60">
            This game is for adults only. Thanks for being honest.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center p-6">
      <div className="panel animate-[rise_520ms_cubic-bezier(0.16,1,0.3,1)_both] max-w-lg rounded-3xl p-8 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blush">
          Adults only
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Baddie Casino
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-white/70">
          This is an 18+ hands-free pacing game with fictional, AI-generated
          adult characters. It contains sexual themes and simulated gambling
          with virtual chips only — there is no real-money wagering.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/50">
          By entering you confirm you are at least 18 years old, or the legal
          age of majority where you live, whichever is greater.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onVerified}
            className="flex-1 rounded-xl bg-blush px-5 py-3 text-sm font-semibold text-ink transition hover:bg-ember focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            I am 18 or older — enter
          </button>
          <button
            type="button"
            onClick={() => setDeclined(true)}
            className="flex-1 rounded-xl border border-white/15 px-5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/5"
          >
            Take me out
          </button>
        </div>
      </div>
    </div>
  );
}
