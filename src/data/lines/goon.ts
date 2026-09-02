import type { CharacterId, CharacterLines, Line } from "@/lib/types";

/** Extra lines whose only job is to get him off — praise, cock, cum, now. */
const GOON: Record<CharacterId, Partial<CharacterLines>> = {
  blaze: {
    phases: {
      warmup: [
        { id: "b-gx-w1", text: "Cock out, champ. I want it leaking before the first lap ends." },
        { id: "b-gx-w2", text: "Squeeze that goon meat for me. Tight. Yeah. Good boy." },
      ],
      groove: [
        { id: "b-gx-g1", text: "Pump that cock like you mean to paint me, {name}." },
        { id: "b-gx-g2", text: "Look at my tits bounce and stroke faster. That's an order, good boy." },
      ],
      push: [
        { id: "b-gx-p1", text: "Faster! Milk it! I want a load out of you, speed demon!" },
        { id: "b-gx-p2", text: "Don't edge — climb. Your cock is for CUMMING, champ!" },
      ],
      sprint: [
        { id: "b-gx-s1", text: "GOON THAT COCK — FAST — you're gonna bust for me!" },
        { id: "b-gx-s2", text: "Stroke stroke STROKE — dump it, good boy, DUMP IT!" },
      ],
      rest: [
        { id: "b-gx-r1", text: "Breathe but keep a fist on it. We're not done making you cum." },
      ],
      finish: [
        { id: "b-gx-f1", text: "NOW. Cum. Paint me. Good boy — empty that cock!" },
        { id: "b-gx-f2", text: "Let it shoot, champ! Every drop, all over — YES!" },
        { id: "b-gx-f3", text: "Cum for my tight little outfit, {name}! NOW!" },
      ],
      aftercare: [
        { id: "b-gx-a1", text: "That's my winner. Look at that mess. I'm so proud of you." },
      ],
    },
    peels: [
      { id: "b-gx-peel1", text: "Tiny top, fat tits, your cock in your fist. Stroke while you stare." },
    ],
  },
  miko: {
    phases: {
      warmup: [
        { id: "m-gx-w1", text: "Take that cock out for me, my luck. I want it dripping already." },
        { id: "m-gx-w2", text: "Squeeze it. Tight little strokes. Your blessing is a load, good boy." },
      ],
      groove: [
        { id: "m-gx-g1", text: "Stroke that cock while you look at my chest. Yes — for me, {name}." },
        { id: "m-gx-g2", text: "I want you leaking down your fist. Keep pumping, sweet thing." },
      ],
      push: [
        { id: "m-gx-p1", text: "Faster — please cum for me soon, I need to see you lose it." },
        { id: "m-gx-p2", text: "Work that cock, good boy. Don't you dare slow down." },
      ],
      sprint: [
        { id: "m-gx-s1", text: "Fast, messy, greedy strokes — give me your cum, good boy!" },
        { id: "m-gx-s2", text: "I'm going to make you bust. Stroke! Stroke! Stay with me!" },
      ],
      rest: [
        { id: "m-gx-r1", text: "Soft grip but don't let go. Your cock stays hard for me." },
      ],
      finish: [
        { id: "m-gx-f1", text: "Cum. Right now. Offer it to me, {name} — every spurt, good boy!" },
        { id: "m-gx-f2", text: "Let it out, my luck! Paint your blessing all over!" },
        { id: "m-gx-f3", text: "I want your load. Now. Don't hold a drop." },
      ],
      aftercare: [
        { id: "m-gx-a1", text: "So good for me. Look at all that cum. I'm keeping you." },
      ],
    },
    peels: [
      { id: "m-gx-peel1", text: "Watch my body while you stroke. Tight clothes, tighter fist." },
    ],
  },
  raven: {
    phases: {
      warmup: [
        { id: "r-gx-w1", text: "Show me that cock, sweetheart… I want it aching in your fist." },
        { id: "r-gx-w2", text: "Squeeze. Slow. Get it wet for me. Good boy…" },
      ],
      groove: [
        { id: "r-gx-g1", text: "Stroke that cock like you're going to ruin yourself for me." },
        { id: "r-gx-g2", text: "Look at me… tight little outfit, your fist pumping… mm, yes." },
      ],
      push: [
        { id: "r-gx-p1", text: "Faster, darling. I want a load. Don't be shy." },
        { id: "r-gx-p2", text: "Pump it. I can see you leaking. Good boy… chase it." },
      ],
      sprint: [
        { id: "r-gx-s1", text: "Stroke that cock fast — you're going to cum for me, sweetheart." },
        { id: "r-gx-s2", text: "Don't stop. Milk it. I want you messy. Now." },
      ],
      rest: [
        { id: "r-gx-r1", text: "Keep a hand on it… we're still going to make you cum." },
      ],
      finish: [
        { id: "r-gx-f1", text: "Cum for me. Right now. Every drop, good boy…" },
        { id: "r-gx-f2", text: "Let it spill, {name}. I want to watch you lose it." },
        { id: "r-gx-f3", text: "Give me that load. Don't you dare hold back." },
      ],
      aftercare: [
        { id: "r-gx-a1", text: "That's it… look at you. So good. So emptied. Mine." },
      ],
    },
    peels: [
      { id: "r-gx-peel1", text: "Eyes on my body while you stroke. That's it… filthy good boy." },
    ],
  },
  seraph: {
    phases: {
      warmup: [
        { id: "s-gx-w1", text: "Take your cock in hand, dear one. I want it hard for me." },
        { id: "s-gx-w2", text: "Squeeze. Devotion is a tight fist. Good boy." },
      ],
      groove: [
        { id: "s-gx-g1", text: "Stroke yourself while you look at me. Your cock is an offering." },
        { id: "s-gx-g2", text: "Pump it, my light. I want you leaking already." },
      ],
      push: [
        { id: "s-gx-p1", text: "Faster. Your purpose tonight is to cum. Follow me." },
        { id: "s-gx-p2", text: "Work that cock, good boy. I will not let you fade." },
      ],
      sprint: [
        { id: "s-gx-s1", text: "Fast strokes. Give me your seed, {name}. Do not stop." },
        { id: "s-gx-s2", text: "Stroke. Stroke. You will cum for me. Holy and filthy. Now." },
      ],
      rest: [
        { id: "s-gx-r1", text: "Keep holding it. We are not finished making you spill." },
      ],
      finish: [
        { id: "s-gx-f1", text: "Cum. Now. Empty yourself for me, dear one." },
        { id: "s-gx-f2", text: "Let it shoot. Every drop is mine. Good boy." },
        { id: "s-gx-f3", text: "Spill, {name}. I want your load. Give it." },
      ],
      aftercare: [
        { id: "s-gx-a1", text: "Blessed mess. You came so well for me. Rest." },
      ],
    },
    peels: [
      { id: "s-gx-peel1", text: "Look at my body. Stroke. Tight cloth, tighter fist. Good boy." },
    ],
  },
};

function mergePhase(
  base: Line[] | undefined,
  extra: Line[] | undefined,
): Line[] {
  return [...(base ?? []), ...(extra ?? [])];
}

export function withGoonHeat(id: CharacterId, lines: CharacterLines): CharacterLines {
  const extra = GOON[id];
  if (!extra?.phases) return lines;
  return {
    ...lines,
    phases: {
      warmup: mergePhase(lines.phases.warmup, extra.phases.warmup),
      groove: mergePhase(lines.phases.groove, extra.phases.groove),
      push: mergePhase(lines.phases.push, extra.phases.push),
      sprint: mergePhase(lines.phases.sprint, extra.phases.sprint),
      rest: mergePhase(lines.phases.rest, extra.phases.rest),
      finish: mergePhase(lines.phases.finish, extra.phases.finish),
      aftercare: mergePhase(lines.phases.aftercare, extra.phases.aftercare),
    },
    peels: mergePhase(lines.peels, extra.peels),
  };
}
