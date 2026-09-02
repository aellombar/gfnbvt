import type { Chapter } from "@/lib/types";

/**
 * SEED CHAPTER — structure only.
 *
 * One playable chapter so Blaze is reachable in game. The full arc is being
 * written elsewhere; see docs/WRITING_PROMPTS.md for the prompt and the exact
 * shape to append here.
 *
 * Her arc, for reference: rivals-to-lovers. She bets against you, loses, and
 * keeps demanding rematches that get less and less about racing.
 */
export const BLAZE_CHAPTERS: Chapter[] = [
  {
    chapter: 1,
    character: "blaze",
    title: "Rematch",
    sceneId: "blaze-rematch",
    pre: [
      {
        lines: [
          {
            id: "b1-p1",
            text: "She slaps her chips down on the rail hard enough to rattle them.",
          },
          { id: "b1-p2", text: "\"Okay. You got lucky last time. That's it.\"" },
          { id: "b1-p3", text: "\"So we're doing it again. Right now.\"" },
        ],
        choice: {
          prompt: "She's grinning like she's already won.",
          options: [
            {
              style: "cocky",
              text: "Think you can keep up with me?",
              affection: 2,
              reply: "b1-reply-cocky",
            },
            {
              style: "sweet",
              text: "You didn't have to come find me.",
              affection: 3,
              reply: "b1-reply-sweet",
            },
            {
              style: "shy",
              text: "…You've been thinking about it that much?",
              affection: 3,
              reply: "b1-reply-shy",
            },
          ],
        },
      },
      {
        lines: [
          { id: "b1-p4", text: "\"Hands off the table. I'm setting the pace this time.\"" },
        ],
      },
    ],
    post: [
      {
        lines: [
          { id: "b1-q1", text: "She's laughing, breathless, delighted." },
          { id: "b1-q2", text: "\"Okay. Okay, fine. You win again.\"" },
        ],
        choice: {
          prompt: "She hasn't stopped smiling.",
          options: [
            {
              style: "cocky",
              text: "Best of three?",
              affection: 2,
              reply: "b1-post-cocky",
            },
            {
              style: "honest",
              text: "I don't think this is about winning anymore.",
              affection: 3,
              reply: "b1-post-honest",
            },
          ],
        },
      },
      {
        lines: [
          { id: "b1-q3", text: "\"Same time tomorrow. Don't be late, champ.\"" },
        ],
      },
    ],
  },
];

export const BLAZE_REPLIES: Record<string, string> = {
  "b1-reply-cocky":
    "\"HA! Big talk!\" She's instantly lit up. \"Okay, okay — you asked for it. I'm not going easy this time.\"",
  "b1-reply-sweet":
    "\"…Shut up.\" She's absolutely blushing. \"I wanted a rematch. That's all. Obviously.\"",
  "b1-reply-shy":
    "She freezes for exactly one second. \"…No. Maybe. Look, are we doing this or not?\"",
  "b1-post-cocky":
    "\"You're on!\" She's already reaching for the chips again. \"Tomorrow. I'm training for this now.\"",
  "b1-post-honest":
    "She goes quiet, which for her is enormous. \"…Yeah. I know. Took you long enough to say it.\"",
};
