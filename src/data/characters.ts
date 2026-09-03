import type { CharacterProfile, CharacterId } from "@/lib/types";

export const CHARACTERS: Record<CharacterId, CharacterProfile> = {
  raven: {
    id: "raven",
    name: "Raven",
    archetype: "Smoky lounge sweetheart",
    tagline:
      "Your regular table, your regular dealer. She never rushes, and she never looks away.",
    petNames: ["sweetheart", "good boy", "darling"],
    theme: { primary: "#ff5fa2", secondary: "#a86bff", glow: "#ff5fa233" },
    rig: {
      hair: "#170f22",
      hairBack: "#0d0815",
      skin: "#f3d6c4",
      outfit: "#2a1730",
      outfitTrim: "#ff5fa2",
      eyes: "#ff4d6d",
    },
    ambientHz: 196,
    homeBackground: "beach",
    chapters: 7,
  },
  miko: {
    id: "miko",
    name: "Miko",
    archetype: "Shrine baddie who spoils you",
    tagline:
      "She calls it luck. She means devotion. Either way, tonight is about you.",
    petNames: ["good boy", "my luck", "sweet thing"],
    theme: { primary: "#ffcf6b", secondary: "#ff7a7a", glow: "#ffcf6b33" },
    rig: {
      hair: "#2b1a1f",
      hairBack: "#1a1013",
      skin: "#f8e2cf",
      outfit: "#f4f1f6",
      outfitTrim: "#e8455f",
      eyes: "#c07a4a",
    },
    ambientHz: 262,
    homeBackground: "beach",
    chapters: 6,
  },
  blaze: {
    id: "blaze",
    name: "Blaze",
    archetype: "Hype street-racer girlfriend",
    tagline:
      "She bet against you, lost, and keeps coming back for a rematch. Loud about it, too.",
    petNames: ["champ", "good boy", "speed demon"],
    theme: { primary: "#ff7a3d", secondary: "#ffd93d", glow: "#ff7a3d33" },
    rig: {
      hair: "#f2643c",
      hairBack: "#c0402a",
      skin: "#f0cfae",
      outfit: "#1f2733",
      outfitTrim: "#ffd93d",
      eyes: "#3ec9d6",
    },
    ambientHz: 220,
    homeBackground: "beach",
    chapters: 6,
  },
  seraph: {
    id: "seraph",
    name: "Seraph",
    archetype: "Soft fallen-angel coach",
    tagline:
      "Calm, patient and absolutely certain. She never raises her voice and you never want to disappoint her.",
    petNames: ["good boy", "dear one", "my light"],
    theme: { primary: "#cbb6ff", secondary: "#8fd7ff", glow: "#cbb6ff33" },
    rig: {
      hair: "#f2ecdf",
      hairBack: "#d8cfbe",
      skin: "#f7e3d4",
      outfit: "#f6f2ea",
      outfitTrim: "#d9b96a",
      eyes: "#8f9ff0",
    },
    ambientHz: 294,
    homeBackground: "beach",
    chapters: 6,
  },
};

export const CHARACTER_IDS: CharacterId[] = [
  "raven",
  "miko",
  "blaze",
  "seraph",
];
