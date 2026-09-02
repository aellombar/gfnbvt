"use client";

import { useEffect, useRef, useState } from "react";
import { CharacterView } from "@/components/visual/CharacterView";
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
        <CharacterView
          profile={profile}
          art={art}
          outfitLayer={0}
          background="booth"
          speaking={false}
          strokePosition={() => engineRef.current?.strokePosition() ?? 0}
          beatPhase={() => engineRef.current?.beatPhase() ?? 0}
          shot={demoing ? "pace-mirror" : "body"}
          intensity={demoing ? 0.5 : 0}
          animate
        />
      </div>

      <div
        data-signal
        style={{ ["--signal" as string]: profile.theme.primary }}
        className="relative flex min-h-dvh items-end justify-center p-4 sm:items-center sm:p-8"
      >
        <div className="slab-lift w-full max-w-lg p-6 sm:p-8">
          {!isLast ? (
            <>
              <div className="flex items-center justify-between border-b border-rule pb-3">
                <p className="tag" style={{ color: profile.theme.primary }}>
                  [ setup {step + 1}/{STEPS.length} ]
                </p>
                <div className="flex gap-1">
                  {STEPS.map((_, i) => (
                    <span
                      key={i}
                      className="h-1 w-6"
                      style={{
                        background:
                          i <= step
                            ? profile.theme.primary
                            : "var(--color-rule)",
                      }}
                    />
                  ))}
                </div>
              </div>

              <h2 className="display mt-5 text-4xl">{STEPS[step].title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-paper-dim">
                {STEPS[step].body}
              </p>

              {step === 1 && !demoing && (
                <button
                  type="button"
                  onClick={startDemo}
                  className="btn-ghost mt-6 w-full"
                >
                  Show me — start the pulse
                </button>
              )}
              {step === 1 && demoing && (
                <p
                  className="tag mt-5 normal-case tracking-normal"
                  style={{ color: "var(--color-signal-2)" }}
                >
                  That&apos;s the rhythm. Watch it climb.
                </p>
              )}

              <div className="mt-8 flex gap-2">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="btn-ghost"
                  >
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  className="btn-paper flex-1"
                >
                  {step === STEPS.length - 1 ? "Almost done" : "Next"}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="tag border-b border-rule pb-3" style={{ color: profile.theme.primary }}>
                [ last thing ]
              </p>
              <h2 className="display mt-5 text-4xl">
                What should she call you?
              </h2>

              <label className="mt-6 block">
                <span className="tag mb-2 block">your name (optional)</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="field"
                />
              </label>

              <label className="mt-4 block">
                <span className="tag mb-2 block">
                  pet name used when she praises you
                </span>
                <input
                  value={pet}
                  onChange={(event) => setPet(event.target.value)}
                  placeholder="good boy"
                  className="field"
                />
              </label>

              <button type="button" onClick={finish} className="btn-paper mt-8 w-full">
                Take me to the floor
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
