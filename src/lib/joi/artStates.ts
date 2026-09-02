import type { AhegaoProfile, ArtState, PhaseKind } from "@/lib/types";

/**
 * The escalation ladder. Face and body state are derived from the phase and
 * how far through the session you are, so she visibly comes undone as the
 * pace climbs rather than snapping between two static expressions.
 */
const LADDER: Record<PhaseKind, ArtState> = {
  warmup: {
    body: "lean",
    head: "forward",
    eyes: "open",
    mouth: "closed",
    blush: "none",
    drool: false,
    tears: false,
    grade: "warmup",
    tremble: 0,
    arched: false,
  },
  groove: {
    body: "lean",
    head: "tilted",
    eyes: "soft",
    mouth: "slight",
    blush: "light",
    drool: false,
    tears: false,
    grade: "groove",
    tremble: 0,
    arched: false,
  },
  push: {
    body: "closer",
    head: "tilted",
    eyes: "half",
    mouth: "open",
    blush: "medium",
    drool: false,
    tears: false,
    grade: "push",
    tremble: 0.2,
    arched: false,
  },
  sprint: {
    body: "closer",
    head: "tilted",
    eyes: "crossed",
    mouth: "wide",
    blush: "heavy",
    drool: false,
    tears: false,
    grade: "sprint",
    tremble: 0.6,
    arched: true,
  },
  rest: {
    body: "lean",
    head: "forward",
    eyes: "soft",
    mouth: "slight",
    blush: "medium",
    drool: false,
    tears: false,
    grade: "rest",
    tremble: 0.1,
    arched: false,
  },
  finish: {
    body: "reveal",
    head: "tilted",
    eyes: "rolled",
    mouth: "tongue",
    blush: "heavy",
    drool: true,
    tears: true,
    grade: "finish",
    tremble: 1,
    arched: true,
  },
  aftercare: {
    body: "lean",
    head: "forward",
    eyes: "watery",
    mouth: "slight",
    blush: "medium",
    drool: false,
    tears: false,
    grade: "aftercare",
    tremble: 0.05,
    arched: false,
  },
};

/** Softer face set used when a scene opts out of the full ladder. */
const CAPPED: Partial<Record<PhaseKind, Partial<ArtState>>> = {
  sprint: { eyes: "half", mouth: "open", tremble: 0.3, arched: false },
  finish: {
    eyes: "half",
    mouth: "open",
    drool: false,
    tears: false,
    tremble: 0.4,
  },
};

export function artStateFor(
  phase: PhaseKind,
  profile: AhegaoProfile,
  progress: number,
): ArtState {
  const base = { ...LADDER[phase] };

  if (profile === "none") {
    return { ...base, ...(CAPPED[phase] ?? {}) };
  }

  if (profile === "late") {
    // Everything stays composed until the finish itself.
    if (phase !== "finish") return { ...base, ...(CAPPED[phase] ?? {}) };
    return base;
  }

  // Progressive: ease the sprint face further as the session runs on.
  if (phase === "sprint" && progress < 0.55) {
    return { ...base, eyes: "half", tremble: 0.35, arched: false };
  }
  return base;
}

/** Blend factor for the blush/sweat overlays. */
export function blushAlpha(blush: ArtState["blush"]): number {
  switch (blush) {
    case "light":
      return 0.28;
    case "medium":
      return 0.55;
    case "heavy":
      return 0.85;
    default:
      return 0;
  }
}

export const PHASE_COMMANDS: Record<PhaseKind, string> = {
  warmup: "SLOW",
  groove: "STEADY",
  push: "FASTER",
  sprint: "DON'T STOP",
  rest: "BREATHE",
  finish: "LET GO",
  aftercare: "EASY",
};

/** Per-phase colour grade. Cool at the start, hot in the middle, gold at the end. */
export const PHASE_GRADE: Record<PhaseKind, { tint: string; bloom: number }> = {
  warmup: { tint: "#5b7cff", bloom: 0.08 },
  groove: { tint: "#a86bff", bloom: 0.12 },
  push: { tint: "#ff5fa2", bloom: 0.2 },
  sprint: { tint: "#ff2e79", bloom: 0.34 },
  rest: { tint: "#7be3c4", bloom: 0.1 },
  finish: { tint: "#ffcf6b", bloom: 0.55 },
  aftercare: { tint: "#8a7bd8", bloom: 0.1 },
};
