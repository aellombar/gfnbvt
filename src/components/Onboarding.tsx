"use client";

import { useEffect, useRef, useState } from "react";
import { CharacterStage } from "@/components/visual/CharacterStage";
import { PaceEngine } from "@/lib/joi/PaceEngine";
import { artStateFor } from "@/lib/joi/artStates";
import { CHARACTERS } from "@/data/characters";
import { useGameStore } from "@/stores/gameStore";

const STEPS = [
  {
    title: "You don't click during a session",
    body: "Once a scene starts there is nothing to press. Your hands are busy. She sets the pace and tells you what to do.",
  },
  {
    title: "Follow her hand",
    body: "She strokes the air in time with the pulse. Copy her — the length of her stroke matters as much as the speed.",
  },
  {
    title: "Listen for the pulse",
    body: "A warm heartbeat keeps the rhythm. It speeds up when she wants you faster and softens for short breathers.",
  },
] as const;

/** A short tutorial with the real pace engine running, so the feel lands immediately. */
export function Onboarding() {
  const setPlayerName = useGameStore((s) => s.setPlayerName);
  const setPetName = useGameStore((s) => s.setPetName);

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [pet, setPet] = useState("good boy");
  const [demoing, setDemoing] = useState(false);

  const engineRef = useRef<PaceEngine | null>(null);
  const profile = CHARACTERS.raven;
  const art = artStateFor(demoing ? "push" : "groove", "none", 0);

  useEffect(() => {
    return () => {
      void engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, []);

  const startDemo = async () => {
    if (engineRef.current) return;
    const engine = new PaceEngine();
    engineRef.current = engine;
    await engine.init();
    engine.setAccent(profile.ambientHz);
    engine.setVolumes({ pulse: 0.7, ambient: 0.3 });
    engine.setBpm(74, 0);
    engine.start();
    setDemoing(true);
    // Ease up so the tempo change is audible and visible.
    setTimeout(() => engine.setBpm(104, 6000), 3500);
  };

  const finish = () => {
    void engineRef.current?.dispose();
    engineRef.current = null;
    setPlayerName(name.trim() || "you");
    setPetName(pet.trim() || "good boy");
  };

  const isLast = step === STEPS.length;

  return (
    <main className="relative min-h-dvh overflow-hidden">
      <div className="absolute inset-0 opacity-70">
        <CharacterStage
          profile={profile}
          art={art}
          outfitLayer={0}
          background="booth"
          speaking={false}
          strokePosition={() => engineRef.current?.strokePosition() ?? 0}
          beatPhase={() => engineRef.current?.beatPhase() ?? 0}
          paceMirror={demoing}
          intensity={demoing ? 0.5 : 0}
          animate
        />
      </div>

      <div className="relative flex min-h-dvh items-end justify-center p-4 sm:items-center sm:p-8">
        <div className="panel w-full max-w-lg rounded-3xl p-6 sm:p-8">
          {!isLast ? (
            <>
              <p className="text-xs uppercase tracking-[0.24em] text-blush">
                Step {step + 1} of {STEPS.length}
              </p>
              <h2 className="mt-3 text-2xl font-semibold">{STEPS[step].title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                {STEPS[step].body}
              </p>

              {step === 1 && !demoing && (
                <button
                  type="button"
                  onClick={startDemo}
                  className="mt-5 w-full rounded-xl border border-blush/50 bg-blush/10 px-5 py-3 text-sm font-medium transition hover:bg-blush/20"
                >
                  Show me — start the pulse
                </button>
              )}
              {step === 1 && demoing && (
                <p className="mt-4 text-xs text-mint">
                  That&apos;s the rhythm. Watch it climb.
                </p>
              )}

              <div className="mt-7 flex gap-3">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="rounded-xl border border-white/15 px-5 py-3 text-sm text-white/60 transition hover:bg-white/5"
                  >
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  className="flex-1 rounded-xl bg-blush px-5 py-3 text-sm font-semibold text-ink transition hover:bg-ember"
                >
                  {step === STEPS.length - 1 ? "Almost done" : "Next"}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs uppercase tracking-[0.24em] text-blush">
                Last thing
              </p>
              <h2 className="mt-3 text-2xl font-semibold">
                What should she call you?
              </h2>

              <label className="mt-5 block">
                <span className="mb-2 block text-xs text-white/60">
                  Your name (optional)
                </span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-xl border border-white/12 bg-black/30 px-4 py-2.5 text-sm outline-none focus:border-blush/60"
                />
              </label>

              <label className="mt-4 block">
                <span className="mb-2 block text-xs text-white/60">
                  Pet name she uses when she praises you
                </span>
                <input
                  value={pet}
                  onChange={(event) => setPet(event.target.value)}
                  placeholder="good boy"
                  className="w-full rounded-xl border border-white/12 bg-black/30 px-4 py-2.5 text-sm outline-none focus:border-blush/60"
                />
              </label>

              <button
                type="button"
                onClick={finish}
                className="mt-7 w-full rounded-xl bg-blush px-5 py-3.5 text-sm font-semibold text-ink transition hover:bg-ember"
              >
                Take me to the floor
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
