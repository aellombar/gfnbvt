import type { Chapter } from "@/lib/types";

/**
 * Raven's arc: you start as a customer at her table and end up the reason she
 * stops closing on time. Every choice gets a reply written in her voice — the
 * same option said to Miko would land completely differently.
 */
export const RAVEN_CHAPTERS: Chapter[] = [
  {
    chapter: 1,
    character: "raven",
    title: "Last Call",
    sceneId: "raven-first-timer",
    pre: [
      {
        lines: [
          { id: "r1-p1", text: "The floor's empty. You're still at her table." },
          {
            id: "r1-p2",
            text: "Raven taps the deck square, sets it down, and finally looks at you properly.",
          },
          { id: "r1-p3", text: "\"You've been here since nine. Either you love blackjack…\"" },
          { id: "r1-p4", text: "\"…or you've been working up to something. Which is it?\"" },
        ],
        choice: {
          prompt: "She waits, one brow raised.",
          options: [
            {
              style: "flirty",
              text: "Maybe I just like the dealer.",
              affection: 2,
              reply: "r1-reply-flirty",
            },
            {
              style: "shy",
              text: "…I wasn't sure you'd noticed.",
              affection: 2,
              reply: "r1-reply-shy",
            },
            {
              style: "cocky",
              text: "Think you can keep up with me?",
              reply: "r1-reply-cocky",
            },
          ],
        },
      },
      {
        lines: [
          {
            id: "r1-p5",
            text: "\"Mm.\" She pulls the velvet rope across the booth entrance.",
          },
          { id: "r1-p6", text: "\"Table's closed. You're not going anywhere, though.\"" },
          { id: "r1-p7", text: "\"Hands off the table, sweetheart. Just listen to me.\"" },
        ],
      },
    ],
    post: [
      {
        lines: [
          { id: "r1-q1", text: "She's quiet for a moment, watching you come down." },
          { id: "r1-q2", text: "\"…Well. That was worth staying late for.\"" },
        ],
        choice: {
          prompt: "She's still watching you.",
          options: [
            {
              style: "sweet",
              text: "Thank you. Really.",
              affection: 3,
              reply: "r1-post-sweet",
            },
            {
              style: "cocky",
              text: "Told you I could keep up.",
              affection: 1,
              reply: "r1-post-cocky",
            },
            {
              style: "honest",
              text: "I needed that more than I expected.",
              affection: 3,
              reply: "r1-post-honest",
            },
          ],
        },
      },
      {
        lines: [
          { id: "r1-q3", text: "\"Come back tomorrow. Same table.\"" },
          { id: "r1-q4", text: "\"I'll leave the booth open for you.\"" },
        ],
      },
    ],
  },
  {
    chapter: 2,
    character: "raven",
    title: "After Close",
    sceneId: "raven-private-booth",
    pre: [
      {
        lines: [
          { id: "r2-p1", text: "The booth light is already on when you walk in." },
          { id: "r2-p2", text: "\"You're late,\" she says, without looking up. \"I noticed.\"" },
          {
            id: "r2-p3",
            text: "She's out of the dealer vest. Just the lace underneath, and she knows it.",
          },
        ],
        choice: {
          prompt: "She finally looks up.",
          options: [
            {
              style: "sweet",
              text: "I came back for you.",
              affection: 3,
              reply: "r2-reply-sweet",
            },
            {
              style: "flirty",
              text: "You changed for me?",
              affection: 2,
              reply: "r2-reply-flirty",
            },
            {
              style: "honest",
              text: "I had a rough day.",
              affection: 3,
              reply: "r2-reply-honest",
            },
          ],
        },
      },
      {
        lines: [
          { id: "r2-p4", text: "\"Then we do this properly tonight.\"" },
          { id: "r2-p5", text: "\"Sit. Breathe. And do exactly what I tell you.\"" },
        ],
      },
    ],
    post: [
      {
        lines: [
          { id: "r2-q1", text: "She smooths the lace back into place, unhurried." },
          { id: "r2-q2", text: "\"Don't tell my manager about the booth.\"" },
        ],
        choice: {
          prompt: "She's smiling, barely.",
          options: [
            {
              style: "sweet",
              text: "Your secret's safe.",
              affection: 2,
              reply: "r2-post-sweet",
            },
            {
              style: "flirty",
              text: "Depends what I get for keeping quiet.",
              affection: 2,
              reply: "r2-post-flirty",
            },
            {
              style: "shy",
              text: "…Can I come back?",
              affection: 3,
              requiresAffection: 6,
              reply: "r2-post-shy",
            },
          ],
        },
      },
      {
        lines: [
          { id: "r2-q3", text: "\"Next time, find me before my shift starts.\"" },
          { id: "r2-q4", text: "\"I want you all to myself for once.\"" },
        ],
      },
    ],
  },
  {
    chapter: 3,
    character: "raven",
    title: "Before Her Shift",
    sceneId: "raven-velvet-room",
    pre: [
      {
        lines: [
          {
            id: "r3-p1",
            text: "The velvet room is off the floor entirely. No cameras, no tables.",
          },
          { id: "r3-p2", text: "\"You actually came early.\" She sounds genuinely pleased." },
          { id: "r3-p3", text: "\"Do you know how long it's been since someone did that for me?\"" },
        ],
        choice: {
          prompt: "She sits down beside you instead of across from you.",
          options: [
            {
              style: "honest",
              text: "I think about you between shifts.",
              affection: 4,
              requiresAffection: 8,
              reply: "r3-reply-honest",
            },
            {
              style: "sweet",
              text: "You're worth being early for.",
              affection: 3,
              reply: "r3-reply-sweet",
            },
            {
              style: "flirty",
              text: "I wanted you before the house did.",
              affection: 2,
              reply: "r3-reply-flirty",
            },
          ],
        },
      },
      {
        lines: [
          { id: "r3-p4", text: "\"…You're going to make me late, sweetheart.\"" },
          { id: "r3-p5", text: "\"Worth it. Hands off the screen. Watch me.\"" },
        ],
      },
    ],
    post: [
      {
        lines: [
          { id: "r3-q1", text: "Somewhere out on the floor, a bell rings. She ignores it." },
          { id: "r3-q2", text: "\"Let them wait. You did so well.\"" },
        ],
        choice: {
          prompt: "She hasn't moved.",
          options: [
            {
              style: "sweet",
              text: "Stay a minute longer.",
              affection: 3,
              reply: "r3-post-sweet",
            },
            {
              style: "honest",
              text: "I don't want this to just be a table thing.",
              affection: 4,
              requiresAffection: 12,
              reply: "r3-post-honest",
            },
          ],
        },
      },
      {
        lines: [
          { id: "r3-q3", text: "\"Mm. Go on, then. I'll be here.\"" },
          { id: "r3-q4", text: "\"…I'm always here, sweetheart. That's rather the point.\"" },
        ],
      },
    ],
  },
];

