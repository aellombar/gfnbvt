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
    chapters: 3,
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
    chapters: 2,
  },
};

export const CHARACTER_IDS: CharacterId[] = ["raven", "miko"];
