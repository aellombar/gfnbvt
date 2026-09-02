/** Shared domain types for Baddie Casino. */

export type CharacterId = "raven" | "miko";

export type Mood = "playful" | "clingy" | "sleepy" | "hyped";

export type Difficulty = "soft" | "standard" | "intense";

export type ResponseStyle = "sweet" | "flirty" | "cocky" | "shy" | "honest";

/** Pace phases. None of these require player input — hands stay off the screen. */
export type PhaseKind =
  | "warmup"
  | "groove"
  | "push"
  | "sprint"
  | "rest"
  | "finish"
  | "aftercare";

/** How far a scene lets her face come undone. */
export type AhegaoProfile = "none" | "late" | "progressive";

/** Composited face/body state, resolved per line and per phase. */
export interface ArtState {
  body: string;
  head: string;
  eyes: string;
  mouth: string;
  blush: "none" | "light" | "medium" | "heavy";
  drool: boolean;
  tears: boolean;
  /** Colour grade applied by the lighting shader. */
  grade: PhaseKind;
  /** Extra body tremble at peak intensity. */
  tremble: number;
  arched: boolean;
}

export interface PaceSegment {
  kind: PhaseKind;
  /** Target beats per minute for this segment. */
  bpm: number;
  durationMs: number;
  /** Arc length of the pace-mirror hand stroke, in px. Longer = slower, fuller strokes. */
  strokeLength: number;
  /** Which of her hand poses to use. */
  grip: "open" | "mid" | "closed";
  label: string;
}

export interface Scene {
  id: string;
  character: CharacterId;
  chapter: number;
  title: string;
  tier: "tease" | "standard" | "premium" | "afterhours";
  outfit: string;
  background: string;
  ahegao: AhegaoProfile;
  /** Human-readable warnings shown on the scene card before you commit. */
  intensity: string[];
  paceMirror: boolean;
  segments: PaceSegment[];
  /** Outfit layer revealed as the session progresses, keyed by segment index. */
  peels: Record<number, number>;
}

export interface Line {
  id: string;
  text: string;
  kind?: "spoken" | "thought" | "interrupt";
  /** Restrict this line to particular moods. Empty means any mood. */
  moods?: Mood[];
  art?: Partial<ArtState>;
}

export interface CharacterLines {
  phases: Record<PhaseKind, Line[]>;
  milestones: Record<25 | 50 | 75 | 90, Line[]>;
  peels: Line[];
}

export interface ChoiceOption {
  style: ResponseStyle;
  text: string;
  affection?: number;
  /** Minimum affection before this option becomes selectable. */
  requiresAffection?: number;
  reply: string;
}

export interface ConversationBeat {
  /** Narration or her dialogue leading into the choice. */
  lines: Line[];
  choice?: {
    prompt: string;
    options: ChoiceOption[];
  };
}

export interface Chapter {
  chapter: number;
  character: CharacterId;
  title: string;
  sceneId: string;
  pre: ConversationBeat[];
  post: ConversationBeat[];
}

export interface CharacterProfile {
  id: CharacterId;
  name: string;
  archetype: string;
  /** One-line pitch shown on the select screen. */
  tagline: string;
  petNames: string[];
  /** Accent colours drive the whole UI theme while she is on screen. */
  theme: { primary: string; secondary: string; glow: string };
  /** Hue rotation applied to the placeholder rig so each girl reads differently. */
  rig: {
    hair: string;
    hairBack: string;
    skin: string;
    outfit: string;
    outfitTrim: string;
    eyes: string;
  };
  /** Ambient lounge tone, in Hz, layered under her scenes. */
  ambientHz: number;
  chapters: number;
}