/** Her reactions, keyed by the reply id on each option. */
export const RAVEN_REPLIES: Record<string, string> = {
  "r1-reply-flirty":
    "\"…Cute.\" She almost smiles. \"Careful, sweetheart. I hear that a lot, and I never believe it. From you I might.\"",
  "r1-reply-shy":
    "\"Oh, I noticed.\" She leans in, voice dropping. \"I notice everything at this table. You've been very patient. I like patient.\"",
  "r1-reply-cocky":
    "\"Mm. Cute.\" She doesn't blink. \"Sweetheart, I've been doing this longer than you've been allowed in this building. Let's find out.\"",
  "r1-post-sweet":
    "\"You're welcome.\" She sounds almost surprised by how much she means it. \"Nobody thanks the dealer. Try to remember you can.\"",
  "r1-post-cocky":
    "\"You did.\" A slow, real smile. \"Don't get comfortable. I went easy on you, and we both know it.\"",
  "r1-post-honest":
    "She goes quiet for a second. \"…Yes. I could tell. That's why I closed the table.\"",
  "r2-reply-sweet":
    "\"For me.\" She repeats it like she's testing the weight of it. \"…Sit down before I say something I mean, sweetheart.\"",
  "r2-reply-flirty":
    "\"Don't flatter yourself.\" She absolutely changed for you. \"…Fine. Yes. Sit down.\"",
  "r2-reply-honest":
    "The teasing drops out of her voice entirely. \"Then you're in the right chair. Let me take it off you for a while.\"",
  "r2-post-sweet":
    "\"Good boy.\" She says it soft, almost fond. \"You keep being this easy to like and I'll get careless.\"",
  "r2-post-flirty":
    "\"Bold.\" She laughs under her breath. \"Ask me again next time and I might actually answer.\"",
  "r2-post-shy":
    "Her expression softens all the way through. \"…You never have to ask me that. Not you.\"",
  "r3-reply-honest":
    "She's quiet for a long beat. \"…That's not a small thing to say to me. I'm not going to pretend it is.\"",
  "r3-reply-sweet":
    "\"Flatterer.\" But she doesn't move away. \"Keep talking like that and I'll never make it to the floor.\"",
  "r3-reply-flirty":
    "\"Greedy.\" She sounds delighted about it. \"Alright. Before the house, then. Just this once.\"",
  "r3-post-sweet":
    "\"A minute.\" She settles in. It is very obviously going to be more than a minute.",
  "r3-post-honest":
    "\"…I know.\" Her hand finds yours on the velvet. \"It stopped being a table thing a while ago, sweetheart.\"",
};
