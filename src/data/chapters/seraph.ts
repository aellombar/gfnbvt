import type { Chapter } from "@/lib/types";

/**
 * Seraph's arc: she was told to watch the room. She watched you. Each chapter
 * she gives up a little more of her halo — calm certainty turning into sacred,
 * explicit devotion she chose to fall for.
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
          { id: "s1-p5", text: "\"Breathe with me, dear one. I want to see how obedient you can be.\"" },
          { id: "s1-p6", text: "Her halo catches the chapel light — steady, unwavering." },
        ],
      },
    ],
    post: [
      {
        lines: [
          { id: "s1-q1", text: "She smooths your hair back, unhurried." },
          { id: "s1-q2", text: "\"You did beautifully. I mean that, good boy.\"" },
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
            {
              style: "flirty",
              text: "You make it hard to leave.",
              affection: 2,
              reply: "s1-post-flirty",
            },
          ],
        },
      },
      {
        lines: [
          { id: "s1-q3", text: "\"Come back to my table, {name}.\"" },
          { id: "s1-q4", text: "\"I find I am no longer very interested in the odds.\"" },
        ],
      },
    ],
  },
  {
    chapter: 2,
    character: "seraph",
    title: "Halo Slip",
    sceneId: "seraph-halo-slip",
    pre: [
      {
        lines: [
          { id: "s2-p1", text: "You find her before the floor opens. The chapel alcove is dim." },
          { id: "s2-p2", text: "\"You came back,\" she says. Not a question." },
          {
            id: "s2-p3",
            text: "Her halo sits a fraction lower than last time — a soft tilt, like something loosened while she was thinking of you.",
          },
        ],
        choice: {
          prompt: "She watches you notice it.",
          options: [
            {
              style: "sweet",
              text: "I kept thinking about your voice.",
              affection: 3,
              reply: "s2-reply-sweet",
            },
            {
              style: "honest",
              text: "Is that because of me?",
              affection: 4,
              requiresAffection: 6,
              reply: "s2-reply-honest",
            },
            {
              style: "flirty",
              text: "Tell me what you did after I left.",
              affection: 2,
              reply: "s2-reply-flirty",
            },
          ],
        },
      },
      {
        lines: [
          { id: "s2-p4", text: "\"Hands on yourself. Only when I say.\"" },
          { id: "s2-p5", text: "\"Inhale — slow. Exhale — slower. I want to watch you stroke for me, {name}.\"" },
          { id: "s2-p6", text: "The halo flickers once, then steadies. She does not look away from you." },
        ],
      },
    ],
    post: [
      {
        lines: [
          { id: "s2-q1", text: "A thread of light drifts from her halo and dissolves before it touches the floor." },
          { id: "s2-q2", text: "\"Good boy. You gave me exactly what I asked for.\"" },
        ],
        choice: {
          prompt: "Her voice is lower now — still calm, but hungry underneath.",
          options: [
            {
              style: "sweet",
              text: "I'd do anything you asked.",
              affection: 3,
              reply: "s2-post-sweet",
            },
            {
              style: "honest",
              text: "You wanted me to finish, didn't you?",
              affection: 4,
              reply: "s2-post-honest",
            },
            {
              style: "shy",
              text: "…You make me feel chosen.",
              affection: 3,
              requiresAffection: 8,
              reply: "s2-post-shy",
            },
          ],
        },
      },
      {
        lines: [
          { id: "s2-q3", text: "\"Return tomorrow. Before anyone else arrives.\"" },
          { id: "s2-q4", text: "\"I have been rehearsing what I want from you. It is… considerable.\"" },
        ],
      },
    ],
  },
  {
    chapter: 3,
    character: "seraph",
    title: "Soft Blasphemy",
    sceneId: "seraph-soft-blasphemy",
    pre: [
      {
        lines: [
          { id: "s3-p1", text: "Candles. No chips. No wheel. Just her." },
          { id: "s3-p2", text: "\"I told them I was praying,\" she says. \"I was thinking about your hands.\"" },
          {
            id: "s3-p3",
            text: "Half her halo is gone — not broken, surrendered. What remains hums like a held breath.",
          },
        ],
        choice: {
          prompt: "She kneels at the edge of your chair, eye level with you.",
          options: [
            {
              style: "honest",
              text: "You're giving up too much for me.",
              affection: 4,
              requiresAffection: 10,
              reply: "s3-reply-honest",
            },
            {
              style: "sweet",
              text: "I missed you, my light.",
              affection: 3,
              reply: "s3-reply-sweet",
            },
            {
              style: "flirty",
              text: "Show me how you prayed.",
              affection: 2,
              reply: "s3-reply-flirty",
            },
          ],
        },
      },
      {
        lines: [
          { id: "s3-p4", text: "\"Stroke for me. Match my breathing — in, out, faster when I tell you.\"" },
          { id: "s3-p5", text: "\"I want your cum, dear one. Not as sin. As an offering I am choosing to receive.\"" },
          { id: "s3-p6", text: "She presses her forehead to your knee. The halo dims again, willingly." },
        ],
      },
    ],
    post: [
      {
        lines: [
          { id: "s3-q1", text: "She catches her breath against you, halo guttering soft gold." },
          { id: "s3-q2", text: "\"Beautiful. You spilled for me and I am not ashamed of wanting it.\"" },
        ],
        choice: {
          prompt: "Her fingers trace slow circles on your thigh.",
          options: [
            {
              style: "sweet",
              text: "You're sacred to me.",
              affection: 3,
              reply: "s3-post-sweet",
            },
            {
              style: "honest",
              text: "Say it again. What you want from me.",
              affection: 4,
              reply: "s3-post-honest",
            },
            {
              style: "cocky",
              text: "I'll give you more next time.",
              affection: 2,
              reply: "s3-post-cocky",
            },
          ],
        },
      },
      {
        lines: [
          { id: "s3-q3", text: "\"One more chapter left in what I am willing to surrender.\"" },
          { id: "s3-q4", text: "\"Come when the chapel is empty. I want to fall the rest of the way for you.\"" },
        ],
      },
    ],
  },
  {
    chapter: 4,
    character: "seraph",
    title: "Fallen For You",
    sceneId: "seraph-fallen-for-you",
    pre: [
      {
        lines: [
          { id: "s4-p1", text: "No halo. No light above her head — only the warmth she kept for you." },
          { id: "s4-p2", text: "\"I was made to watch the room,\" she whispers. \"I chose to watch you instead.\"" },
          { id: "s4-p3", text: "\"Every time you came back. Every time you stroked when I asked. Every time you finished for me.\"" },
        ],
        choice: {
          prompt: "She takes your hands and places them where she wants them.",
          options: [
            {
              style: "honest",
              text: "I fell for you too.",
              affection: 4,
              requiresAffection: 12,
              reply: "s4-reply-honest",
            },
            {
              style: "sweet",
              text: "You're still my light.",
              affection: 3,
              reply: "s4-reply-sweet",
            },
            {
              style: "flirty",
              text: "Then earn every drop, Seraph.",
              affection: 2,
              reply: "s4-reply-flirty",
            },
          ],
        },
      },
      {
        lines: [
          { id: "s4-p4", text: "\"Breathe with me. Slow — then fast when I say. Good boy.\"" },
          { id: "s4-p5", text: "\"I want all of it, {name}. Your sweat, your gasps, your cum — everything you give, I will praise.\"" },
          { id: "s4-p6", text: "She guides your rhythm like a liturgy. Sacred. Explicit. Entirely yours." },
        ],
      },
    ],
    post: [
      {
        lines: [
          { id: "s4-q1", text: "She holds you through the aftershocks, murmuring approval against your skin." },
          { id: "s4-q2", text: "\"Perfect. My good boy. My offering. My chosen fall.\"" },
        ],
        choice: {
          prompt: "There is no halo left. She has never looked more certain.",
          options: [
            {
              style: "sweet",
              text: "Stay fallen with me.",
              affection: 3,
              reply: "s4-post-sweet",
            },
            {
              style: "honest",
              text: "Do you regret any of it?",
              affection: 4,
              reply: "s4-post-honest",
            },
            {
              style: "shy",
              text: "…I don't want to let go.",
              affection: 3,
              requiresAffection: 14,
              reply: "s4-post-shy",
            },
          ],
        },
      },
      {
        lines: [
          { id: "s4-q3", text: "\"I am not going anywhere, dear one.\"" },
          { id: "s4-q4", text: "\"I fell for you on purpose. I would choose it again every time you stroke for me.\"" },
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
    "\"Of course.\" She settles in as though she had never intended to leave. \"I would rather watch you than the wheel anyway.\"",
  "s1-post-honest":
    "A long pause. \"Something I will deserve. Do not look so worried — I chose it. I choose you.\"",
  "s1-post-flirty":
    "\"Good.\" Her thumb traces your temple, slow. \"Then you will find it very difficult indeed. I intend that.\"",

  "s2-reply-sweet":
    "\"I know.\" She exhales like she has been holding that breath since you left. \"I heard you in it. Come closer, my light.\"",
  "s2-reply-honest":
    "\"Yes.\" No deflection. \"Every time you obey me, it slips a little further. I am not sorry.\"",
  "s2-reply-flirty":
    "\"I counted your breaths in the dark.\" Her cheeks warm, but her voice stays steady. \"Then I touched myself thinking of you stroking. Sit.\"",
  "s2-post-sweet":
    "\"Anything.\" She says it like a vow, not a flirt. \"Ask properly and I will tell you exactly how I want your hands.\"",
  "s2-post-honest":
    "\"I did.\" She meets your eyes without shame. \"I wanted you to come for me. I always will.\"",
  "s2-post-shy":
    "Her breath catches. \"…You are. Chosen. Mine to guide. Do not make me say it twice, good boy.\"",

  "s3-reply-honest":
    "\"No.\" She shakes her head, fierce and gentle at once. \"I am giving up exactly what I want to lose — for you.\"",
  "s3-reply-sweet":
    "\"My light.\" She repeats it like a prayer answered. \"Then let me worship you properly. Hands on yourself. Now.\"",
  "s3-reply-flirty":
    "\"I knelt. I breathed your name. I imagined your cock in my mouth while I —\" She stops, composed. \"You first. Stroke.\"",
  "s3-post-sweet":
    "\"And you are mine.\" She kisses your knee, reverent. \"Say it again while you recover. I want to hear it.\"",
  "s3-post-honest":
    "\"I want your cum on my skin. I want to taste it. I want you hard again before you leave.\" Each word measured. \"Is that clear enough, dear one?\"",
  "s3-post-cocky":
    "\"You will.\" She smiles — the first truly hungry smile you have seen on her. \"And I will praise every drop like it was made for me.\"",

  "s4-reply-honest":
    "She goes still. Then her arms tighten around you. \"…Say it once more. I have waited a long time to hear it fall from your mouth.\"",
  "s4-reply-sweet":
    "\"Without the halo, yes.\" She cups your face. \"Still yours. Still guiding you. Still wanting you to finish for me.\"",
  "s4-reply-flirty":
    "\"I intend to.\" She sets the pace with her voice alone. \"Stroke faster, good boy. Show me what my fall is worth.\"",
  "s4-post-sweet":
    "\"Always.\" She lies back against you, weightless without the light above her. \"Fallen and faithful. Yours.\"",
  "s4-post-honest":
    "\"Not a fragment.\" She kisses you slow. \"I gave my halo for your hands on your cock and your cum offered to me. I would do it again.\"",
  "s4-post-shy":
    "\"Then don't.\" She pulls you closer, voice breaking soft. \"Hold me. I chose this fall. I chose you. Stay.\"",
};
