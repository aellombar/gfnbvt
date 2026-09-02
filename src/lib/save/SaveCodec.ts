import type { CharacterId, Difficulty, ResponseStyle } from "@/lib/types";

export const SAVE_VERSION = 1;

export interface CharacterProgress {
  chapter: number;
  affection: number;
  completedScenes: string[];
  unlockedOutfits: string[];
  styleCounts: Partial<Record<ResponseStyle, number>>;
}

export interface SaveStats {
  sessionsCompleted: number;
  longestSessionMs: number;
  peakBpm: number;
  streakDays: number;
  lastPlayedDay: number;
}

export interface SaveSettings {
  pulseVolume: number;
  voiceVolume: number;
  ambientVolume: number;
  /** Global BPM multiplier so her "fast" matches your fast. */
  baseSpeed: number;
  difficulty: Difficulty;
  paceMirror: boolean;
  skipCasino: boolean;
  skipWarmup: boolean;
}

export interface SaveState {
  version: number;
  playerName: string;
  petName: string;
  chips: number;
  characters: Record<CharacterId, CharacterProgress>;
  settings: SaveSettings;
  stats: SaveStats;
}

const CHARACTER_ORDER: CharacterId[] = ["raven", "miko"];
const STYLE_ORDER: ResponseStyle[] = [
  "sweet",
  "flirty",
  "cocky",
  "shy",
  "honest",
];
const DIFFICULTY_ORDER: Difficulty[] = ["soft", "standard", "intense"];

/** Crockford base32 — no I, L, O or U, so codes survive being retyped by hand. */
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const DECODE_MAP = (() => {
  const map = new Map<string, number>();
  for (let i = 0; i < ALPHABET.length; i += 1) map.set(ALPHABET[i], i);
  // Forgive the characters we deliberately excluded.
  map.set("I", 1);
  map.set("L", 1);
  map.set("O", 0);
  map.set("U", map.get("V") ?? 27);
  return map;
})();

export function createEmptySave(): SaveState {
  const character = (): CharacterProgress => ({
    chapter: 1,
    affection: 0,
    completedScenes: [],
    unlockedOutfits: [],
    styleCounts: {},
  });

  return {
    version: SAVE_VERSION,
    playerName: "",
    petName: "good boy",
    chips: 200,
    characters: { raven: character(), miko: character() },
    settings: {
      pulseVolume: 0.8,
      voiceVolume: 0.9,
      ambientVolume: 0.4,
      baseSpeed: 1,
      difficulty: "standard",
      paceMirror: true,
      skipCasino: false,
      skipWarmup: false,
    },
    stats: {
      sessionsCompleted: 0,
      longestSessionMs: 0,
      peakBpm: 0,
      streakDays: 0,
      lastPlayedDay: 0,
    },
  };
}

/**
 * Save state is flattened into a delimited string rather than JSON so the
 * resulting code stays short enough to retype or read off a screenshot.
 */
function serialize(state: SaveState): string {
  const chars = CHARACTER_ORDER.map((id) => {
    const c = state.characters[id];
    const styles = STYLE_ORDER.map((s) => c.styleCounts[s] ?? 0).join(",");
    return [
      c.chapter,
      c.affection,
      c.completedScenes.join(","),
      c.unlockedOutfits.join(","),
      styles,
    ].join(";");
  }).join("~");

  const s = state.settings;
  const settings = [
    Math.round(s.pulseVolume * 100),
    Math.round(s.voiceVolume * 100),
    Math.round(s.ambientVolume * 100),
    Math.round(s.baseSpeed * 100),
    DIFFICULTY_ORDER.indexOf(s.difficulty),
    s.paceMirror ? 1 : 0,
    s.skipCasino ? 1 : 0,
    s.skipWarmup ? 1 : 0,
  ].join(";");

  const t = state.stats;
  const stats = [
    t.sessionsCompleted,
    Math.round(t.longestSessionMs / 1000),
    Math.round(t.peakBpm),
    t.streakDays,
    t.lastPlayedDay,
  ].join(";");

  return [
    state.version,
    state.playerName,
    state.petName,
    state.chips,
    chars,
    settings,
    stats,
  ].join("|");
}

