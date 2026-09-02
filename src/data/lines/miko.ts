import type { CharacterLines } from "@/lib/types";

/**
 * Miko is polite and generous, and the politeness keeps slipping into
 * breathless eagerness. Where Raven commands, Miko offers.
 */
export const MIKO_LINES: CharacterLines = {
  phases: {
    warmup: [
      { id: "m-w-1", text: "You came back. I hoped you would." },
      { id: "m-w-2", text: "Let me take care of you tonight. Slowly, first." },
      { id: "m-w-3", text: "Gently, {name}. There's no hurry at all." },
      { id: "m-w-4", text: "Breathe with me. In… and out. Good." },
      { id: "m-w-5", text: "You've been so good today. You deserve this." },
      {
        id: "m-w-6",
        text: "*I've been thinking about this since this morning…*",
        kind: "thought",
      },
      { id: "m-w-7", text: "Start soft for me. I'll take you the rest of the way.", moods: ["clingy"] },
      { id: "m-w-8", text: "Mmm, sleepy tonight? Then let me do the work.", moods: ["sleepy"] },
    ],
    groove: [
      { id: "m-g-1", text: "Yes — just like that. Good boy." },
      { id: "m-g-2", text: "You're doing so well. Really, you are." },
      { id: "m-g-3", text: "Keep that rhythm for me, {name}." },
      { id: "m-g-4", text: "Perfect. You always find it so quickly." },
      { id: "m-g-5", text: "That's it. Nice and steady." },
      { id: "m-g-6", text: "I love watching you like this." },
      { id: "m-g-7", text: "Good boy. Stay right there with me." },
      { id: "m-g-8", text: "Full strokes, please. All the way." },
      {
        id: "m-g-9",
        text: "*he listens so well. it's unfair how much I like it.*",
        kind: "thought",
      },
    ],
    push: [
      { id: "m-p-1", text: "A little faster now — please?" },
      { id: "m-p-2", text: "Faster for me, {name}. You can do it." },
      { id: "m-p-3", text: "Yes! That's the pace. Good boy." },
      { id: "m-p-4", text: "Don't slow down, you're doing so well." },
      { id: "m-p-5", text: "Keep going, keep going — just like that." },
      { id: "m-p-6", text: "You deserve this. Faster. Take it." },
      { id: "m-p-7", text: "Mm — yes. Exactly that." },
      { id: "m-p-8", text: "I've got you. Push a little more." },
    ],
    sprint: [
      { id: "m-s-1", text: "Fast! Fast — stay with me, good boy!" },
      { id: "m-s-2", text: "Don't stop, don't stop, you're so close—" },
      { id: "m-s-3", text: "Yes yes yes — just like that!" },
      {
        id: "m-s-4",
        text: "Haa… you're doing s-so well—",
        kind: "interrupt",
        art: { mouth: "wide", blush: "heavy" },
      },
      { id: "m-s-5", text: "Faster, {name}! Please — don't stop!" },
      { id: "m-s-6", text: "Good boy, good boy, keep going!" },
      { id: "m-s-7", text: "I'm right here. Stay with me. Faster." },
      { id: "m-s-8", text: "You're incredible. Don't you dare stop." },
      {
        id: "m-s-9",
        text: "*ah — I can't look away—*",
        kind: "thought",
      },
    ],
    rest: [
      { id: "m-r-1", text: "Okay — slow. Breathe. You're safe." },
      { id: "m-r-2", text: "Rest a moment. In… out. Good boy." },
      { id: "m-r-3", text: "Just a breath. Then we go again, okay?" },
      { id: "m-r-4", text: "So good. Catch your breath for me." },
    ],
    finish: [
      { id: "m-f-1", text: "Now, {name}. Let go — I want to see." },
      { id: "m-f-2", text: "You've earned every bit of this. Go on." },
      { id: "m-f-3", text: "Yes — yes — good boy, let go!" },
      { id: "m-f-4", text: "Give it to me. Please. You deserve it." },
    ],
    aftercare: [
      { id: "m-a-1", text: "Haa… there. There you go. Breathe." },
      { id: "m-a-2", text: "You did so, so well. I'm proud of you." },
      { id: "m-a-3", text: "Stay. Let me look at you a moment." },
      { id: "m-a-4", text: "Thank you for letting me take care of you." },
      { id: "m-a-5", text: "Come back soon, {name}. I'll be waiting." },
    ],
  },
  milestones: {
    25: [
      { id: "m-m25-1", text: "Good start! You're already so steady." },
      { id: "m-m25-2", text: "Mm, warmed up. Good boy." },
    ],
    50: [
      { id: "m-m50-1", text: "Halfway! You're doing wonderfully, {name}." },
      { id: "m-m50-2", text: "Look at you — halfway and still perfect." },
    ],
    75: [
      { id: "m-m75-1", text: "Almost there! Don't stop, please don't stop." },
      { id: "m-m75-2", text: "So close now. Faster — you've got this!" },
    ],
    90: [
      { id: "m-m90-1", text: "Nearly! Stay with me — good boy, stay!" },
      { id: "m-m90-2", text: "Just a little more. I'm right here." },
    ],
  },
  peels: [
    { id: "m-peel-1", text: "Since you've been so good to me…" },
    { id: "m-peel-2", text: "Ah — don't look away now." },
    { id: "m-peel-3", text: "For you. Only for you." },
  ],
};
