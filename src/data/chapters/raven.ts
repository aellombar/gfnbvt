import type { Chapter } from "@/lib/types";

/**
 * Raven's arc: professional dealer to the man she bends house rules for.
 * Praise-forward, explicit, guarded about feelings until she isn't.
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
          { id: "r1-p1", text: "The floor's thinning out. You're still at Raven's table." },
          {
            id: "r1-p2",
            text: "She slides the shoe aside — professional smile, eyes that linger a beat too long.",
          },
          { id: "r1-p3", text: "\"You've been playing since nine.\"" },
          {
            id: "r1-p4",
            text: "\"Most people chase a win. You keep looking at me instead of your cards.\"",
          },
        ],
        choice: {
          prompt: "She waits, one brow raised.",
          options: [
            {
              style: "flirty",
              text: "Hard not to. You're the best view on the floor.",
              affection: 2,
              reply: "r1-pre1-flirty",
            },
            {
              style: "shy",
              text: "…You noticed that?",
              affection: 2,
              reply: "r1-pre1-shy",
            },
            {
              style: "cocky",
              text: "Maybe I'm just that patient.",
              affection: 1,
              reply: "r1-pre1-cocky",
            },
          ],
        },
      },
      {
        lines: [
          { id: "r1-p5", text: "\"Mm.\" She taps the felt once. \"Last hand, then.\"" },
          { id: "r1-p6", text: "\"House closes in ten. You're my last customer tonight.\"" },
          {
            id: "r1-p7",
            text: "\"After that, the table's mine — and I decide what happens at it.\"",
          },
        ],
        choice: {
          prompt: "Her voice drops, just for you.",
          options: [
            {
              style: "honest",
              text: "I'm not here for blackjack anymore.",
              affection: 3,
              reply: "r1-pre2-honest",
            },
            {
              style: "sweet",
              text: "Whatever you want, Raven.",
              affection: 3,
              reply: "r1-pre2-sweet",
            },
            {
              style: "flirty",
              text: "Planning to bend the rules for me?",
              affection: 2,
              reply: "r1-pre2-flirty",
            },
          ],
        },
      },
      {
        lines: [
          { id: "r1-p8", text: "\"Good.\" She pulls the velvet rope across the booth entrance." },
          { id: "r1-p9", text: "\"Hands on your lap. Eyes on me.\"" },
          {
            id: "r1-p10",
            text: "\"I'm going to tell you exactly what to do — and you're going to be so good for me.\"",
          },
        ],
      },
    ],
    post: [
      {
        lines: [
          { id: "r1-q1", text: "She's watching you come down, lips parted, unhurried." },
          { id: "r1-q2", text: "\"You're still hard. I can tell.\"" },
          { id: "r1-q3", text: "\"…Good. That means you meant it.\"" },
        ],
        choice: {
          prompt: "She hasn't looked away once.",
          options: [
            {
              style: "sweet",
              text: "Thank you. That was incredible.",
              affection: 3,
              reply: "r1-post-sweet",
            },
            {
              style: "cocky",
              text: "Told you I'd be good for you.",
              affection: 1,
              reply: "r1-post-cocky",
            },
            {
              style: "honest",
              text: "I didn't know I needed someone to take over like that.",
              affection: 3,
              reply: "r1-post-honest",
            },
          ],
        },
      },
      {
        lines: [
          { id: "r1-q4", text: "\"Come back tomorrow. Same booth.\"" },
          {
            id: "r1-q5",
            text: "\"I want to watch you stroke for me again — slower next time.\"",
          },
          {
            id: "r1-q6",
            text: "\"I'll be thinking about your hands the whole shift. Don't make me wait.\"",
          },
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
          { id: "r2-p1", text: "The booth light is already on when you walk in. Door locked behind you." },
          { id: "r2-p2", text: "\"You're late.\" She doesn't sound mad. \"I noticed you weren't on the floor.\"" },
          {
            id: "r2-p3",
            text: "Vest's gone. Black lace underneath. She knows exactly what she's doing to you.",
          },
        ],
        choice: {
          prompt: "She finally looks up.",
          options: [
            {
              style: "sweet",
              text: "I came back like you asked.",
              affection: 3,
              reply: "r2-pre1-sweet",
            },
            {
              style: "flirty",
              text: "You dressed up for me.",
              affection: 2,
              reply: "r2-pre1-flirty",
            },
            {
              style: "honest",
              text: "I couldn't stop thinking about your voice.",
              affection: 3,
              reply: "r2-pre1-honest",
            },
          ],
        },
      },
      {
        lines: [
          {
            id: "r2-p4",
            text: "\"I haven't stopped either.\" She pours something that isn't on the menu.",
          },
          { id: "r2-p5", text: "\"Management thinks I left an hour ago.\"" },
          {
            id: "r2-p6",
            text: "\"Tonight there's no table, no cards — just you doing what I tell you.\"",
          },
        ],
        choice: {
          prompt: "She leans against the booth frame, watching your reaction.",
          options: [
            {
              style: "flirty",
              text: "And what are you going to tell me to do?",
              affection: 2,
              reply: "r2-pre2-flirty",
            },
            {
              style: "cocky",
              text: "I already know I'm going to make you wet.",
              affection: 2,
              requiresAffection: 6,
              reply: "r2-pre2-cocky",
            },
            {
              style: "sweet",
              text: "I'm yours tonight.",
              affection: 3,
              reply: "r2-pre2-sweet",
            },
          ],
        },
      },
      {
        lines: [
          { id: "r2-p7", text: "\"That's what I wanted to hear.\"" },
          { id: "r2-p8", text: "\"Take it out. Slow. I want to watch you get hard while I talk.\"" },
          {
            id: "r2-p9",
            text: "\"Don't rush. I'm not closing this booth until you cum for me.\"",
          },
        ],
      },
    ],
    post: [
      {
        lines: [
          { id: "r2-q1", text: "She smooths the lace back into place, cheeks flushed." },
          {
            id: "r2-q2",
            text: "\"Watching you stroke for me — I had to squeeze my thighs together.\"",
          },
          { id: "r2-q3", text: "\"I'm still wet. You did that.\"" },
          { id: "r2-q4", text: "\"Don't tell my manager about the booth.\"" },
        ],
        choice: {
          prompt: "She's smiling, barely — and breathing hard.",
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
              text: "…Can I stay until you finish your shift?",
              affection: 3,
              reply: "r2-post-shy",
            },
          ],
        },
      },
      {
        lines: [
          { id: "r2-q5", text: "\"Find me before I clock in next time.\"" },
          { id: "r2-q6", text: "\"I want you all to myself — not whatever the house schedule says.\"" },
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
          { id: "r3-p1", text: "The velvet room is off the floor. No cameras. She's in a silk robe, hair down." },
          {
            id: "r3-p2",
            text: "\"You came early. Again.\" Genuine pleasure in her voice.",
          },
          {
            id: "r3-p3",
            text: "\"Last time you left me thinking about your cock all through my shift.\"",
          },
        ],
        choice: {
          prompt: "She sits beside you instead of across from you.",
          options: [
            {
              style: "honest",
              text: "I think about you between visits.",
              affection: 4,
              requiresAffection: 10,
              reply: "r3-pre1-honest",
            },
            {
              style: "sweet",
              text: "You're worth showing up early for.",
              affection: 3,
              reply: "r3-pre1-sweet",
            },
            {
              style: "flirty",
              text: "Couldn't wait to make you wet again.",
              affection: 2,
              reply: "r3-pre1-flirty",
            },
          ],
        },
      },
      {
        lines: [
          { id: "r3-p4", text: "\"Greedy.\" She likes saying it. \"I like greedy.\"" },
          { id: "r3-p5", text: "\"I've got twenty minutes before they need me on the floor.\"" },
          {
            id: "r3-p6",
            text: "\"Twenty minutes to watch you touch yourself while I tell you how good you look.\"",
          },
        ],
        choice: {
          prompt: "Her knee brushes yours under the table.",
          options: [
            {
              style: "shy",
              text: "You always make me feel like I'm enough.",
              affection: 3,
              reply: "r3-pre2-shy",
            },
            {
              style: "flirty",
              text: "Only twenty? I'll need more.",
              affection: 2,
              reply: "r3-pre2-flirty",
            },
            {
              style: "cocky",
              text: "Bet I can make you cum before your shift starts.",
              affection: 2,
              reply: "r3-pre2-cocky",
            },
          ],
        },
      },
      {
        lines: [
          { id: "r3-p7", text: "\"Bold.\" She puts her hand over yours — not to stop you." },
          { id: "r3-p8", text: "\"Show me. Every time you throb, I feel it between my legs.\"" },
          {
            id: "r3-p9",
            text: "\"Don't look away when you stroke. I want to see you need this.\"",
          },
        ],
      },
    ],
    post: [
      {
        lines: [
          { id: "r3-q1", text: "Somewhere on the floor, a bell rings. She ignores it." },
          { id: "r3-q2", text: "\"Let them wait.\"" },
          {
            id: "r3-q3",
            text: "\"You came so hard for me — and I'm going to be wet through my whole shift thinking about it.\"",
          },
        ],
        choice: {
          prompt: "She hasn't moved away from you.",
          options: [
            {
              style: "sweet",
              text: "Stay with me one more minute.",
              affection: 3,
              reply: "r3-post-sweet",
            },
            {
              style: "honest",
              text: "This isn't just about the sessions anymore.",
              affection: 4,
              reply: "r3-post-honest",
            },
            {
              style: "flirty",
              text: "Think about my cock while you deal.",
              affection: 2,
              reply: "r3-post-flirty",
            },
          ],
        },
      },
      {
        lines: [
          { id: "r3-q4", text: "\"…I already do.\"" },
          { id: "r3-q5", text: "\"Go. I'll find you when I'm off.\"" },
          { id: "r3-q6", text: "\"Next time, no house. Just us.\"" },
        ],
      },
    ],
  },
  {
    chapter: 4,
    character: "raven",
    title: "Off The Clock",
    sceneId: "raven-off-the-clock",
    pre: [
      {
        lines: [
          { id: "r4-p1", text: "Her apartment. Keys still in the door — she pulled you inside." },
          { id: "r4-p2", text: "\"I'm off the clock.\" No dealer voice. Just Raven." },
          {
            id: "r4-p3",
            text: "\"No velvet rope. No booth. No pretending this is house policy.\"",
          },
          { id: "r4-p4", text: "\"You know why you're here.\"" },
        ],
        choice: {
          prompt: "She kicks the door shut behind you.",
          options: [
            {
              style: "honest",
              text: "Because I want you — not the table.",
              affection: 4,
              requiresAffection: 14,
              reply: "r4-pre1-honest",
            },
            {
              style: "flirty",
              text: "To stroke while you tell me how much you missed me.",
              affection: 3,
              reply: "r4-pre1-flirty",
            },
            {
              style: "sweet",
              text: "Because you asked.",
              affection: 3,
              reply: "r4-pre1-sweet",
            },
          ],
        },
      },
      {
        lines: [
          { id: "r4-p5", text: "\"Because I missed your hands.\" She exhales like she's been holding it in." },
          {
            id: "r4-p6",
            text: "\"I laid in bed last night replaying you cumming for me in that booth.\"",
          },
          {
            id: "r4-p7",
            text: "\"Tonight you're going to do it again — and I'm not hiding how wet it makes me.\"",
          },
        ],
        choice: {
          prompt: "She sinks onto the couch, skirt riding up.",
          options: [
            {
              style: "cocky",
              text: "Then get comfortable and watch.",
              affection: 2,
              reply: "r4-pre2-cocky",
            },
            {
              style: "shy",
              text: "I missed you too. More than I should say.",
              affection: 4,
              reply: "r4-pre2-shy",
            },
            {
              style: "flirty",
              text: "Tell me what you want while I stroke.",
              affection: 3,
              reply: "r4-pre2-flirty",
            },
          ],
        },
      },
      {
        lines: [
          { id: "r4-p8", text: "\"I want your eyes on me.\"" },
          { id: "r4-p9", text: "\"Stroke yourself slow. I want to hear you breathe when you get close.\"" },
          {
            id: "r4-p10",
            text: "\"And when you cum — I want you to say my name like you mean it.\"",
          },
        ],
      },
    ],
    post: [
      {
        lines: [
          { id: "r4-q1", text: "She catches her breath, fingers pressed against herself through the fabric." },
          { id: "r4-q2", text: "\"Fuck — watching you —\"" },
          { id: "r4-q3", text: "\"You look so good when you're desperate for me.\"" },
          {
            id: "r4-q4",
            text: "\"I got off watching you cum. Don't look surprised. You earned that.\"",
          },
        ],
        choice: {
          prompt: "Her voice is warm, unguarded in a way the booth never allowed.",
          options: [
            {
              style: "honest",
              text: "I don't want this to end at your door.",
              affection: 4,
              reply: "r4-post-honest",
            },
            {
              style: "sweet",
              text: "You're incredible, Raven.",
              affection: 3,
              reply: "r4-post-sweet",
            },
            {
              style: "flirty",
              text: "Round two?",
              affection: 2,
              reply: "r4-post-flirty",
            },
          ],
        },
      },
      {
        lines: [
          { id: "r4-q5", text: "\"…Stay tonight.\"" },
          {
            id: "r4-q6",
            text: "\"No cards. No rules. Just you — and mornings I don't want to let you leave.\"",
          },
        ],
      },
    ],
  },
  {
    chapter: 5,
    character: "raven",
    title: "House Rules",
    sceneId: "raven-house-rules",
    pre: [
      {
        lines: [
          { id: "r5-p1", text: "Back at the casino — but in her office, door locked." },
          {
            id: "r5-p2",
            text: "\"I wrote new house rules.\" She slides paper across. Your name on every line.",
          },
          { id: "r5-p3", text: "\"Rule one: you're mine after close. Not the table's. Mine.\"" },
        ],
        choice: {
          prompt: "She's been guarding this smile all arc.",
          options: [
            {
              style: "honest",
              text: "I don't need a rule for that.",
              affection: 4,
              requiresAffection: 18,
              reply: "r5-pre1-honest",
            },
            {
              style: "flirty",
              text: "What's the punishment if I disobey?",
              affection: 2,
              reply: "r5-pre1-flirty",
            },
            {
              style: "sweet",
              text: "I want your nights too.",
              affection: 4,
              reply: "r5-pre1-sweet",
            },
          ],
        },
      },
      {
        lines: [
          { id: "r5-p4", text: "\"Rule two: you stroke when I say. Cum when I allow it.\"" },
          {
            id: "r5-p5",
            text: "\"Rule three: I get to tell you how proud I am — and how wet you make me.\"",
          },
          {
            id: "r5-p6",
            text: "\"I've stopped pretending I don't need your attention, sweetheart.\"",
          },
        ],
        choice: {
          prompt: "She leans back, voice low and warm.",
          options: [
            {
              style: "cocky",
              text: "Good. I was tired of sharing you with the floor.",
              affection: 3,
              reply: "r5-pre2-cocky",
            },
            {
              style: "shy",
              text: "I need you too. That's scary.",
              affection: 4,
              reply: "r5-pre2-shy",
            },
            {
              style: "flirty",
              text: "My cock's been yours since the first booth.",
              affection: 3,
              reply: "r5-pre2-flirty",
            },
          ],
        },
      },
      {
        lines: [
          { id: "r5-p7", text: "\"Then prove it.\"" },
          {
            id: "r5-p8",
            text: "\"Hands where I can see. Tell me what you want — explicitly.\"",
          },
          {
            id: "r5-p9",
            text: "\"I want to hear you say you need my praise before you cum for me.\"",
          },
        ],
      },
    ],
    post: [
      {
        lines: [
          { id: "r5-q1", text: "After. She's curled against your shoulder — rare, unguarded." },
          { id: "r5-q2", text: "\"You did so well. So fucking good for me.\"" },
          {
            id: "r5-q3",
            text: "\"I'm keeping you. That's not a line. That's me choosing you.\"",
          },
        ],
        choice: {
          prompt: "She traces your chest, slow.",
          options: [
            {
              style: "sweet",
              text: "Choose me again tomorrow.",
              affection: 3,
              reply: "r5-post-sweet",
            },
            {
              style: "honest",
              text: "I want every night like this.",
              affection: 4,
              reply: "r5-post-honest",
            },
            {
              style: "flirty",
              text: "Only if you watch me stroke again.",
              affection: 2,
              reply: "r5-post-flirty",
            },
          ],
        },
      },
      {
        lines: [
          { id: "r5-q4", text: "\"Tomorrow. And the night after.\"" },
          { id: "r5-q5", text: "\"No more closing the table on strangers.\"" },
          {
            id: "r5-q6",
            text: "\"…Just us. Whenever you want me — I'm already wet thinking about it.\"",
          },
        ],
      },
    ],
  },
];

/** Her reactions, keyed by the reply id on each option. */
export const RAVEN_REPLIES: Record<string, string> = {
  "r1-pre1-flirty":
    "\"…Cute.\" She almost smiles. \"Careful, sweetheart — I hear that on the floor all night. From you it actually lands.\"",
  "r1-pre1-shy":
    "\"Oh, I noticed.\" Her voice drops. \"I notice everything at this table. You've been very patient. I like patient.\"",
  "r1-pre1-cocky":
    "\"Mm.\" She doesn't blink. \"Sweetheart, I've been dealing longer than you've been allowed in this building. Let's find out if you can keep up.\"",
  "r1-pre2-honest":
    "Something shifts in her expression — pleased, careful. \"Good. Then stop pretending the cards matter and listen to me instead.\"",
  "r1-pre2-sweet":
    "\"Whatever I want.\" She repeats it softly, like she's weighing it. \"…Alright. I want you to be honest with me tonight. Can you do that?\"",
  "r1-pre2-flirty":
    "\"I bend house rules for people who earn it.\" Her mouth curves. \"You've been earning it since hand three, sweetheart.\"",
  "r1-post-sweet":
    "\"You're welcome.\" She sounds almost surprised by how much she means it. \"You listened so well. I don't get that often.\"",
  "r1-post-cocky":
    "\"You were.\" A slow, real smile. \"Don't get comfortable — I went easy on you, and we both know it. Next time I won't.\"",
  "r1-post-honest":
    "She goes quiet for a second. \"…Yes. I could tell. That's exactly why I closed the table on everyone else.\"",
  "r2-pre1-sweet":
    "\"You did.\" She says it like it matters. \"…Sit down before I say something I mean, sweetheart.\"",
  "r2-pre1-flirty":
    "\"Don't flatter yourself.\" She absolutely dressed up for you. \"…Fine. Yes. Now sit down and let me look at you.\"",
  "r2-pre1-honest":
    "The teasing drops out of her voice. \"Then you're in the right booth. I haven't stopped hearing you in my head since last night.\"",
  "r2-pre2-flirty":
    "\"I'm going to tell you to take your cock out and stroke slow while I describe exactly what it does to me.\" She holds your gaze. \"That clear enough?\"",
  "r2-pre2-cocky":
    "\"Bold.\" Her thighs press together — she doesn't hide it. \"Good. I want you confident when you touch yourself for me.\"",
  "r2-pre2-sweet":
    "\"Mine tonight.\" She likes how that sounds. \"Then prove it. Hands where I can see them, and don't rush a single thing.\"",
  "r2-post-sweet":
    "\"Good boy.\" Soft, almost fond. \"You keep being this easy to trust and I'll get careless about who knows.\"",
  "r2-post-flirty":
    "\"Bold.\" She laughs under her breath. \"Ask me again next time and I might actually give you an answer worth keeping quiet for.\"",
  "r2-post-shy":
    "Her expression softens all the way through. \"…You never have to ask me that. Not you. Stay as long as you want me.\"",
  "r3-pre1-honest":
    "She's quiet for a long beat. \"…That's not a small thing to say to me. I'm not going to pretend it is, sweetheart.\"",
  "r3-pre1-sweet":
    "\"Flatterer.\" But she doesn't move away. \"Keep talking like that and I'll never make it to the floor on time.\"",
  "r3-pre1-flirty":
    "\"Greedy.\" She sounds delighted. \"Alright. Make me wet before my shift — you've got twenty minutes and my full attention.\"",
  "r3-pre2-shy":
    "\"You are enough.\" Firm, warm — no performance. \"Every single time you show up for me, you prove it. Now let me show you.\"",
  "r3-pre2-flirty":
    "\"Twenty's a start.\" She shifts closer. \"Impress me and I'll find you after close. I always do now.\"",
  "r3-pre2-cocky":
    "\"Bet accepted.\" Her eyes darken. \"Stroke for me. If I'm shaking when I walk onto that floor, you'll know you won.\"",
  "r3-post-sweet":
    "\"A minute.\" She settles in. It is very obviously going to be more than a minute. \"You're worth being late for.\"",
  "r3-post-honest":
    "\"…I know.\" Her hand finds yours on the velvet. \"It stopped being a booth thing the night you came back. Don't make me say when.\"",
  "r3-post-flirty":
    "\"I will.\" No hesitation. \"Every hand I deal, I'll be thinking about your cock in your fist. Go on — give me something to remember.\"",
  "r4-pre1-honest":
    "She exhales like she's been holding that in for weeks. \"Good. Because I want you — not a customer, not a regular. You.\"",
  "r4-pre1-flirty":
    "\"Missed you so much I was wet before you walked in.\" She pulls you closer. \"Now stroke and let me tell you every detail.\"",
  "r4-pre1-sweet":
    "\"I did.\" Simple, honest. \"And you came. That's all I needed, sweetheart. Now get over here.\"",
  "r4-pre2-cocky":
    "\"Comfortable.\" She sinks back, eyes on you. \"Good. I want a front-row seat to how good you are for me.\"",
  "r4-pre2-shy":
    "Her composure cracks — just for a second. \"…Me too. More than I should. I'm not taking it back.\"",
  "r4-pre2-flirty":
    "\"I want to watch you stroke until you're shaking.\" Her voice drops. \"Then I want to hear you cum while I tell you how proud I am.\"",
  "r4-post-honest":
    "\"It doesn't have to.\" She pulls you closer. \"Stay. I mean it. I want your mornings, not just your nights at my table.\"",
  "r4-post-sweet":
    "\"You're incredible.\" She says it like praise, not flattery. \"Watching you come apart for me — that's what I want every time.\"",
  "r4-post-flirty":
    "\"Round two.\" She grins — rare and real. \"Give me five minutes to catch my breath and I'll tell you exactly how I want it.\"",
  "r5-pre1-honest":
    "\"I know you don't.\" She reaches across the desk for your hand. \"I needed to write it down anyway. For me.\"",
  "r5-pre1-flirty":
    "\"Disobey and I edge you until you're begging.\" Warm, not cruel. \"…You'd like that more than you're admitting.\"",
  "r5-pre1-sweet":
    "\"My nights.\" She repeats it, testing the weight. \"…Good. I want those too. All of them, if you'll give them to me.\"",
  "r5-pre2-cocky":
    "\"Good.\" She sounds relieved you said it. \"I'm done sharing you with the floor, sweetheart. You're mine after close.\"",
  "r5-pre2-shy":
    "\"Scary's alright.\" Her thumb traces your knuckles. \"I'm scared too. Doesn't mean I'm letting you go.\"",
  "r5-pre2-flirty":
    "\"Since the first booth.\" She believes you. \"Then stroke for me now and show me you still mean it.\"",
  "r5-post-sweet":
    "\"Tomorrow.\" She says it like a promise, not a schedule. \"And every tomorrow after. I choose you again.\"",
  "r5-post-honest":
    "\"Every night.\" No performance left. \"Yours. Mine. However you want to say it — I'm already yours, sweetheart.\"",
  "r5-post-flirty":
    "\"Only if.\" She kisses your shoulder. \"I want to watch you stroke slow while I tell you how good you've been for me. Deal?\"",
};
