import type { Chapter } from "@/lib/types";

/**
 * SEED CHAPTER — structure only.
 *
 * One playable chapter so Seraph is reachable in game. The full arc is being
 * written elsewhere; see docs/WRITING_PROMPTS.md for the prompt and the exact
 * shape to append here.
 *
 * Her arc, for reference: she fell for a human, and each chapter she gives up
 * a little more of her halo over it.
 */
export const SERAPH_CHAPTERS: Chapter[] = [
  {
    chapter: 1,
    character: "seraph",
    title: "Descent",
    sceneId: "seraph-descent",
    pre: [
      {
        lines: [
          {
            id: "s1-p1",
            text: "The roulette table is empty. She is sitting at it anyway, waiting.",
          },
          { id: "s1-p2", text: "\"I was told to watch over this room,\" she says." },
          { id: "s1-p3", text: "\"I have mostly been watching you.\"" },
        ],
        choice: {
          prompt: "She says it without a trace of embarrassment.",
          options: [
            {
              style: "sweet",
              text: "I noticed. I didn't mind.",
              affection: 3,
              reply: "s1-reply-sweet",
            },
            {
              style: "cocky",
              text: "Think you can keep up with me?",
              reply: "s1-reply-cocky",
            },
            {
              style: "honest",
              text: "Should you be telling me that?",
              affection: 3,
              reply: "s1-reply-honest",
            },
          ],
        },
      },
      {
        lines: [
          { id: "s1-p4", text: "\"Sit. Hands away from the screen.\"" },
          { id: "s1-p5", text: "\"Breathe with me, and do as I say.\"" },
        ],
      },
    ],
    post: [
      {
        lines: [
          { id: "s1-q1", text: "She smooths your hair back, unhurried." },
          { id: "s1-q2", text: "\"You did beautifully. I mean that.\"" },
        ],
        choice: {
          prompt: "She hasn't moved her hand.",
          options: [
            {
              style: "sweet",
              text: "Stay with me a while.",
              affection: 3,
              reply: "s1-post-sweet",
            },
            {
              style: "honest",
              text: "What happens to you for doing this?",
              affection: 4,
              reply: "s1-post-honest",
            },
          ],
        },
      },
      {
        lines: [
          { id: "s1-q3", text: "\"Come back to my table, dear one.\"" },
          { id: "s1-q4", text: "\"I find I am no longer very interested in the odds.\"" },
        ],
      },
    ],
  },
];

export const SERAPH_REPLIES: Record<string, string> = {
  "s1-reply-sweet":
    "\"No,\" she agrees calmly. \"You did not mind at all. I have been paying attention to that, too.\"",
  "s1-reply-cocky":
    "\"Confidence suits you.\" Not a flicker of competitiveness. \"But I think you will be following my lead, dear one.\"",
  "s1-reply-honest":
    "\"Almost certainly not.\" She sounds entirely at peace with it. \"And yet here I am, telling you.\"",
  "s1-post-sweet":
    "\"Of course.\" She settles in as though she had never intended to leave.",
  "s1-post-honest":
    "A long pause. \"Something I will deserve. Do not look so worried — I chose it.\"",
};
