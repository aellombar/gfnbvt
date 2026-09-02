import type { Chapter } from "@/lib/types";

/**
 * Blaze's arc: rivals-to-lovers. She bets against you, loses, and keeps
 * demanding rematches that get less about racing and more about watching you
 * stroke your cock to her pace until you cum. Loud, competitive, entirely on
 * your side. Blushes when called on feelings.
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
          {
            id: "b1-p4",
            text: "Her grin says she's already picturing your hands somewhere other than the table.",
          },
        ],
        choice: {
          prompt: "She's vibrating with it — like the race already started.",
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
          { id: "b1-p5", text: "\"Hands off the table, champ.\"" },
          { id: "b1-p6", text: "\"I'm setting the pace this time. You stroke when I say.\"" },
          { id: "b1-p7", text: "\"And you're gonna look SO good losing to me again.\"" },
        ],
      },
    ],
    post: [
      {
        lines: [
          { id: "b1-q1", text: "She's laughing, breathless, delighted — cheeks flushed hot." },
          { id: "b1-q2", text: "\"Okay. Okay, FINE. You win again.\"" },
          { id: "b1-q3", text: "\"God, watching you stroke like that…\" She catches herself. \"Forget I said that.\"" },
        ],
        choice: {
          prompt: "She hasn't stopped smiling. Or staring.",
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
            {
              style: "flirty",
              text: "You liked watching me cum, didn't you?",
              affection: 2,
              reply: "b1-post-flirty",
            },
          ],
        },
      },
      {
        lines: [
          { id: "b1-q4", text: "\"Same time tomorrow. Don't be late, champ.\"" },
          { id: "b1-q5", text: "\"I'm training for this now. You hear me? TRAINING.\"" },
        ],
      },
    ],
  },
  {
    chapter: 2,
    character: "blaze",
    title: "Pit Lane",
    sceneId: "blaze-pit-lane",
    pre: [
      {
        lines: [
          {
            id: "b2-p1",
            text: "The pit lane is empty except for her. Racing jacket half-unzipped, neon buzzing overhead.",
          },
          { id: "b2-p2", text: "\"You're late,\" she says. Then grins. \"Kidding. I got here early.\"" },
          { id: "b2-p3", text: "\"Couldn't stop thinking about yesterday. Your hand on your cock. My pace.\"" },
          { id: "b2-p4", text: "\"So yeah. I skipped the chips this time.\"" },
        ],
        choice: {
          prompt: "She's bouncing on her heels like she's already at the starting line.",
          options: [
            {
              style: "cocky",
              text: "Missed me that bad, speed demon?",
              affection: 2,
              reply: "b2-reply-cocky",
            },
            {
              style: "sweet",
              text: "I got here as fast as I could.",
              affection: 3,
              reply: "b2-reply-sweet",
            },
            {
              style: "honest",
              text: "I've been thinking about it too.",
              affection: 4,
              requiresAffection: 6,
              reply: "b2-reply-honest",
            },
          ],
        },
      },
      {
        lines: [
          { id: "b2-p5", text: "\"Alright, good boy. Sit.\"" },
          { id: "b2-p6", text: "\"Hands on your cock. Eyes on me. I call the RPM tonight.\"" },
          { id: "b2-p7", text: "\"And {name}? I want to see every drop when you finish.\"" },
        ],
      },
    ],
    post: [
      {
        lines: [
          { id: "b2-q1", text: "She's still buzzing — but softer now, like the engine's idling." },
          { id: "b2-q2", text: "\"Holy SHIT, champ. You actually listened to every beat.\"" },
          { id: "b2-q3", text: "\"Watching you cum that hard…\" She fans her face. \"Yeah. I'm good at this.\"" },
        ],
        choice: {
          prompt: "She's trying to play it cool. Failing.",
          options: [
            {
              style: "flirty",
              text: "You got off on that too, didn't you?",
              affection: 2,
              reply: "b2-post-flirty",
            },
            {
              style: "sweet",
              text: "You're incredible at this.",
              affection: 3,
              reply: "b2-post-sweet",
            },
            {
              style: "honest",
              text: "This stopped being a rematch a while ago.",
              affection: 4,
              reply: "b2-post-honest",
            },
          ],
        },
      },
      {
        lines: [
          { id: "b2-q4", text: "\"Meet me at redline next time. Before the floor opens.\"" },
          { id: "b2-q5", text: "\"I want you all to myself. No chips. No bets. Just us.\"" },
        ],
      },
    ],
  },
  {
    chapter: 3,
    character: "blaze",
    title: "Redline",
    sceneId: "blaze-redline",
    pre: [
      {
        lines: [
          {
            id: "b3-p1",
            text: "Redline lounge. Door locked. Her crew jacket's on the floor.",
          },
          { id: "b3-p2", text: "\"You came early.\" She sounds stupidly happy about it. \"Good. I hate waiting.\"" },
          {
            id: "b3-p3",
            text: "\"Remember pit lane? When you stroked so hard I forgot my own name?\"",
          },
          { id: "b3-p4", text: "\"Tonight we're going past that. Full throttle, {name}. No holding back.\"" },
        ],
        choice: {
          prompt: "She's close enough that you can feel how fast her heart's going.",
          options: [
            {
              style: "flirty",
              text: "You dressed down for me.",
              affection: 2,
              reply: "b3-reply-flirty",
            },
            {
              style: "sweet",
              text: "I came for you. Not the race.",
              affection: 3,
              reply: "b3-reply-sweet",
            },
            {
              style: "honest",
              text: "I think about you between sessions.",
              affection: 4,
              requiresAffection: 10,
              reply: "b3-reply-honest",
            },
          ],
        },
      },
      {
        lines: [
          { id: "b3-p5", text: "\"Wrap that hand around your cock. Tight grip.\"" },
          { id: "b3-p6", text: "\"I'm gonna run you right up to redline and I want you to CUM for me.\"" },
          { id: "b3-p7", text: "\"Stroke fast. Stroke hard. Good boy — show me what you've got.\"" },
        ],
      },
    ],
    post: [
      {
        lines: [
          { id: "b3-q1", text: "She's breathless. Glowing. Absolutely wrecked in the best way." },
          { id: "b3-q2", text: "\"Fuck. FUCK. {name}, that was—\"" },
          { id: "b3-q3", text: "\"You came so hard I felt it in my chest. Good boy. SO good.\"" },
        ],
        choice: {
          prompt: "She's still staring at the mess you made like it's a trophy.",
          options: [
            {
              style: "cocky",
              text: "Told you I'd beat your best lap.",
              affection: 2,
              reply: "b3-post-cocky",
            },
            {
              style: "honest",
              text: "I don't want this to just be a bet thing.",
              affection: 4,
              requiresAffection: 12,
              reply: "b3-post-honest",
            },
            {
              style: "sweet",
              text: "Stay with me a minute.",
              affection: 3,
              reply: "b3-post-sweet",
            },
          ],
        },
      },
      {
        lines: [
          { id: "b3-q4", text: "\"Pole position. Tomorrow. Before anyone else gets a shot at you.\"" },
          { id: "b3-q5", text: "\"…I'm not sharing you with the table anymore, champ. Deal?\"" },
        ],
      },
    ],
  },
  {
    chapter: 4,
    character: "blaze",
    title: "Pole Position",
    sceneId: "blaze-pole-position",
    pre: [
      {
        lines: [
          {
            id: "b4-p1",
            text: "Private box above the track. Just the two of you and the city lights.",
          },
          { id: "b4-p2", text: "\"Okay so—\" She exhales. \"No bet. No rematch. No bullshit.\"" },
          {
            id: "b4-p3",
            text: "\"You showed up every time. Pit lane. Redline. You let me set the pace and you came so fucking hard for me.\"",
          },
          { id: "b4-p4", text: "\"I'm on your side now, {name}. Completely. So let's do this right.\"" },
        ],
        choice: {
          prompt: "She's loud about everything except how she actually feels.",
          options: [
            {
              style: "honest",
              text: "I think I'm falling for you.",
              affection: 4,
              requiresAffection: 14,
              reply: "b4-reply-honest",
            },
            {
              style: "sweet",
              text: "I'm on your side too.",
              affection: 3,
              reply: "b4-reply-sweet",
            },
            {
              style: "flirty",
              text: "Then make me cum like you mean it.",
              affection: 2,
              reply: "b4-reply-flirty",
            },
          ],
        },
      },
      {
        lines: [
          { id: "b4-p5", text: "\"Hands on your cock, speed demon. I'm taking you all the way home.\"" },
          { id: "b4-p6", text: "\"Stroke for me. Fast when I say fast. Slow when I say slow.\"" },
          { id: "b4-p7", text: "\"And when you cum? I want you looking at ME. Only me.\"" },
        ],
      },
    ],
    post: [
      {
        lines: [
          { id: "b4-q1", text: "She pulls you in before you've even caught your breath." },
          { id: "b4-q2", text: "\"There he is. My champion. My good boy.\"" },
          { id: "b4-q3", text: "\"You did so, so well. I'm so fucking proud of you, {name}.\"" },
        ],
        choice: {
          prompt: "Her voice dropped to something almost gentle.",
          options: [
            {
              style: "sweet",
              text: "I always want to come back to you.",
              affection: 3,
              reply: "b4-post-sweet",
            },
            {
              style: "honest",
              text: "This was never really about racing, was it?",
              affection: 4,
              reply: "b4-post-honest",
            },
          ],
        },
      },
      {
        lines: [
          { id: "b4-q4", text: "\"Whenever you need me — I'm here. Same lane. Always.\"" },
          { id: "b4-q5", text: "\"Now get some rest, champ.\" She kisses your temple. \"Winner's circle is yours.\"" },
        ],
      },
    ],
  },
];

export const BLAZE_REPLIES: Record<string, string> = {
  "b1-reply-cocky":
    "\"HA! BIG talk!\" She's instantly lit up, leaning over the rail. \"Okay, okay — you asked for it. I'm not going easy. Wrap that hand around your cock and PROVE it, speed demon.\"",
  "b1-reply-sweet":
    "\"…Shut up.\" She's absolutely blushing. \"I wanted a rematch. That's all. Obviously.\" She won't meet your eyes. \"…Don't make it weird. We're racing.\"",
  "b1-reply-shy":
    "She freezes for exactly one second. \"…No. Maybe. LOOK — are we doing this or not?\" Her ears are red. \"Because I've got a pace queued up and you're wasting daylight, champ.\"",
  "b1-post-cocky":
    "\"YOU'RE ON!\" She's already reaching for imaginary chips. \"Tomorrow. I'm training for this now. And when you cum? I'm gonna watch every second.\"",
  "b1-post-honest":
    "She goes quiet, which for her is enormous. \"…Yeah. I know.\" She kicks the rail lightly. \"Took you long enough to say it. Now sit down — I've got a pace for you.\"",
  "b1-post-flirty":
    "\"I— NO.\" She's blushing so hard it's visible in the neon. \"…Maybe a little. Shut UP. Hands on your cock. We're not done.\"",
  "b2-reply-cocky":
    "\"Missed you?\" She scoffs — badly. \"I missed WINNING. That's what I missed.\" She steps closer. \"…Okay, fine. A little. Now sit down before I change my mind, good boy.\"",
  "b2-reply-sweet":
    "\"Good.\" She sounds relieved she doesn't have to pretend. \"Because I've been sitting here replaying yesterday and my heart's doing like a hundred and forty BPM.\"",
  "b2-reply-honest":
    "Her whole face softens. \"…Yeah?\" She laughs, breathless. \"Me too. Every night since the rematch. I kept telling myself it was about the bet.\" She shakes her head. \"Liar. Sit. Let me take care of you.\"",
  "b2-post-flirty":
    "\"SO WHAT if I did.\" She's not even pretending anymore. \"Watching you stroke that hard cock to my beat? Best view in the pit. I'd do it every night.\"",
  "b2-post-sweet":
    "\"Damn RIGHT I am.\" She puffs up, then deflates into something genuine. \"Nobody's ever listened to my pace like that. You're… you're really good at this, champ.\"",
  "b2-post-honest":
    "She nods slowly. \"…Yeah. I know.\" No argument. \"Stopped being about chips around lap three yesterday. I just wanted to hear you moan when you came.\" She blushes. \"…Too much?\"",
  "b3-reply-flirty":
    "\"I did NOT dress down for—\" She's wearing significantly less than pit lane. \"…Okay. FINE. Yes. For you. Happy?\" She points at your lap. \"Now get that cock out. I've been waiting all day.\"",
  "b3-reply-sweet":
    "\"For ME.\" She repeats it like she's testing the weight. \"…Yeah. I know. That's why I locked the door.\" She grins, shaky and real. \"Nobody else gets this lap, {name}.\"",
  "b3-reply-honest":
    "She's quiet for a beat — rare for Blaze. \"…Between sessions?\" Her voice drops. \"Me too. Every time. I kept making up excuses to find you.\" She takes your hand. \"Okay. Enough talking. Stroke for me.\"",
  "b3-post-cocky":
    "\"You DID!\" She's grinning, breathless, proud. \"New personal best, speed demon. I'm putting that on a banner.\" She bumps your shoulder. \"…Seriously though. That was incredible. Good boy.\"",
  "b3-post-honest":
    "\"…I know.\" Her hand finds yours. \"Stopped being a bet thing after pit lane. Maybe before.\" She looks away, cheeks hot. \"I just like watching you feel good. Is that… is that okay?\"",
  "b3-post-sweet":
    "\"A minute.\" She settles in against you. It's obviously going to be longer. \"…Maybe the whole night. I don't care. You're not going anywhere, champ.\"",
  "b4-reply-honest":
    "She goes completely still. Then: \"…Don't— don't say shit like that so easy.\" She's blushing furiously. \"…Yeah. Me too. Obviously. Now sit down before I cry or something stupid.\"",
  "b4-reply-sweet":
    "\"Good.\" She exhales like she's been holding it for weeks. \"Because I'm not pretending anymore. You're my guy, {name}. Now let me make you cum like the champion you are.\"",
  "b4-reply-flirty":
    "\"Oh I WILL.\" She's already in your space, eyes blazing. \"I'm gonna run you so hard you see stars, good boy. And you're gonna cum looking right at me. Bet on it.\"",
  "b4-post-sweet":
    "\"Always.\" No hesitation. \"You hear me? ALWAYS.\" She squeezes your hand. \"Rivals, bets, whatever — you're mine now, champ. And I'm yours.\"",
  "b4-post-honest":
    "\"Never was.\" She laughs, soft for once. \"I just needed an excuse to watch you stroke your cock until you came for me.\" She kisses your cheek. \"Best excuse I ever made up.\"",
};