function deserialize(raw: string): SaveState {
  const [version, playerName, petName, chips, chars, settings, stats] =
    raw.split("|");
  const base = createEmptySave();

  base.version = Number(version) || SAVE_VERSION;
  base.playerName = playerName ?? "";
  base.petName = petName || "good boy";
  base.chips = Number(chips) || 0;

  (chars ?? "").split("~").forEach((chunk, index) => {
    const id = CHARACTER_ORDER[index];
    if (!id || !chunk) return;
    const [chapter, affection, completed, outfits, styles] = chunk.split(";");
    const styleValues = (styles ?? "").split(",");
    base.characters[id] = {
      chapter: Number(chapter) || 1,
      affection: Number(affection) || 0,
      completedScenes: completed ? completed.split(",").filter(Boolean) : [],
      unlockedOutfits: outfits ? outfits.split(",").filter(Boolean) : [],
      styleCounts: Object.fromEntries(
        STYLE_ORDER.map((s, i) => [s, Number(styleValues[i]) || 0]),
      ),
    };
  });

  if (settings) {
    const [pulse, voice, ambient, speed, difficulty, mirror, casino, warmup] =
      settings.split(";").map(Number);
    base.settings = {
      pulseVolume: (pulse ?? 80) / 100,
      voiceVolume: (voice ?? 90) / 100,
      ambientVolume: (ambient ?? 40) / 100,
      baseSpeed: (speed ?? 100) / 100,
      difficulty: DIFFICULTY_ORDER[difficulty] ?? "standard",
      paceMirror: mirror !== 0,
      skipCasino: casino === 1,
      skipWarmup: warmup === 1,
    };
  }

  if (stats) {
    const [sessions, longest, bpm, streak, lastDay] = stats
      .split(";")
      .map(Number);
    base.stats = {
      sessionsCompleted: sessions || 0,
      longestSessionMs: (longest || 0) * 1000,
      peakBpm: bpm || 0,
      streakDays: streak || 0,
      lastPlayedDay: lastDay || 0,
    };
  }

  return base;
}

function toBase32(bytes: Uint8Array): string {
  let bits = 0;
  let value = 0;
  let output = "";
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) output += ALPHABET[(value << (5 - bits)) & 31];
  return output;
}

function fromBase32(input: string): Uint8Array {
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const char of input) {
    const index = DECODE_MAP.get(char);
    if (index === undefined) throw new Error(`Invalid character "${char}"`);
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Uint8Array.from(out);
}

function checksum(payload: string): string {
  let sum = 0;
  for (let i = 0; i < payload.length; i += 1) {
    sum = (sum + payload.charCodeAt(i) * (i + 1)) % 32;
  }
  return ALPHABET[sum];
}

function group(payload: string): string {
  return payload.match(/.{1,5}/g)?.join("-") ?? payload;
}

/** Turn a save into a readable, checksummed transfer code. */
export function encodeSave(state: SaveState): string {
  const bytes = new TextEncoder().encode(serialize(state));
  const payload = toBase32(bytes);
  return `BADDIE-${group(payload)}-${checksum(payload)}`;
}

export class SaveCodeError extends Error {}

/** Parse a transfer code. Throws SaveCodeError on typos or version mismatch. */
export function decodeSave(code: string): SaveState {
  const cleaned = code.trim().toUpperCase().replace(/\s+/g, "");
  if (!cleaned.startsWith("BADDIE-")) {
    throw new SaveCodeError("That does not look like a Baddie Casino code.");
  }

  const body = cleaned.slice("BADDIE-".length).replace(/-/g, "");
  if (body.length < 2) throw new SaveCodeError("That code is too short.");

  const payload = body.slice(0, -1);
  const provided = body.slice(-1);
  if (checksum(payload) !== provided) {
    throw new SaveCodeError("That code has a typo in it — check and re-enter.");
  }

  let state: SaveState;
  try {
    state = deserialize(new TextDecoder().decode(fromBase32(payload)));
  } catch {
    throw new SaveCodeError("That code could not be read.");
  }

  if (state.version > SAVE_VERSION) {
    throw new SaveCodeError("That code is from a newer version of the game.");
  }
  return state;
}

/** Short human summary shown before an import overwrites a slot. */
export function describeSave(state: SaveState): string {
  const parts = CHARACTER_ORDER.map((id) => {
    const c = state.characters[id];
    const name = id === "raven" ? "Raven" : "Miko";
    return `${name} Ch.${c.chapter}`;
  });
  const outfits = CHARACTER_ORDER.reduce(
    (total, id) => total + state.characters[id].unlockedOutfits.length,
    0,
  );
  return `${parts.join(" · ")} · ${outfits} outfits · ${state.chips} chips`;
}
