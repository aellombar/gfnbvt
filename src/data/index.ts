import type { CharacterId, CharacterLines, Chapter } from "@/lib/types";
import { RAVEN_LINES } from "@/data/lines/raven";
import { MIKO_LINES } from "@/data/lines/miko";
import { RAVEN_CHAPTERS, RAVEN_REPLIES } from "@/data/chapters/raven";
import { MIKO_CHAPTERS, MIKO_REPLIES } from "@/data/chapters/miko";
import { SCENES } from "@/data/scenes";

export const LINES: Record<CharacterId, CharacterLines> = {
  raven: RAVEN_LINES,
  miko: MIKO_LINES,
};

export const CHAPTERS: Record<CharacterId, Chapter[]> = {
  raven: RAVEN_CHAPTERS,
  miko: MIKO_CHAPTERS,
};

export const REPLIES: Record<CharacterId, Record<string, string>> = {
  raven: RAVEN_REPLIES,
  miko: MIKO_REPLIES,
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
