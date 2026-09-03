import type { CharacterId, CharacterLines, Chapter } from "@/lib/types";
import { RAVEN_LINES } from "@/data/lines/raven";
import { MIKO_LINES } from "@/data/lines/miko";
import { BLAZE_LINES } from "@/data/lines/blaze";
import { SERAPH_LINES } from "@/data/lines/seraph";
import { RAVEN_CHAPTERS, RAVEN_REPLIES } from "@/data/chapters/raven";
import { MIKO_CHAPTERS, MIKO_REPLIES } from "@/data/chapters/miko";
import { BLAZE_CHAPTERS, BLAZE_REPLIES } from "@/data/chapters/blaze";
import { SERAPH_CHAPTERS, SERAPH_REPLIES } from "@/data/chapters/seraph";
import { BEACH_CHAPTERS } from "@/data/beach";
import { SCENES } from "@/data/scenes";

import { withGoonHeat } from "@/data/lines/goon";

export const LINES: Record<CharacterId, CharacterLines> = {
  raven: withGoonHeat("raven", RAVEN_LINES),
  miko: withGoonHeat("miko", MIKO_LINES),
  blaze: withGoonHeat("blaze", BLAZE_LINES),
  seraph: withGoonHeat("seraph", SERAPH_LINES),
};

export const CHAPTERS: Record<CharacterId, Chapter[]> = {
  raven: [...RAVEN_CHAPTERS, ...BEACH_CHAPTERS.raven],
  miko: [...MIKO_CHAPTERS, ...BEACH_CHAPTERS.miko],
  blaze: [...BLAZE_CHAPTERS, ...BEACH_CHAPTERS.blaze],
  seraph: [...SERAPH_CHAPTERS, ...BEACH_CHAPTERS.seraph],
};

export const REPLIES: Record<CharacterId, Record<string, string>> = {
  raven: RAVEN_REPLIES,
  miko: MIKO_REPLIES,
  blaze: BLAZE_REPLIES,
  seraph: SERAPH_REPLIES,
};

export function chaptersFor(character: CharacterId): Chapter[] {
  return CHAPTERS[character];
}

export function chapterAt(
  character: CharacterId,
  chapter: number,
): Chapter | undefined {
  return CHAPTERS[character].find((c) => c.chapter === chapter);
}

export function scenesFor(character: CharacterId) {
  return SCENES.filter((scene) => scene.character === character);
}

export function replyText(character: CharacterId, replyId: string): string {
  return REPLIES[character][replyId] ?? "";
}
