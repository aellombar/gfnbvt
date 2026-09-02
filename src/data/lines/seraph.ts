import type { CharacterLines } from "@/lib/types";

/**
 * SEED CONTENT — intentionally small.
 *
 * These lines exist so Seraph is playable and so there is a clear voice sample
 * to match when the full pools get written. See docs/WRITING_PROMPTS.md.
 *
 * Her voice: measured, meditative, guided-breathing cadence. She never breaks
 * calm — her intensity comes from certainty rather than volume. The most
 * hypnotic of the four.
 */
export const SERAPH_LINES: CharacterLines = {
  phases: {
    warmup: [
      { id: "s-w-1", text: "Breathe in with me. And out. There." },
      { id: "s-w-2", text: "No hurry, dear one. We have time." },
      { id: "s-w-3", text: "Slowly. Let your shoulders drop." },
      { id: "s-w-4", text: "That's it. You're already doing well." },
    ],
    groove: [
      { id: "s-g-1", text: "Beautiful. Keep exactly that rhythm." },
      { id: "s-g-2", text: "Good boy. Steady, just like this." },
      { id: "s-g-3", text: "You follow me so well, {name}." },
      { id: "s-g-4", text: "Yes. Stay there with me a while." },
    ],
    push: [
      { id: "s-p-1", text: "A little faster now. I'll guide you." },
      { id: "s-p-2", text: "Follow me up. Good boy." },
      { id: "s-p-3", text: "Faster, dear one. You're safe." },
      { id: "s-p-4", text: "That's right. Don't be afraid of the pace." },
    ],
    sprint: [
      { id: "s-s-1", text: "Fast now. Stay with me. I'm right here." },
      { id: "s-s-2", text: "Don't stop. You're doing beautifully." },
      { id: "s-s-3", text: "Good boy. Keep going. Keep going." },
      { id: "s-s-4", text: "Yes, {name}. Just like that. Hold it." },
      {
        id: "s-s-5",
        text: "You're doing so—",
        kind: "interrupt",
        art: { mouth: "wide", blush: "heavy" },
      },
      {
        id: "s-s-6",
        text: "*I was not supposed to feel this for a mortal.*",
        kind: "thought",
      },
    ],
    rest: [
      { id: "s-r-1", text: "Ease off. Breathe in… and out. Good." },
      { id: "s-r-2", text: "Rest here a moment. I'm not going anywhere." },
      { id: "s-r-3", text: "Softly now. You've done so well already." },
    ],
    finish: [
      { id: "s-f-1", text: "Now, dear one. Let go for me." },
      { id: "s-f-2", text: "You've earned this. Give it to me." },
      { id: "s-f-3", text: "Yes. Good boy. Let it happen." },
    ],
    aftercare: [
      { id: "s-a-1", text: "There. Breathe. I have you." },
      { id: "s-a-2", text: "You did so well, {name}. I'm proud of you." },
      { id: "s-a-3", text: "Rest against me. Stay as long as you like." },
    ],
  },
  milestones: {
    25: [{ id: "s-m25-1", text: "Settled in nicely. Good boy." }],
    50: [{ id: "s-m50-1", text: "Halfway, dear one. You're doing beautifully." }],
    75: [{ id: "s-m75-1", text: "Almost there. Stay with me. Faster." }],
    90: [{ id: "s-m90-1", text: "So close now. I'm right here. Good boy." }],
  },
  peels: [
    { id: "s-peel-1", text: "I don't need this between us." },
    { id: "s-peel-2", text: "Look at me, dear one. Don't look away." },
  ],
};
