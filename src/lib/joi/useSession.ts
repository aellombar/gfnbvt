"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PaceEngine } from "@/lib/joi/PaceEngine";
import { LinePool } from "@/lib/dialogue/LinePool";
import { applyTokens } from "@/lib/dialogue/text";
import { artStateFor } from "@/lib/joi/artStates";
import { applyDifficulty } from "@/data/scenes";
import { LINES } from "@/data";
import { CHARACTERS } from "@/data/characters";
import type {
  ArtState,
  Difficulty,
  Line,
  Mood,
  PaceSegment,
  Scene,
} from "@/lib/types";

/** How often she speaks during each phase. Faster pace, more encouragement. */
const LINE_INTERVAL_MS: Record<PaceSegment["kind"], number> = {
  warmup: 7000,
  groove: 6500,
  push: 5500,
  sprint: 4200,
  rest: 5000,
  finish: 3400,
  aftercare: 6000,
};

/** How long her mouth keeps moving after a new line appears. */
const SPEAKING_MS = 1500;

const MILESTONES = [25, 50, 75, 90] as const;

export interface SpokenLine extends Line {
  /** Display text with the pet name already substituted in. */
  display: string;
  at: number;
}

export interface SessionState {
  started: boolean;
  finished: boolean;
  paused: boolean;
  segment: PaceSegment;
  segmentIndex: number;
  /** 0..1 across the whole session. */
  progress: number;
  elapsedMs: number;
  totalMs: number;
  bpm: number;
  art: ArtState;
  currentLine: SpokenLine | null;
  speaking: boolean;
  outfitLayer: number;
  peakBpm: number;
}

export interface UseSessionOptions {
  scene: Scene;
  difficulty: Difficulty;
  mood: Mood;
  petName: string;
  baseSpeed: number;
  pulseVolume: number;
  ambientVolume: number;
  skipWarmup: boolean;
  onComplete: (summary: { elapsedMs: number; peakBpm: number }) => void;
}

