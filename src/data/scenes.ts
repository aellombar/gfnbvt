import type { Difficulty, PaceSegment, Scene } from "@/lib/types";

/**
 * Scenes are mostly Sprint. Warmup is short, rest beats are brief breathers
 * rather than denial, and the finish arrives while the pace is still high.
 */
export const SCENES: Scene[] = [
  {
    id: "raven-first-timer",
    character: "raven",
    chapter: 1,
    title: "Last Call",
    tier: "tease",
    outfit: "Dealer Lace",
    background: "booth",
    ahegao: "late",
    intensity: ["Gentle pace", "~4 min", "1 breather", "Light finish"],
    paceMirror: true,
    segments: [
      { kind: "warmup", bpm: 58, durationMs: 26000, strokeLength: 190, grip: "open", label: "Settle in" },
      { kind: "groove", bpm: 78, durationMs: 34000, strokeLength: 170, grip: "mid", label: "Find the rhythm" },
      { kind: "push", bpm: 102, durationMs: 40000, strokeLength: 140, grip: "mid", label: "Faster for her" },
      { kind: "rest", bpm: 48, durationMs: 9000, strokeLength: 200, grip: "open", label: "Breathe" },
      { kind: "sprint", bpm: 126, durationMs: 52000, strokeLength: 110, grip: "closed", label: "Don't stop" },
      { kind: "finish", bpm: 138, durationMs: 22000, strokeLength: 95, grip: "closed", label: "Let go" },
      { kind: "aftercare", bpm: 44, durationMs: 20000, strokeLength: 210, grip: "open", label: "Come down" },
    ],
    peels: { 2: 1, 4: 2 },
  },
  {
    id: "raven-private-booth",
    character: "raven",
    chapter: 2,
    title: "After Close",
    tier: "standard",
    outfit: "Lace Lounge",
    background: "booth",
    ahegao: "progressive",
    intensity: ["Fast", "~6 min", "1 breather", "Heavy finish"],
    paceMirror: true,
    segments: [
      { kind: "warmup", bpm: 62, durationMs: 22000, strokeLength: 185, grip: "open", label: "Settle in" },
      { kind: "groove", bpm: 84, durationMs: 32000, strokeLength: 165, grip: "mid", label: "Steady" },
      { kind: "push", bpm: 110, durationMs: 44000, strokeLength: 135, grip: "mid", label: "Pick it up" },
      { kind: "sprint", bpm: 132, durationMs: 60000, strokeLength: 105, grip: "closed", label: "Fast" },
      { kind: "rest", bpm: 50, durationMs: 10000, strokeLength: 200, grip: "open", label: "Breathe" },
      { kind: "sprint", bpm: 142, durationMs: 66000, strokeLength: 92, grip: "closed", label: "Faster" },
      { kind: "finish", bpm: 150, durationMs: 26000, strokeLength: 82, grip: "closed", label: "Let go" },
      { kind: "aftercare", bpm: 44, durationMs: 22000, strokeLength: 210, grip: "open", label: "Come down" },
    ],
    peels: { 2: 1, 3: 2, 5: 3 },
  },
  {
    id: "raven-velvet-room",
    character: "raven",
    chapter: 3,
    title: "Before Her Shift",
    tier: "premium",
    outfit: "Velvet Private",
    background: "velvet",
    ahegao: "progressive",
    intensity: ["Very fast", "~8 min", "1 breather", "Long finish"],
    paceMirror: true,
    segments: [
      { kind: "warmup", bpm: 64, durationMs: 20000, strokeLength: 180, grip: "open", label: "Settle in" },
      { kind: "groove", bpm: 90, durationMs: 30000, strokeLength: 160, grip: "mid", label: "Steady" },
      { kind: "push", bpm: 116, durationMs: 46000, strokeLength: 130, grip: "mid", label: "Keep up" },
      { kind: "sprint", bpm: 138, durationMs: 70000, strokeLength: 100, grip: "closed", label: "Fast" },
      { kind: "rest", bpm: 52, durationMs: 9000, strokeLength: 195, grip: "open", label: "Breathe" },
      { kind: "sprint", bpm: 148, durationMs: 78000, strokeLength: 88, grip: "closed", label: "Faster" },
      { kind: "sprint", bpm: 156, durationMs: 44000, strokeLength: 78, grip: "closed", label: "Don't stop" },
      { kind: "finish", bpm: 160, durationMs: 30000, strokeLength: 72, grip: "closed", label: "Let go" },
      { kind: "aftercare", bpm: 42, durationMs: 26000, strokeLength: 215, grip: "open", label: "Come down" },
    ],
    peels: { 2: 1, 3: 2, 5: 3 },
  },
  {
    id: "miko-for-luck",
    character: "miko",
    chapter: 1,
    title: "For Luck",
    tier: "tease",
    outfit: "Shrine White",
    background: "shrine",
    ahegao: "late",
    intensity: ["Gentle pace", "~4 min", "1 breather", "Light finish"],
    paceMirror: true,
    segments: [
      { kind: "warmup", bpm: 60, durationMs: 24000, strokeLength: 190, grip: "open", label: "Settle in" },
      { kind: "groove", bpm: 80, durationMs: 34000, strokeLength: 170, grip: "mid", label: "Find the rhythm" },
      { kind: "push", bpm: 104, durationMs: 40000, strokeLength: 140, grip: "mid", label: "A little faster" },
      { kind: "rest", bpm: 48, durationMs: 9000, strokeLength: 200, grip: "open", label: "Breathe" },
      { kind: "sprint", bpm: 128, durationMs: 54000, strokeLength: 108, grip: "closed", label: "Don't stop" },
      { kind: "finish", bpm: 140, durationMs: 22000, strokeLength: 94, grip: "closed", label: "Let go" },
      { kind: "aftercare", bpm: 46, durationMs: 20000, strokeLength: 205, grip: "open", label: "Come down" },
    ],
    peels: { 2: 1, 4: 2 },
  },
  {
    id: "miko-closing-blessing",
    character: "miko",
    chapter: 2,
    title: "Closing Blessing",
    tier: "standard",
    outfit: "Good Kimono",
    background: "shrine",
    ahegao: "progressive",
    intensity: ["Fast", "~6 min", "1 breather", "Heavy finish"],
    paceMirror: true,
    segments: [
      { kind: "warmup", bpm: 64, durationMs: 22000, strokeLength: 185, grip: "open", label: "Settle in" },
      { kind: "groove", bpm: 86, durationMs: 32000, strokeLength: 162, grip: "mid", label: "Steady" },
      { kind: "push", bpm: 112, durationMs: 44000, strokeLength: 132, grip: "mid", label: "Faster please" },
      { kind: "sprint", bpm: 134, durationMs: 62000, strokeLength: 102, grip: "closed", label: "Fast" },
      { kind: "rest", bpm: 50, durationMs: 10000, strokeLength: 198, grip: "open", label: "Breathe" },
      { kind: "sprint", bpm: 144, durationMs: 68000, strokeLength: 90, grip: "closed", label: "Faster" },
      { kind: "finish", bpm: 152, durationMs: 26000, strokeLength: 80, grip: "closed", label: "Let go" },
      { kind: "aftercare", bpm: 46, durationMs: 22000, strokeLength: 208, grip: "open", label: "Come down" },
    ],
    peels: { 2: 1, 3: 2, 5: 3 },
  },
];

