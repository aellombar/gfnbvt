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

  const signal = profile.theme.primary;

  return (
    <div
      data-signal
      style={{ ["--signal" as string]: signal }}
      className="animate-[cut-in_180ms_steps(3,end)_both]"
    >
      <div className="flex items-end justify-between border-b border-rule pb-4">
        <div>
          <p className="tag" style={{ color: signal }}>
            [ {profile.name}&apos;s table ]
          </p>
          <h2 className="display mt-1 text-5xl">Her table</h2>
        </div>
        <button type="button" onClick={onClose} className="tag hover:text-paper">
          close
        </button>
      </div>

      <div className="mt-8 grid gap-px border border-rule bg-rule lg:grid-cols-[1fr_18rem]">
        {/* Reels. */}
        <div className="bg-ink-2 p-6">
          <div className="flex gap-px bg-rule">
            {reels.map((symbol, index) => (
              <div
                key={index}
                className="flex h-36 flex-1 items-center justify-center bg-ink text-6xl"
                style={{ color: signal }}
              >
                {symbol}
              </div>
            ))}
          </div>

          <div
            className="mt-6 border-l-2 pl-4"
            style={{ borderColor: signal }}
          >
            <p className="tag">she says</p>
            <p className="mt-1 min-h-[3rem] text-base italic text-paper-dim">
              {message}
            </p>
          </div>
        </div>

        {/* Controls. */}
        <div className="flex flex-col justify-between bg-ink-2 p-6">
          <div>
            <p className="tag">stake</p>
            <div className="mt-2 grid grid-cols-3 border border-rule">
              {[10, 25, 50].map((amount, index) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setBet(amount)}
                  className={`data py-2.5 text-xs transition-colors ${
                    index > 0 ? "border-l border-rule" : ""
                  }`}
                  style={
                    bet === amount
                      ? { background: signal, color: "#08080a" }
                      : undefined
                  }
                >
                  {amount}
                </button>
              ))}
            </div>

            <dl className="mt-6 space-y-2">
              {Object.entries(PAYOUTS).map(([symbol, multiplier]) => (
                <div
                  key={symbol}
                  className="flex items-baseline justify-between border-b border-rule pb-1"
                >
                  <dt className="text-sm" style={{ color: signal }}>
                    {symbol}{symbol}{symbol}
                  </dt>
                  <dd className="data text-[11px] text-paper-dim">
                    ×{multiplier}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={spin}
              disabled={spinning || chips < bet}
              className="btn-paper w-full"
            >
              {spinning
                ? "Spinning…"
                : chips < bet
                  ? "Not enough chips"
                  : `Spin · ${bet}`}
            </button>
            <p className="tag mt-3 normal-case tracking-normal">
              Virtual chips only — no real-money wagering. Three sevens takes
              you straight to her booth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
