import type { CharacterLines } from "@/lib/types";

/**
 * SEED CONTENT — intentionally small.
 *
 * These lines exist so Blaze is playable and so there is a clear voice sample
 * to match when the full pools get written. See docs/WRITING_PROMPTS.md.
 *
 * Her voice: loud, short, punchy sentences. Slang. Competitive but entirely
 * on your side — she celebrates you like a pit crew. Where Raven whispers,
 * Blaze shouts encouragement.
 */
export const BLAZE_LINES: CharacterLines = {
  phases: {
    warmup: [
      { id: "b-w-1", text: "Okay okay okay — easy start. Warm up with me." },
      { id: "b-w-2", text: "Don't gun it yet, champ. Trust me." },
      { id: "b-w-3", text: "Slow lap first. Then we go." },
      { id: "b-w-4", text: "Look at me. Breathe. Good boy." },
    ],
    groove: [
      { id: "b-g-1", text: "There it is! That's the rhythm, {name}." },
      { id: "b-g-2", text: "Nice. Real nice. Hold that." },
      { id: "b-g-3", text: "You've got a good engine on you, huh?" },
      { id: "b-g-4", text: "Steady. Good boy. I'm watching." },
    ],
    push: [
      { id: "b-p-1", text: "Faster! Come on, you've got more than that!" },
      { id: "b-p-2", text: "Pick it up, champ — pick it up!" },
      { id: "b-p-3", text: "Yeah! Like that! Keep climbing!" },
      { id: "b-p-4", text: "More. I know you've got more, {name}." },
    ],
    sprint: [
      { id: "b-s-1", text: "GO GO GO — don't you dare let up!" },
      { id: "b-s-2", text: "Yes! Yes! That's it, good boy!" },
      { id: "b-s-3", text: "Full throttle! Stay with me!" },
      { id: "b-s-4", text: "You're flying — don't stop, don't stop!" },
      {
        id: "b-s-5",
        text: "Holy— you're actually—",
        kind: "interrupt",
        art: { mouth: "wide", blush: "heavy" },
      },
      {
        id: "b-s-6",
        text: "*okay he's genuinely keeping up, that's so hot*",
        kind: "thought",
      },
    ],
    rest: [
      { id: "b-r-1", text: "Pit stop! Breathe. Ten seconds, that's it." },
      { id: "b-r-2", text: "Easy — cool down a sec. You earned it." },
      { id: "b-r-3", text: "Good boy. Catch your breath, we go again." },
    ],
    finish: [
      { id: "b-f-1", text: "NOW! Go on, {name} — finish it!" },
      { id: "b-f-2", text: "Let it go! You won this, champ!" },
      { id: "b-f-3", text: "That's it — that's it — good boy!" },
    ],
    aftercare: [
      { id: "b-a-1", text: "HA! Look at you. That was awesome." },
      { id: "b-a-2", text: "Seriously — you crushed it. I'm proud of you." },
      { id: "b-a-3", text: "C'mere. Breathe. I've got you." },
    ],
  },
  milestones: {
    25: [{ id: "b-m25-1", text: "Warmed up! Good start, champ." }],
    50: [{ id: "b-m50-1", text: "Halfway! You're doing great, don't ease off!" }],
    75: [{ id: "b-m75-1", text: "Almost! Push, {name}, push!" }],
    90: [{ id: "b-m90-1", text: "Nearly there — stay with me! Good boy!" }],
  },
  peels: [
    { id: "b-peel-1", text: "Eyes up, champ. You earned the view." },
    { id: "b-peel-2", text: "Getting warm in here anyway." },
  ],
};
