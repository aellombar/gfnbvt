import type { Chapter, Scene } from "@/lib/types";

const BEACH_SEGMENTS: Scene["segments"] = [
  { kind: "warmup", bpm: 70, durationMs: 16000, strokeLength: 180, shot: "body", grip: "open", label: "Sun's on you" },
  { kind: "groove", bpm: 96, durationMs: 24000, strokeLength: 155, shot: "full", grip: "mid", label: "Tide" },
  { kind: "push", bpm: 122, durationMs: 36000, strokeLength: 125, shot: "pace-mirror", grip: "mid", label: "Faster" },
  { kind: "sprint", bpm: 144, durationMs: 52000, strokeLength: 95, shot: "face", grip: "closed", label: "Don't stop" },
  { kind: "rest", bpm: 52, durationMs: 7000, strokeLength: 200, shot: "body", grip: "open", label: "Breathe" },
  { kind: "sprint", bpm: 154, durationMs: 48000, strokeLength: 82, shot: "face", grip: "closed", label: "Empty it" },
  { kind: "finish", bpm: 162, durationMs: 22000, strokeLength: 70, shot: "face", grip: "closed", label: "Cum" },
  { kind: "aftercare", bpm: 46, durationMs: 18000, strokeLength: 210, shot: "body", grip: "open", label: "Salt air" },
];

function beachScene(
  id: string,
  character: Scene["character"],
  chapter: number,
  title: string,
  outfit: string,
): Scene {
  return {
    id,
    character,
    chapter,
    title,
    tier: "afterhours",
    outfit,
    background: "beach",
    ahegao: "progressive",
    intensity: ["Beach", "Tight suit", "Fast finish", "Many angles"],
    paceMirror: true,
    segments: BEACH_SEGMENTS,
    peels: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 },
  };
}

export const BEACH_SCENES: Scene[] = [
  beachScene("blaze-beach-heat", "blaze", 5, "Shore Heat", "Competition Swim"),
  beachScene("blaze-beach-sprint", "blaze", 6, "Low Tide Sprint", "Salt Suit"),
  beachScene("miko-beach-tide", "miko", 5, "Tide Blessing", "Competition Swim"),
  beachScene("miko-beach-sun", "miko", 6, "Noon Offering", "Salt Suit"),
  beachScene("seraph-beach-halo", "seraph", 5, "Halo Tide", "Competition Swim"),
  beachScene("seraph-beach-dune", "seraph", 6, "Dune Prayer", "Salt Suit"),
  beachScene("raven-beach-dusk", "raven", 6, "Dusk Shore", "Competition Swim"),
  beachScene("raven-beach-dawn", "raven", 7, "Dawn Watch", "Salt Suit"),
];

function beachChapter(
  chapter: number,
  character: Chapter["character"],
  title: string,
  sceneId: string,
  pre: string,
  post: string,
): Chapter {
  const tag = `${character[0]}${chapter}`;
  return {
    chapter,
    character,
    title,
    sceneId,
    pre: [
      {
        lines: [
          { id: `${tag}-bp1`, text: pre },
          {
            id: `${tag}-bp2`,
            text: "She's in that tiny competition suit. Arched. Looking up. Waiting for your load.",
          },
          {
            id: `${tag}-bp3`,
            text: `"Cock out, {name}. Beach doesn't care how fast you finish — I do. Good boy."`,
          },
        ],
      },
    ],
    post: [
      {
        lines: [
          { id: `${tag}-bq1`, text: post },
          {
            id: `${tag}-bq2`,
            text: `"That's it. Paint the sand if you have to. I'm so proud of you."`,
          },
        ],
      },
    ],
  };
}

export const BEACH_CHAPTERS: Record<Chapter["character"], Chapter[]> = {
  blaze: [
    beachChapter(5, "blaze", "Shore Heat", "blaze-beach-heat", "Pit's closed. She dragged you to the water in a suit that barely exists.", "\"New track, same champ. I could watch you cum in that sun all day.\""),
    beachChapter(6, "blaze", "Low Tide Sprint", "blaze-beach-sprint", "Tide's out. She's on her knees in the wet sand, suit painted on.", "\"Low tide and a fat nut. That's a win, speed demon.\""),
  ],
  miko: [
    beachChapter(5, "miko", "Tide Blessing", "miko-beach-tide", "She swapped the hakama for a competition suit and the ocean for an altar.", "\"Your blessing's all over my thighs. The tide can have the rest.\""),
    beachChapter(6, "miko", "Noon Offering", "miko-beach-sun", "High sun. Tight white suit. She's looking up like you're the luck.", "\"Noon offering accepted. Good boy. Rest in the shade with me.\""),
  ],
  seraph: [
    beachChapter(5, "seraph", "Halo Tide", "seraph-beach-halo", "Halo against salt sky. Suit so tight it looks like devotion.", "\"You came for me in the light. Blessed mess. My light.\""),
    beachChapter(6, "seraph", "Dune Prayer", "seraph-beach-dune", "Dunes. Arched back. Looking up. She calls it prayer.", "\"Every drop was worship. Stay. The tide can wait.\""),
  ],
  raven: [
    beachChapter(6, "raven", "Dusk Shore", "raven-beach-dusk", "After close she took you to the water. Black competition suit, pink dusk.", "\"Mm… look at you. Emptied on the shore. That's my good boy.\""),
    beachChapter(7, "raven", "Dawn Watch", "raven-beach-dawn", "Sunrise. Same tiny suit. She never looked away.", "\"Dawn and a load. Stay until the sun's fully up, sweetheart.\""),
  ],
};