export function getScene(id: string): Scene | undefined {
  return SCENES.find((scene) => scene.id === id);
}

/**
 * Difficulty only reshapes pacing — it never adds edging or denial.
 * Soft is slower and shorter, Intense is faster with a briefer breather.
 */
const DIFFICULTY_TUNING: Record<
  Difficulty,
  { bpm: number; sprint: number; rest: number; other: number }
> = {
  soft: { bpm: 0.86, sprint: 0.8, rest: 1.3, other: 0.9 },
  standard: { bpm: 1, sprint: 1, rest: 1, other: 1 },
  intense: { bpm: 1.12, sprint: 1.3, rest: 0.6, other: 1 },
};

export function applyDifficulty(
  segments: PaceSegment[],
  difficulty: Difficulty,
  skipWarmup: boolean,
): PaceSegment[] {
  const tuning = DIFFICULTY_TUNING[difficulty];

  return segments
    .filter((segment) => !(skipWarmup && segment.kind === "warmup"))
    .map((segment) => {
      const scale =
        segment.kind === "sprint" || segment.kind === "finish"
          ? tuning.sprint
          : segment.kind === "rest"
            ? tuning.rest
            : tuning.other;

      // Aftercare stays gentle no matter the tier.
      const bpmScale = segment.kind === "aftercare" ? 1 : tuning.bpm;

      return {
        ...segment,
        bpm: Math.round(segment.bpm * bpmScale),
        durationMs: Math.round(segment.durationMs * scale),
        strokeLength: Math.round(segment.strokeLength / bpmScale),
      };
    });
}