export function useSession(options: UseSessionOptions) {
  const {
    scene,
    difficulty,
    mood,
    petName,
    baseSpeed,
    pulseVolume,
    ambientVolume,
    skipWarmup,
    onComplete,
  } = options;

  const segments = useMemo(
    () => applyDifficulty(scene.segments, difficulty, skipWarmup),
    [scene.segments, difficulty, skipWarmup],
  );

  const totalMs = useMemo(
    () => segments.reduce((sum, s) => sum + s.durationMs, 0),
    [segments],
  );

  const lines = LINES[scene.character];

  const engineRef = useRef<PaceEngine | null>(null);
  const poolRef = useRef<LinePool>(new LinePool(8));

  // Volatile values the animation loop needs without restarting.
  const moodRef = useRef(mood);
  const petNameRef = useRef(petName);
  const baseSpeedRef = useRef(baseSpeed);
  const onCompleteRef = useRef(onComplete);
  const pausedRef = useRef(false);

  useEffect(() => {
    moodRef.current = mood;
    petNameRef.current = petName;
    baseSpeedRef.current = baseSpeed;
    onCompleteRef.current = onComplete;
  }, [mood, petName, baseSpeed, onComplete]);

  const [started, setStarted] = useState(false);
  const [state, setState] = useState<SessionState>(() => ({
    started: false,
    finished: false,
    paused: false,
    segment: segments[0],
    segmentIndex: 0,
    progress: 0,
    elapsedMs: 0,
    totalMs,
    bpm: segments[0].bpm,
    art: artStateFor(segments[0].kind, scene.ahegao, 0),
    currentLine: null,
    speaking: false,
    outfitLayer: 0,
    peakBpm: 0,
  }));

  /** Resolve which segment a given elapsed time falls inside. */
  const locate = useCallback(
    (elapsed: number) => {
      let acc = 0;
      for (let i = 0; i < segments.length; i += 1) {
        acc += segments[i].durationMs;
        if (elapsed < acc) return i;
      }
      return segments.length - 1;
    },
    [segments],
  );

  const start = useCallback(async () => {
    if (engineRef.current) return;
    const engine = new PaceEngine();
    engineRef.current = engine;
    await engine.init();
    engine.setAccent(CHARACTERS[scene.character].ambientHz);
    engine.setVolumes({ pulse: pulseVolume, ambient: ambientVolume });
    engine.setBpm(segments[0].bpm * baseSpeedRef.current, 0);
    engine.start();
    setStarted(true);
  }, [ambientVolume, pulseVolume, scene.character, segments]);

  // The whole session loop lives here so it can be a plain local function.
  useEffect(() => {
    if (!started) return;

    const ahegao = scene.ahegao;
    const peels = scene.peels;
    const pool = poolRef.current;
    pool.reset();

    let raf = 0;
    let last = 0;
    let elapsed = 0;
    let lineAt = 0;
    let lastLineTime = -SPEAKING_MS;
    let segmentIndex = -1;
    let peakBpm = 0;
    let done = false;
    const milestones = new Set<number>();

    let pendingLine: SpokenLine | null = null;

    const speak = (pick: Line[]) => {
      const picked = pool.pick(pick, moodRef.current);
      if (!picked) return;
      pendingLine = {
        ...picked,
        display: applyTokens(picked.text, petNameRef.current),
        at: Date.now(),
      };
      lineAt = elapsed;
      lastLineTime = elapsed;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);

      const delta = last ? now - last : 0;
      last = now;
      if (pausedRef.current || done) return;

      elapsed = Math.min(totalMs, elapsed + delta);
      const index = locate(elapsed);
      const segment = segments[index];
      const progress = totalMs > 0 ? elapsed / totalMs : 0;

      const peelLayers = Object.values(peels);
      const maxPeel = peelLayers.length ? Math.max(0, ...peelLayers) : 3;
      let nextLayer = Math.min(maxPeel, Math.floor(progress * (maxPeel + 0.001)));
      if (index !== segmentIndex) {
        segmentIndex = index;
        const targetBpm = segment.bpm * baseSpeedRef.current;
        peakBpm = Math.max(peakBpm, targetBpm);
        engineRef.current?.setBpm(
          targetBpm,
          segment.kind === "rest" || segment.kind === "aftercare" ? 3200 : 2200,
        );

        const peel = peels[index];
        if (peel !== undefined) {
          nextLayer = Math.max(nextLayer, peel);
          speak(lines.peels);
        } else {
          speak(lines.phases[segment.kind]);
        }
      }

      // Milestone encouragement, once each.
      const pct = Math.floor(progress * 100);
      for (const milestone of MILESTONES) {
        if (pct >= milestone && !milestones.has(milestone)) {
          milestones.add(milestone);
          speak(lines.milestones[milestone]);
        }
      }

      // Regular praise cadence for the current phase.
      if (elapsed - lineAt >= LINE_INTERVAL_MS[segment.kind]) {
        speak(lines.phases[segment.kind]);
      }

      const engine = engineRef.current;
      const bpm = engine ? engine.currentBpm() : segment.bpm * baseSpeedRef.current;
      const speaking = elapsed - lastLineTime < SPEAKING_MS;
      const line = pendingLine;
      pendingLine = null;

      setState((prev) => ({
        ...prev,
        started: true,
        segment,
        segmentIndex: index,
        progress,
        elapsedMs: elapsed,
        bpm,
        speaking,
        art: artStateFor(segment.kind, ahegao, progress),
        currentLine: line ?? prev.currentLine,
        outfitLayer: Math.max(nextLayer, prev.outfitLayer),
        peakBpm,
      }));

      if (elapsed >= totalMs) {
        done = true;
        engineRef.current?.stop();
        setState((prev) => ({ ...prev, finished: true }));
        onCompleteRef.current({
          elapsedMs: elapsed,
          peakBpm: Math.round(peakBpm),
        });
      }
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [started, segments, totalMs, locate, lines, scene.ahegao, scene.peels]);

  const setPaused = useCallback((paused: boolean) => {
    pausedRef.current = paused;
    const engine = engineRef.current;
    if (engine) {
      if (paused) engine.stop();
      else engine.start();
    }
    setState((prev) =>
      prev.paused === paused ? prev : { ...prev, paused },
    );
  }, []);

  const stop = useCallback(() => {
    void engineRef.current?.dispose();
    engineRef.current = null;
  }, []);

  useEffect(() => {
    engineRef.current?.setVolumes({
      pulse: pulseVolume,
      ambient: ambientVolume,
    });
  }, [pulseVolume, ambientVolume]);

  useEffect(() => stop, [stop]);

  /** Live 0..1 stroke position for the pace mirror, read every frame. */
  const strokePosition = useCallback(
    () => engineRef.current?.strokePosition() ?? 0,
    [],
  );

  const beatPhase = useCallback(() => engineRef.current?.beatPhase() ?? 0, []);

  return { state, start, stop, setPaused, strokePosition, beatPhase, segments };
}
