import type { Chapter } from "@/lib/types";

/**
 * Miko's arc runs the opposite direction to Raven's: she starts shy and
 * formal, and the further in you get the more openly devoted she becomes.
 */
export const MIKO_CHAPTERS: Chapter[] = [
  {
    chapter: 1,
    character: "miko",
    title: "For Luck",
    sceneId: "miko-for-luck",
    pre: [
      {
        lines: [
          {
            id: "m1-p1",
            text: "The slot floor is loud. Her little alcove somehow isn't.",
          },
          { id: "m1-p2", text: "\"You lost again,\" Miko says. She doesn't sound sorry." },
          { id: "m1-p3", text: "\"Let me fix that. I'm very good at luck.\"" },
        ],
        choice: {
          prompt: "She's already reaching for your hand.",
          options: [
            {
              style: "shy",
              text: "You don't have to do that.",
              affection: 2,
              reply: "m1-reply-shy",
            },
            {
              style: "cocky",
              text: "Think you can keep up with me?",
              reply: "m1-reply-cocky",
            },
            {
              style: "sweet",
              text: "I'd like that. A lot.",
              affection: 3,
              reply: "m1-reply-sweet",
            },
          ],
        },
      },
      {
        lines: [
          { id: "m1-p4", text: "\"Then put the chips down and put your hands where I can't see them.\"" },
          { id: "m1-p5", text: "She flushes at her own boldness, but doesn't take it back." },
        ],
      },
    ],
    post: [
      {
        lines: [
          { id: "m1-q1", text: "She's beaming at you, slightly out of breath herself." },
          { id: "m1-q2", text: "\"There. Now you're lucky.\"" },
        ],
        choice: {
          prompt: "She's still holding your hand.",
          options: [
            {
              style: "sweet",
              text: "You spoil me.",
              affection: 3,
              reply: "m1-post-sweet",
            },
            {
              style: "honest",
              text: "That wasn't really about luck, was it?",
              affection: 3,
              reply: "m1-post-honest",
            },
          ],
        },
      },
      {
        lines: [
          { id: "m1-q3", text: "\"Come find me tomorrow. Before you gamble anything.\"" },
          { id: "m1-q4", text: "\"…I'd rather you spent it on me anyway.\"" },
        ],
      },
    ],
  },
  {
    chapter: 2,
    character: "miko",
    title: "Closing Blessing",
    sceneId: "miko-closing-blessing",
    pre: [
      {
        lines: [
          { id: "m2-p1", text: "The floor lights are down. She waited for you." },
          { id: "m2-p2", text: "\"I saved this one,\" she says, smoothing the good kimono." },
          { id: "m2-p3", text: "\"I only wear it for things that matter.\"" },
        ],
        choice: {
          prompt: "She's watching your face very carefully.",
          options: [
            {
              style: "sweet",
              text: "You look beautiful.",
              affection: 3,
              reply: "m2-reply-sweet",
            },
            {
              style: "honest",
              text: "Do I matter?",
              affection: 4,
              requiresAffection: 6,
              reply: "m2-reply-honest",
            },
            {
              style: "flirty",
              text: "You're going to ruin that kimono.",
              affection: 2,
              reply: "m2-reply-flirty",
            },
          ],
        },
      },
      {
        lines: [
          { id: "m2-p4", text: "\"Then sit. Hands off everything but yourself.\"" },
          { id: "m2-p5", text: "\"Tonight I'm giving you everything I've got, {name}.\"" },
        ],
      },
    ],
    post: [
      {
        lines: [
          { id: "m2-q1", text: "She's pink to the ears and entirely unbothered by it." },
          { id: "m2-q2", text: "\"Haa… you did so well. So, so well.\"" },
        ],
        choice: {
          prompt: "She hasn't let go of you.",
          options: [
            {
              style: "sweet",
              text: "Come here.",
              affection: 3,
              reply: "m2-post-sweet",
            },
            {
              style: "honest",
              text: "I don't want to share you with the floor.",
              affection: 4,
              requiresAffection: 10,
              reply: "m2-post-honest",
            },
          ],
        },
      },
      {
        lines: [
          { id: "m2-q3", text: "\"Next time, don't bring chips at all.\"" },
          { id: "m2-q4", text: "\"Just bring yourself. That's the only offering I want.\"" },
        ],
      },
    ],
  },
];

export const MIKO_REPLIES: Record<string, string> = {
  "m1-reply-shy":
    "\"I know I don't have to.\" She takes your hand anyway, gently. \"That's rather the point of a blessing, isn't it? Let me.\"",
  "m1-reply-cocky":
    "\"Oh!\" She lights up completely — no competitive edge at all, just delight. \"You're feeling confident today. Good. Then I'll give you everything.\"",
  "m1-reply-sweet":
    "\"…Good.\" Her whole face goes warm. \"Then sit still and let someone be kind to you for once.\"",
  "m1-post-sweet":
    "\"Yes,\" she agrees immediately, entirely unashamed. \"I intend to keep doing it, so you'll have to get used to it.\"",
  "m1-post-honest":
    "She hesitates, then shakes her head, smiling. \"…No. It wasn't. I think you already knew that.\"",
  "m2-reply-sweet":
    "\"Ah—\" She covers her mouth, then gives up on hiding the smile. \"You can't just say things like that to me.\"",
  "m2-reply-honest":
    "\"Yes.\" No hesitation at all this time. \"You matter. That's why the kimono. That's why I waited.\"",
  "m2-reply-flirty":
    "\"Then I'll wear it anyway.\" She's blushing furiously and standing her ground. \"Some things are worth ruining.\"",
  "m2-post-sweet":
    "She comes without a word and stays there, forehead against your shoulder, breathing slowly.",
  "m2-post-honest":
    "\"Then don't.\" She says it fiercely, quietly. \"I've been yours since the first blessing. Ask me for it properly and I'll say yes.\"",
};
