/** Shared domain types for Baddie Casino. */

export type CharacterId = "raven" | "miko" | "blaze" | "seraph";

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

/**
 * What the camera is doing. Not every phase should be a stroking-hand shot —
 * some are just for looking at her.
 */
export type ShotKind =
  | "pace-mirror"
  | "body"
  | "face"
  | "full";

export interface PaceSegment {
  kind: PhaseKind;
  /** Target beats per minute for this segment. */
  bpm: number;
  durationMs: number;
  /** Arc length of the pace-mirror hand stroke, in px. Longer = slower, fuller strokes. */
  strokeLength: number;
  /** Which of her hand poses to use. */
  grip: "open" | "mid" | "closed";
  /** Framing for this segment. Defaults to pace-mirror when omitted. */
  shot?: ShotKind;
  label: string;
}

/** Camera framing per shot type: zoom plus focal offset in viewBox units. */
export interface ShotFraming {
  zoom: number;
  offsetX: number;
  offsetY: number;
  /**
   * Vertical object-position of the portrait, in percent from the top.
   * ~40 keeps face + chest in frame on wide desktop crops; ~12 was hair-only.
   */
  focusY: number;
  showArm: boolean;
  /** Slow drift added on top, for the admiring shots. */
  drift: number;
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

/**
 * Describes a set of generated PNGs for one character.
 *
 * Text-to-image models cannot reliably produce cleanly separated animation
 * layers, so the rig is built around *variants of an identical framing*
 * instead: the same pose regenerated with only one feature changed. The engine
 * cross-fades between them, which reads as blinking and talking without any
 * layer separation at all.
 */
export interface RigShot {
  /** Full image for this framing. */
  base: string;
  /**
   * Region of the source image to show, in source pixels.
   *
   * This is the main way to keep generation costs down: render one tall
   * full-body image and derive the wide, waist-up and face framings by
   * cropping it. Because every variant shares the same crop, they stay
   * perfectly aligned.
   */
  crop?: { x: number; y: number; width: number; height: number };
  /**
   * Same pose, same framing, one feature changed. Every entry is optional —
   * whatever is missing simply doesn't animate.
   */
  variants?: {
    eyesClosed?: string;
    mouthOpen?: string;
    mouthWide?: string;
    blushHeavy?: string;
    ahegao?: string;
  };
  /**
   * Genuinely separated transparent layers, if you can produce them. The arm
   * layer is what enables the stroking pace mirror on real art.
   */
  layers?: {
    hair?: string;
    arm?: string;
  };
  /** Pivot for the arm layer, in image pixels. */
  armPivot?: { x: number; y: number };
}

export interface RigManifest {
  /** Native pixel size every image in this manifest shares. */
  width: number;
  height: number;
  /** Keyed by outfit layer index, then shot kind. */
  outfits: Record<
    string,
    {
      name: string;
      shots: Partial<Record<ShotKind, RigShot>>;
    }
  >;
  /** Subtle vertical breathing amplitude as a fraction of height. */
  breathing?: number;
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
  /** Backdrop used on the select and collection screens. */
  homeBackground: string;
  chapters: number;
}
