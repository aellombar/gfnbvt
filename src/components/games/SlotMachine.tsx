"use client";

import { useCallback, useRef, useState } from "react";
import type { CharacterProfile } from "@/lib/types";

const SYMBOLS = ["♠", "♥", "♦", "♣", "★", "7"];
const PAYOUTS: Record<string, number> = {
  "7": 24,
  "★": 12,
  "♥": 8,
  "♦": 6,
  "♠": 5,
  "♣": 5,
};

interface SlotMachineProps {
  profile: CharacterProfile;
  chips: number;
  onChips: (delta: number) => void;
  onJackpot: () => void;
  onClose: () => void;
}

/**
 * The casino is the funnel, not the point. Wins buy chips and a jackpot drops
 * you straight into a session — she reacts live to every spin.
 */
export function SlotMachine({
  profile,
  chips,
  onChips,
  onJackpot,
  onClose,
}: SlotMachineProps) {
  const [reels, setReels] = useState(["♠", "♥", "♦"]);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState(
    `"Place something down, and I'll make it interesting."`,
  );
  const [bet, setBet] = useState(10);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const spin = useCallback(() => {
    if (spinning || chips < bet) return;
    setSpinning(true);
    onChips(-bet);
    setMessage(`"Let's see what you get…"`);

    const target = [0, 1, 2].map(
      () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    );

    // Near-miss flourish: the last reel settles a beat later than the others.
    timers.current.forEach(clearTimeout);
    timers.current = [];
    [0, 1, 2].forEach((slot) => {
      const shuffle = setInterval(() => {
        setReels((prev) => {
          const next = [...prev];
          next[slot] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          return next;
        });
      }, 70);

      const stop = setTimeout(
        () => {
          clearInterval(shuffle);
          setReels((prev) => {
            const next = [...prev];
            next[slot] = target[slot];
            return next;
          });

          if (slot === 2) {
            setSpinning(false);
            const [a, b, c] = target;
            if (a === b && b === c) {
              const win = bet * (PAYOUTS[a] ?? 5);
              onChips(win);
              if (a === "7") {
                setMessage(`"…Well now. Come with me, ${"sweetheart"}."`);
                setTimeout(onJackpot, 900);
              } else {
                setMessage(`"Three of a kind. +${win} chips. Lucky you."`);
              }
            } else if (a === b || b === c) {
              setMessage(`"Ooh — so close. Go again for me."`);
            } else {
              setMessage(`"Nothing. Stay a while, it'll turn around."`);
            }
          }
        },
        700 + slot * (slot === 2 ? 800 : 380),
      );
      timers.current.push(stop);
    });
  }, [bet, chips, onChips, onJackpot, spinning]);

  return (
    <div className="animate-[fade-up_320ms_ease-out_both] space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Her table</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-xs uppercase tracking-[0.2em] text-white/45 transition hover:text-white"
        >
          Close
        </button>
      </div>

      <div className="panel rounded-3xl p-6">
        <div className="flex justify-center gap-3">
          {reels.map((symbol, index) => (
            <div
              key={index}
              className="flex h-28 w-24 items-center justify-center rounded-2xl border text-5xl"
              style={{
                borderColor: `${profile.theme.primary}55`,
                background: "rgba(0,0,0,0.35)",
                color: profile.theme.primary,
              }}
            >
              {symbol}
            </div>
          ))}
        </div>

        <p className="mt-6 min-h-[2.5rem] text-center text-sm italic text-white/70">
          {message}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {[10, 25, 50].map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setBet(amount)}
              className={`rounded-xl border px-4 py-2 text-sm transition ${
                bet === amount
                  ? "border-blush bg-blush/15"
                  : "border-white/12 hover:bg-white/5"
              }`}
            >
              {amount}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={spin}
          disabled={spinning || chips < bet}
          className="mt-5 w-full rounded-xl bg-blush px-5 py-3.5 text-sm font-semibold text-ink transition hover:bg-ember disabled:opacity-40"
        >
          {spinning ? "Spinning…" : chips < bet ? "Not enough chips" : `Spin (${bet})`}
        </button>

        <p className="mt-4 text-center text-[11px] text-white/40">
          Virtual chips only — there is no real-money wagering. Three sevens
          takes you to her private booth.
        </p>
      </div>
    </div>
  );
}
