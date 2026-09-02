"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CharacterStage } from "@/components/visual/CharacterStage";
import { useSession } from "@/lib/joi/useSession";
import { PHASE_COMMANDS } from "@/lib/joi/artStates";
import type {
  CharacterProfile,
  Difficulty,
  Mood,
  Scene,
} from "@/lib/types";

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

function formatTime(ms: number): string {
  const total = Math.round(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
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

  // Intensity drives camera push-in, trail and glow. Normalised from BPM.
  const intensity = Math.min(1, Math.max(0, (state.bpm - 55) / 105));

  // Breathing border, updated per frame so it stays locked to the pulse.
  useEffect(() => {
    if (!state.started) return;
    let raf = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const el = borderRef.current;
      if (!el) return;
      const phase = beatPhase();
      const swell = (1 - Math.cos(phase * Math.PI * 2)) / 2;
      const spread = 12 + swell * (26 + intensity * 40);
      const alpha = 0.22 + swell * (0.2 + intensity * 0.3);
      el.style.boxShadow = `inset 0 0 ${spread}px ${spread / 2}px ${profile.theme.primary}${Math.round(
        alpha * 255,
      )
        .toString(16)
        .padStart(2, "0")}`;
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [beatPhase, intensity, profile.theme.primary, state.started]);

  const begin = useCallback(async () => {
    await start();
    setReady(true);
  }, [start]);

  const command = PHASE_COMMANDS[state.segment.kind];
  const paused = externallyPaused || manualPause;

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-6">
        <div className="panel max-w-lg rounded-3xl p-8 text-center">
          <p
            className="text-xs font-semibold uppercase tracking-[0.28em]"
            style={{ color: profile.theme.primary }}
          >
            {profile.name} · {scene.title}
          </p>
          <h2 className="mt-4 text-2xl font-semibold">Hands off the screen</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            From here on there is nothing to click. Follow her hand and her
            voice — she sets the pace, tells you when to go faster, and tells
            you when to finish.
          </p>
          <p className="mt-3 text-sm text-white/50">
            Prop your phone up or go fullscreen. Press{" "}
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-xs">Esc</kbd>{" "}
            at any time to hide everything instantly.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {scene.intensity.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/15 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-white/60"
              >
                {tag}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={begin}
            className="mt-8 w-full rounded-xl bg-blush px-5 py-3.5 text-sm font-semibold text-ink transition hover:bg-ember"
          >
            Start — she takes over
          </button>
          <button
            type="button"
            onClick={() => onExit(0)}
            className="mt-3 w-full rounded-xl border border-white/15 px-5 py-2.5 text-sm text-white/60 transition hover:bg-white/5"
          >
            Not yet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="absolute inset-0">
        <CharacterStage
          profile={profile}
          art={state.art}
          outfitLayer={state.outfitLayer}
          background={scene.background}
          speaking={state.speaking}
          strokePosition={strokePosition}
          beatPhase={beatPhase}
          paceMirror={paceMirror && scene.paceMirror}
          intensity={intensity}
          animate={!paused}
        />
      </div>

      {/* Pulse-synced border glow. */}
      <div ref={borderRef} className="pointer-events-none absolute inset-0" />

      {/* Top status strip. */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-6">
        <div className="panel-soft rounded-xl px-3 py-2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">
            {state.segment.label}
          </p>
          <p className="text-sm font-semibold tabular-nums text-white/85">
            {Math.round(state.bpm)} bpm
          </p>
        </div>

        <button
          type="button"
          onClick={() => setManualPause((p) => !p)}
          aria-label={manualPause ? "Resume" : "Pause"}
          className="panel-soft rounded-xl px-3 py-2 text-xs text-white/60 transition hover:text-white"
        >
          {manualPause ? "Resume" : "Pause"}
        </button>
      </div>

      {/* Command word. Big, readable at arm's length. */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
        <p
          className="text-glow text-5xl font-black tracking-[0.12em] sm:text-7xl"
          style={{
            color: profile.theme.primary,
            opacity: state.segment.kind === "aftercare" ? 0.35 : 0.55,
          }}
        >
          {command}
        </p>
      </div>

      {/* Her line. */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/85 to-transparent px-4 pb-6 pt-24 sm:px-8">
        <div className="mx-auto w-full max-w-3xl">
          <div className="min-h-[5.5rem]">
            {state.currentLine && (
              <p
                key={state.currentLine.at}
                className={`animate-[fade-up_320ms_ease-out_both] text-2xl leading-snug sm:text-3xl ${
                  state.currentLine.kind === "thought"
                    ? "italic text-white/50"
                    : "font-medium text-white"
                }`}
              >
                {state.currentLine.display}
              </p>
            )}
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span className="text-[11px] tabular-nums text-white/40">
              {formatTime(state.elapsedMs)}
            </span>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full transition-[width] duration-500 ease-linear"
                style={{
                  width: `${state.progress * 100}%`,
                  background: `linear-gradient(90deg, ${profile.theme.secondary}, ${profile.theme.primary})`,
                }}
              />
            </div>
            <span className="text-[11px] tabular-nums text-white/40">
              {formatTime(state.totalMs)}
            </span>
          </div>
        </div>
      </div>

      {paused && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-ink/80 backdrop-blur-sm">
          <div className="panel rounded-2xl p-6 text-center">
            <p className="text-lg font-semibold">Paused</p>
            <p className="mt-2 text-sm text-white/60">
              She&apos;ll wait. Take your time.
            </p>
            <button
              type="button"
              onClick={() => setManualPause(false)}
              className="mt-5 rounded-xl bg-blush px-5 py-2.5 text-sm font-semibold text-ink"
            >
              Back to her
            </button>
            <button
              type="button"
              onClick={() => onExit(state.progress)}
              className="mt-2 block w-full rounded-xl border border-white/15 px-5 py-2 text-xs text-white/50 transition hover:bg-white/5"
            >
              Leave the session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
