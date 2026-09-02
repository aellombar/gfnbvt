import type { Chapter } from "@/lib/types";

/**
 * Miko's arc runs opposite to Raven's: shy, formal shrine-girl on the slot
 * floor becomes openly devoted — intimacy framed as sacred spoiling until
 * you're the only offering she wants.
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
            text: "The slot floor is loud. Her little shrine alcove somehow isn't.",
          },
          {
            id: "m1-p2",
            text: "\"You lost again,\" Miko says, formal as a prayer. She doesn't sound sorry.",
          },
          {
            id: "m1-p3",
            text: "\"Let me fix that. I'm very good at luck blessings.\"",
          },
        ],
        choice: {
          prompt: "She's already reaching for your hand, sleeves brushing your wrist.",
          options: [
            {
              style: "shy",
              text: "You don't have to do that.",
              affection: 2,
              reply: "m1-reply-shy",
            },
            {
              style: "cocky",
              text: "Think your blessing can keep up with me?",
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
          {
            id: "m1-p4",
            text: "\"Then put the chips down. Hands where I can see them — on yourself, sweet thing.\"",
          },
          {
            id: "m1-p5",
            text: "She flushes at her own boldness. She doesn't take it back.",
          },
          {
            id: "m1-p6",
            text: "\"You deserve to be spoiled. Let me watch you take it.\"",
          },
        ],
      },
    ],
    post: [
      {
        lines: [
          {
            id: "m1-q1",
            text: "She's beaming at you, slightly out of breath herself, fingers still warm from yours.",
          },
          { id: "m1-q2", text: "\"There. Now you're lucky, good boy.\"" },
        ],
        choice: {
          prompt: "She hasn't let go of your hand.",
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
          {
            id: "m1-q3",
            text: "\"Come find me tomorrow. Before you gamble anything, {name}.\"",
          },
          {
            id: "m1-q4",
            text: "\"…I'd rather you spent it on me anyway. On letting me take care of you.\"",
          },
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
          {
            id: "m2-p1",
            text: "The floor lights are down. She waited — just like she asked.",
          },
          {
            id: "m2-p2",
            text: "\"I saved this one,\" she says, smoothing the good kimono. \"I only wear it for things that matter.\"",
          },
          {
            id: "m2-p3",
            text: "\"You came back. Before the slots. My luck remembered.\"",
          },
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
              text: "Do I matter to you?",
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
          {
            id: "m2-p4",
            text: "\"Then sit. Hands off everything but yourself — I want to watch every stroke.\"",
          },
          {
            id: "m2-p5",
            text: "\"Tonight I'm giving you everything I've got, {name}. You deserve to cum for me.\"",
          },
        ],
      },
    ],
    post: [
      {
        lines: [
          {
            id: "m2-q1",
            text: "She's pink to the ears and entirely unbothered by it, breath still catching.",
          },
          { id: "m2-q2", text: "\"Haa… you did so well. So, so well, good boy.\"" },
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
          {
            id: "m2-q3",
            text: "\"Next time, don't bring chips at all.\"",
          },
          {
            id: "m2-q4",
            text: "\"Just bring yourself. That's the only offering I want, sweet thing.\"",
          },
        ],
      },
    ],
  },
  {
    chapter: 3,
    character: "miko",
    title: "Private Offering",
    sceneId: "miko-private-offering",
    pre: [
      {
        lines: [
          {
            id: "m3-p1",
            text: "Behind the shrine curtain — no slots, no floor noise. Just her and the low glow of lanterns.",
          },
          {
            id: "m3-p2",
            text: "\"You didn't gamble tonight.\" She sounds pleased. Proud, even.",
          },
          {
            id: "m3-p3",
            text: "\"You brought yourself. Like I asked. My luck, all mine for once.\"",
          },
        ],
        choice: {
          prompt: "She kneels close enough that her breath warms your knee.",
          options: [
            {
              style: "sweet",
              text: "I came for you.",
              affection: 3,
              reply: "m3-reply-sweet",
            },
            {
              style: "honest",
              text: "I think about your blessings between visits.",
              affection: 4,
              requiresAffection: 10,
              reply: "m3-reply-honest",
            },
            {
              style: "flirty",
              text: "Missed watching me?",
              affection: 2,
              reply: "m3-reply-flirty",
            },
          ],
        },
      },
      {
        lines: [
          {
            id: "m3-p4",
            text: "\"This is sacred. Not luck — devotion. I want your cock in your hand and your eyes on me.\"",
          },
          {
            id: "m3-p5",
            text: "\"Stroke for me, {name}. Slow first. I want to savor every second until you cum.\"",
          },
        ],
      },
    ],
    post: [
      {
        lines: [
          {
            id: "m3-q1",
            text: "She's trembling — not from cold. Her voice is wrecked and worshipful.",
          },
          {
            id: "m3-q2",
            text: "\"…Beautiful. You came so beautifully for me. You always do.\"",
          },
        ],
        choice: {
          prompt: "She's pressing her forehead to your thigh, still catching her breath.",
          options: [
            {
              style: "sweet",
              text: "Stay with me a little longer.",
              affection: 3,
              reply: "m3-post-sweet",
            },
            {
              style: "honest",
              text: "I don't want this to stay a floor secret.",
              affection: 4,
              requiresAffection: 14,
              reply: "m3-post-honest",
            },
          ],
        },
      },
      {
        lines: [
          {
            id: "m3-q3",
            text: "\"One more time. Just us. No chips, no machines — only you, offering yourself to me.\"",
          },
          {
            id: "m3-q4",
            text: "\"…I'll be waiting, good boy. Come back when you're ready to be mine completely.\"",
          },
        ],
      },
    ],
  },
  {
    chapter: 4,
    character: "miko",
    title: "Only You",
    sceneId: "miko-only-you",
    pre: [
      {
        lines: [
          {
            id: "m4-p1",
            text: "She meets you at the entrance. Not the alcove — the door.",
          },
          {
            id: "m4-p2",
            text: "\"No more slots tonight. No more luck.\" Her voice is soft and absolutely certain.",
          },
          {
            id: "m4-p3",
            text: "\"I don't want you gambling. I want you here. My only offering, {name}.\"",
          },
        ],
        choice: {
          prompt: "She takes both your hands like she's claiming something holy.",
          options: [
            {
              style: "sweet",
              text: "I'm yours.",
              affection: 4,
              reply: "m4-reply-sweet",
            },
            {
              style: "honest",
              text: "I've been yours since the first blessing.",
              affection: 5,
              requiresAffection: 14,
              reply: "m4-reply-honest",
            },
            {
              style: "shy",
              text: "…You really mean that?",
              affection: 3,
              reply: "m4-reply-shy",
            },
          ],
        },
      },
      {
        lines: [
          {
            id: "m4-p4",
            text: "\"Sit. I want to watch you stroke yourself while I tell you exactly what you do to me.\"",
          },
          {
            id: "m4-p5",
            text: "\"Every time you cum for me, sweet thing, I feel chosen. You deserve this. All of it.\"",
          },
        ],
      },
    ],
    post: [
      {
        lines: [
          {
            id: "m4-q1",
            text: "She holds you through the afterglow, kimono loose, cheeks flushed, eyes bright.",
          },
          {
            id: "m4-q2",
            text: "\"My good boy. My luck. Mine.\" She says it like a vow.",
          },
        ],
        choice: {
          prompt: "She's smiling — open, unguarded, entirely yours.",
          options: [
            {
              style: "sweet",
              text: "I'm not going anywhere.",
              affection: 4,
              reply: "m4-post-sweet",
            },
            {
              style: "honest",
              text: "Keep me. I don't need the floor anymore.",
              affection: 5,
              requiresAffection: 14,
              reply: "m4-post-honest",
            },
          ],
        },
      },
      {
        lines: [
          {
            id: "m4-q3",
            text: "\"Then don't.\" She kisses your knuckles, one at a time. \"Stay. Be my offering.\"",
          },
          {
            id: "m4-q4",
            text: "\"…You were always enough, {name}. I just needed you to know it.\"",
          },
        ],
      },
    ],
  },
];

export const MIKO_REPLIES: Record<string, string> = {
  "m1-reply-shy":
    "\"I know I don't have to.\" She takes your hand anyway, gently, reverently. \"That's rather the point of a blessing, isn't it? Let me spoil you.\"",
  "m1-reply-cocky":
    "\"Oh!\" She lights up — no competitive edge, just delighted hunger. \"Confident today. Good. Then I'll give you everything and watch you take it.\"",
  "m1-reply-sweet":
    "\"…Good.\" Her whole face goes warm. \"Then sit still and let someone be kind to you for once, sweet thing. You deserve it.\"",
  "m1-post-sweet":
    "\"Yes.\" She agrees immediately, unashamed. \"I intend to keep doing it, good boy. You'll have to get used to being spoiled.\"",
  "m1-post-honest":
    "She hesitates, then shakes her head, smiling. \"…No. It wasn't. I think you already knew that. I wanted to watch you, that's all.\"",
  "m2-reply-sweet":
    "\"Ah—\" She covers her mouth, then gives up on hiding the smile. \"You can't just say things like that while I'm in the good kimono.\"",
  "m2-reply-honest":
    "\"Yes.\" No hesitation. \"You matter. That's why the kimono. That's why I waited instead of blessing anyone else tonight.\"",
  "m2-reply-flirty":
    "\"Then I'll wear it anyway.\" She's blushing furiously and standing her ground. \"Some things are worth ruining. You're worth ruining it for.\"",
  "m2-post-sweet":
    "She comes without a word and stays there, forehead against your shoulder, breathing slowly. \"…Don't move yet. I like you close.\"",
  "m2-post-honest":
    "\"Then don't share me.\" She says it fiercely, quietly. \"I've been yours since the first blessing, my luck. Ask me properly and I'll say yes every time.\"",
  "m3-reply-sweet":
    "\"For me.\" She repeats it like a prayer answered. \"…Good. Then let me worship you properly tonight, good boy.\"",
  "m3-reply-honest":
    "She goes very still. \"…Me too.\" Her voice cracks, tender. \"I think about you stroking yourself for me. About making you cum. Every day.\"",
  "m3-reply-flirty":
    "\"Missed it?\" She's blushing but doesn't look away. \"I ached for it. Don't make me wait again, sweet thing.\"",
  "m3-post-sweet":
    "\"Always.\" She settles against you, kimono slipping off one shoulder. \"As long as you want me here, I'm not leaving.\"",
  "m3-post-honest":
    "\"It won't.\" She finds your hand, laces her fingers through. \"Not a secret anymore. You're mine, {name}. I want everyone to know I chose you.\"",
  "m4-reply-sweet":
    "\"Mine.\" She breathes it out like relief. \"Say it again while you stroke for me. I want to hear it when you cum.\"",
  "m4-reply-honest":
    "\"I know.\" Tears at the corners of her eyes — happy, overwhelmed. \"I felt it the moment you let me hold your hand. You've been my offering all along.\"",
  "m4-reply-shy":
    "\"Every word.\" She cups your face, thumbs soft on your cheeks. \"No slots. No luck. Just you, giving yourself to me. That's all I've ever wanted.\"",
  "m4-post-sweet":
    "\"Good.\" She holds you tighter. \"Then stay. Be here. Be mine. No more floor — just us.\"",
  "m4-post-honest":
    "\"Keep me.\" She laughs, wet-eyed and radiant. \"Yes. Keep me. I don't want the shrine without you in it, {name}. You're home.\"",
};
