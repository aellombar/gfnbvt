"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CharacterView } from "@/components/visual/CharacterView";
import { LineText } from "@/components/dialogue/LineText";
import { useSession } from "@/lib/joi/useSession";
import { PHASE_COMMANDS } from "@/lib/joi/artStates";
import { resolveShot, SHOT_LABELS } from "@/lib/art/shots";
import type { CharacterProfile, Difficulty, Mood, Scene } from "@/lib/types";

interface JoiPlayerProps {
  scene: Scene;
  profile: CharacterProfile;
  difficulty: Difficulty;
  mood: Mood;
  petName: string;
  baseSpeed: number;
  pulseVolume: number;
  ambientVolume: number;
  paceMirror: boolean;
  skipWarmup: boolean;
  externallyPaused: boolean;
  onComplete: (summary: { elapsedMs: number; peakBpm: number }) => void;
  onExit: (progress: number) => void;
}

function timecode(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  const f = String(Math.floor((ms % 1000) / 40)).padStart(2, "0");
  return `${m}:${s}:${f}`;
}

export function JoiPlayer({
  scene,
  profile,
  difficulty,
  mood,
  petName,
  baseSpeed,
  pulseVolume,
  ambientVolume,
  paceMirror,
  skipWarmup,
  externallyPaused,
  onComplete,
  onExit,
}: JoiPlayerProps) {
  const [ready, setReady] = useState(false);
  const [manualPause, setManualPause] = useState(false);
  const borderRef = useRef<HTMLDivElement | null>(null);

  const { state, start, setPaused, strokePosition, beatPhase } = useSession({
    scene,
    difficulty,
    mood,
    petName,
    baseSpeed,
    pulseVolume,
    ambientVolume,
    skipWarmup,
    onComplete,
  });

  useEffect(() => {
    setPaused(externallyPaused || manualPause);
  }, [externallyPaused, manualPause, setPaused]);

  const intensity = Math.min(1, Math.max(0, (state.bpm - 55) / 105));

  // Pulse-synced frame edge, updated per frame so it stays locked to audio.
  useEffect(() => {
    if (!state.started) return;
    let raf = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const el = borderRef.current;
      if (!el) return;
      const swell = (1 - Math.cos(beatPhase() * Math.PI * 2)) / 2;
      el.style.opacity = String(0.25 + swell * (0.35 + intensity * 0.4));
      el.style.transform = `scale(${(1 - swell * 0.004).toFixed(4)})`;
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [beatPhase, intensity, state.started]);

  const begin = useCallback(async () => {
    await start();
    setReady(true);
  }, [start]);

  const command = PHASE_COMMANDS[state.segment.kind];
  const paused = externallyPaused || manualPause;
  const shot = resolveShot(
    state.segment.kind,
    state.segment.shot,
    paceMirror && scene.paceMirror,
  );
  const signal = profile.theme.primary;

  if (!ready) {
    return (
      <div
        data-signal
        style={{ ["--signal" as string]: signal }}
        className="flex min-h-dvh items-center justify-center p-4 sm:p-8"
      >
        <div className="w-full max-w-2xl">
          <div className="flex items-end justify-between border-b border-rule pb-3">
            <p className="tag" style={{ color: signal }}>
              [ {profile.name} · ch {String(scene.chapter).padStart(2, "0")} ]
            </p>
            <p className="tag">{difficulty}</p>
          </div>

          <h2 className="display mt-6 text-5xl sm:text-6xl">{scene.title}</h2>

          <div className="mt-8 border-l-2 pl-4" style={{ borderColor: signal }}>
            <p className="display text-2xl">Hands off the screen</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-paper-dim">
              Nothing to click from here. Follow her hand and her voice — she
              sets the pace, tells you when to go faster, and tells you when to
              finish.
            </p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-paper-dim">
              Prop your phone up or go fullscreen. Press{" "}
              <span className="data text-paper">ESC</span> at any time to hide
              everything instantly.
            </p>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-px border border-rule bg-rule sm:grid-cols-4">
            {scene.intensity.map((item) => (
              <div key={item} className="bg-ink-2 px-3 py-3">
                <dd className="text-[11px] uppercase tracking-[0.1em]">
                  {item}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={begin} className="btn-paper flex-1">
              Start — she takes over
            </button>
            <button
              type="button"
              onClick={() => onExit(0)}
              className="btn-ghost"
            >
              Not yet
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      data-signal
      style={{ ["--signal" as string]: signal }}
      className="relative min-h-dvh overflow-hidden"
    >
      <div className="absolute inset-0">
        <CharacterView
          profile={profile}
          art={state.art}
          outfitLayer={state.outfitLayer}
          background={scene.background}
          speaking={state.speaking}
          strokePosition={strokePosition}
          beatPhase={beatPhase}
          shot={shot}
          intensity={intensity}
          animate={!paused}
        />
      </div>

      {/* Beat-synced frame edge. */}
      <div
        ref={borderRef}
        className="pointer-events-none absolute inset-2 border sm:inset-3"
        style={{ borderColor: signal }}
      />

      {/* Top-left: broadcast state. Top-right: controls. */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5 sm:p-7">
        <div className="flex items-center gap-3">
          <span className="rec-dot" style={{ background: signal }} />
          <div>
            <p className="data text-[11px] tracking-[0.18em]">
              {timecode(state.elapsedMs)}
            </p>
            <p className="tag mt-0.5">
              {profile.name} · ch {String(scene.chapter).padStart(2, "0")}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="text-right">
            <p className="data text-[11px] tracking-[0.18em]">
              {Math.round(state.bpm)} BPM
            </p>
            <p className="tag mt-0.5" style={{ color: signal }}>
              {SHOT_LABELS[shot]}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setManualPause((p) => !p)}
            aria-label={manualPause ? "Resume" : "Pause"}
            className="tag border border-rule px-2 py-1 hover:text-paper"
          >
            {manualPause ? "▶" : "II"}
          </button>
        </div>
      </div>

      {/* Phase label, set vertically down the left edge. */}
      <p
        className="tag absolute left-5 top-1/2 hidden -translate-y-1/2 sm:block"
        style={{
          writingMode: "vertical-rl",
          letterSpacing: "0.3em",
          color: signal,
        }}
      >
        {state.segment.label}
      </p>

      {/* Command word. */}
      <div className="pointer-events-none absolute inset-x-0 top-[38%] text-center">
        <p
          className="display chroma text-[17vw] leading-none sm:text-[9rem]"
          style={{
            color: "#ece7dd",
            opacity: state.segment.kind === "aftercare" ? 0.3 : 0.5,
          }}
        >
          {command}
        </p>
      </div>

      {/* Lower third. */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="bg-gradient-to-t from-ink via-ink/92 to-transparent px-5 pb-5 pt-28 sm:px-7">
          <div className="mx-auto w-full max-w-4xl">
            <div className="min-h-[7.5rem]">
              {state.currentLine && (
                <div
                  key={state.currentLine.at}
                  className="animate-[cut-in_180ms_steps(3,end)_both]"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-ink"
                      style={{ background: signal }}
                    >
                      {profile.name}
                    </span>
                    {state.currentLine.kind === "thought" && (
                      <span className="tag">thinking</span>
                    )}
                  </div>

                  {state.currentLine.kind === "thought" ? (
                    <p className="text-xl italic leading-snug text-paper-dim sm:text-2xl">
                      {state.currentLine.display}
                    </p>
                  ) : (
                    <p
                      className={
                        state.currentLine.kind === "interrupt"
                          ? "border-l-2 pl-3"
                          : ""
                      }
                      style={{
                        borderColor: signal,
                        textShadow: "0 2px 20px rgba(0,0,0,0.9)",
                      }}
                    >
                      <LineText
                        text={state.currentLine.display}
                        profile={profile}
                        petName={petName}
                      />
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Segmented progress: one cell per phase, filled as you go. */}
        <div className="flex h-1.5 w-full gap-px bg-ink">
          <div
            className="h-full"
            style={{ width: `${state.progress * 100}%`, background: signal }}
          />
          <div className="h-full flex-1 bg-rule" />
        </div>
      </div>

      {paused && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-ink/92">
          <div className="slab-signal w-full max-w-sm p-6">
            <p className="tag">[ paused ]</p>
            <p className="display mt-3 text-3xl">She&apos;ll wait</p>
            <p className="mt-3 text-sm text-paper-dim">
              Take your time. Nothing is lost.
            </p>
            <button
              type="button"
              onClick={() => setManualPause(false)}
              className="btn-paper mt-6 w-full"
            >
              Back to her
            </button>
            <button
              type="button"
              onClick={() => onExit(state.progress)}
              className="btn-ghost mt-2 w-full"
            >
              Leave session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
