import type { CharacterId, Mood } from "@/lib/types";

export const MOODS: Mood[] = ["playful", "clingy", "sleepy", "hyped"];

export const MOOD_LABELS: Record<Mood, string> = {
  playful: "Playful",
  clingy: "Clingy",
  sleepy: "Sleepy",
  hyped: "Hyped",
};

export const MOOD_BLURBS: Record<Mood, string> = {
  playful: "She's in a teasing mood tonight.",
  clingy: "She doesn't want you going anywhere.",
  sleepy: "Softer, slower, warmer than usual.",
  hyped: "She's wound up and impatient for you.",
};

/** Day index since epoch — moods roll over at local midnight. */
export function today(): number {
  const now = new Date();
  return Math.floor(
    new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() /
      86_400_000,
  );
}

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Deterministic per girl per day, so her mood is consistent across a session
 * and across reloads but genuinely different tomorrow.
 */
export function moodFor(character: CharacterId, day = today()): Mood {
  return MOODS[hash(`${character}:${day}`) % MOODS.length];
}
