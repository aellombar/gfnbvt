import type { PhaseKind, ShotFraming, ShotKind } from "@/lib/types";

/**
 * Framing per shot type. Only `pace-mirror` shows her stroking hand — the
 * others exist so a session can spend time simply looking at her.
 */
export const SHOT_FRAMING: Record<ShotKind, ShotFraming> = {
  "pace-mirror": {
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
    focusY: 40,
    showArm: true,
    drift: 0,
  },
  body: { zoom: 1, offsetX: 0, offsetY: 0, focusY: 38, showArm: false, drift: 0.2 },
  face: { zoom: 1.02, offsetX: 0, offsetY: 0, focusY: 30, showArm: false, drift: 0.1 },
  full: { zoom: 1, offsetX: 0, offsetY: 0, focusY: 42, showArm: false, drift: 0.12 },
};

/** Sensible default framing when a segment doesn't name one. */
export const DEFAULT_SHOT: Record<PhaseKind, ShotKind> = {
  warmup: "body",
  groove: "full",
  push: "pace-mirror",
  sprint: "pace-mirror",
  rest: "body",
  finish: "face",
  aftercare: "body",
};

export function resolveShot(
  phase: PhaseKind,
  shot: ShotKind | undefined,
  paceMirrorEnabled: boolean,
): ShotKind {
  const resolved = shot ?? DEFAULT_SHOT[phase];
  // Respect the player's setting without losing the shot variety.
  if (resolved === "pace-mirror" && !paceMirrorEnabled) return "full";
  return resolved;
}

export const SHOT_LABELS: Record<ShotKind, string> = {
  "pace-mirror": "Follow her hand",
  body: "Look at her",
  face: "Watch her face",
  full: "With her",
};
