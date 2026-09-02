import type { CharacterLines } from "@/lib/types";

/**
 * Raven speaks slowly, in low velvet sentences with a lot of air in them.
 * She never raises her voice — when the pace climbs she leans closer instead.
 */
export const RAVEN_LINES: CharacterLines = {
  phases: {
    warmup: [
      { id: "r-w-1", text: "There you are. Sit back… I'm not in a hurry." },
      { id: "r-w-2", text: "Slow to start, {name}. Let me set the pace." },
      { id: "r-w-3", text: "Mm. Breathe out for me. That's it." },
      { id: "r-w-4", text: "No rush tonight. You've got me all evening." },
      {
        id: "r-w-5",
        text: "Easy… easy. I like watching you settle in.",
        kind: "spoken",
      },
      {
        id: "r-w-6",
        text: "*he always looks so serious at the start…*",
        kind: "thought",
      },
      { id: "r-w-7", text: "Match me. Slow, deep, all the way.", moods: ["playful"] },
      { id: "r-w-8", text: "Come here. Closer. Good.", moods: ["clingy"] },
      { id: "r-w-9", text: "Mmh… I could stay like this a while.", moods: ["sleepy"] },
    ],
    groove: [
      { id: "r-g-1", text: "That's the rhythm. Right there, sweetheart." },
      { id: "r-g-2", text: "Good boy. Just like that." },
      { id: "r-g-3", text: "You found it. Don't lose it." },
      { id: "r-g-4", text: "Mm… you're already doing so well for me." },
      { id: "r-g-5", text: "Keep it steady. I'll tell you when." },
      { id: "r-g-6", text: "Long strokes, {name}. All the way." },
      { id: "r-g-7", text: "That's my good boy. Stay with me." },
      { id: "r-g-8", text: "Perfect. Absolutely perfect." },
      {
        id: "r-g-9",
        text: "*obedient. I do like that about him.*",
        kind: "thought",
      },
      { id: "r-g-10", text: "See? No rush. Just us." },
    ],
    push: [
      { id: "r-p-1", text: "A little faster now. For me." },
      { id: "r-p-2", text: "Mm-hm. Pick it up, {name}. You've got this." },
      { id: "r-p-3", text: "Faster. Good boy — that's it." },
      { id: "r-p-4", text: "There. Feel me pulling you along?" },
      { id: "r-p-5", text: "Don't slow down. You're doing beautifully." },
      { id: "r-p-6", text: "Keep up with me. I know you can." },
      { id: "r-p-7", text: "Yes… exactly that. Hold it there." },
      { id: "r-p-8", text: "Good. God, you're good at this." },
      { id: "r-p-9", text: "Faster, sweetheart. Don't make me ask twice." },
    ],
    sprint: [
      { id: "r-s-1", text: "Fast now. Fast — stay with me." },
      { id: "r-s-2", text: "That's it. That's it. Don't stop." },
      { id: "r-s-3", text: "Good boy — keep going. Keep going." },
      { id: "r-s-4", text: "Don't you dare slow down on me now." },
      {
        id: "r-s-5",
        text: "You're so—",
        kind: "interrupt",
        art: { mouth: "wide", blush: "heavy" },
      },
      { id: "r-s-6", text: "Faster. Faster. Yes." },
      { id: "r-s-7", text: "Haa… look at you. Perfect." },
      { id: "r-s-8", text: "Stay right there. Right there, {name}." },
      { id: "r-s-9", text: "My good boy. My very good boy." },
      {
        id: "r-s-10",
        text: "*he's actually keeping up… mm.*",
        kind: "thought",
      },
      { id: "r-s-11", text: "Don't stop. Don't stop. I've got you." },
    ],
    rest: [
      { id: "r-r-1", text: "Ease off. Just for a moment. Breathe." },
      { id: "r-r-2", text: "Slow… good. In, and out. You're doing so well." },
      { id: "r-r-3", text: "Catch your breath, sweetheart. I'll wait." },
      { id: "r-r-4", text: "Mm. Look at me while you come down a little." },
      { id: "r-r-5", text: "That's it. Rest. You've earned a second." },
    ],
    finish: [
      { id: "r-f-1", text: "Now. Give it to me, {name}." },
      { id: "r-f-2", text: "Let go, sweetheart. You've earned this." },
      { id: "r-f-3", text: "That's it — that's it — good boy." },
      { id: "r-f-4", text: "Don't hold back. Not from me." },
      { id: "r-f-5", text: "Yes. Yes. Come on, darling." },
    ],
    aftercare: [
      { id: "r-a-1", text: "…there you go. Breathe, sweetheart." },
      { id: "r-a-2", text: "You did so good. I mean that." },
      { id: "r-a-3", text: "Mm. Come here. Stay a minute." },
      { id: "r-a-4", text: "I'm proud of you. Don't laugh — I am." },
      { id: "r-a-5", text: "Rest. I'm not going anywhere." },
    ],
  },
  milestones: {
    25: [
      { id: "r-m25-1", text: "Warmed up nicely. Good boy." },
      { id: "r-m25-2", text: "Mm. You're settling in. I like that." },
    ],
    50: [
      { id: "r-m50-1", text: "Halfway, sweetheart. You're doing so well." },
      { id: "r-m50-2", text: "Look at that. Halfway and still with me." },
    ],
    75: [
      { id: "r-m75-1", text: "Almost. Don't you dare stop now, {name}." },
      { id: "r-m75-2", text: "So close. Stay with me. Faster." },
    ],
    90: [
      { id: "r-m90-1", text: "Nearly there. Good boy. Hold on for me." },
      { id: "r-m90-2", text: "That's it… just a little more. I've got you." },
    ],
  },
  peels: [
    { id: "r-peel-1", text: "…since you've been so good." },
    { id: "r-peel-2", text: "Mm. Eyes up here, sweetheart." },
    { id: "r-peel-3", text: "You earned a look. Keep going." },
  ],
};
