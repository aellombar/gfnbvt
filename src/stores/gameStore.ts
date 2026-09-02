"use client";

import { create } from "zustand";
import {
  createEmptySave,
  encodeSave,
  type SaveSettings,
  type SaveState,
} from "@/lib/save/SaveCodec";
import {
  getActiveSlot,
  loadSlot,
  saveSlot,
  setActiveSlot,
  clearSlot,
} from "@/lib/save/SlotManager";
import { today } from "@/lib/dialogue/MoodSystem";
import type { CharacterId, ResponseStyle } from "@/lib/types";

const AGE_KEY = "baddie-casino:age-ok";

interface GameStore {
  hydrated: boolean;
  ageVerified: boolean;
  slot: number;
  save: SaveState;

  hydrate: () => void;
  verifyAge: () => void;

  setPlayerName: (name: string) => void;
  setPetName: (name: string) => void;
  updateSettings: (patch: Partial<SaveSettings>) => void;

  addChips: (amount: number) => void;
  addAffection: (character: CharacterId, amount: number) => void;
  recordStyle: (character: CharacterId, style: ResponseStyle) => void;
  unlockOutfit: (character: CharacterId, outfit: string) => void;
  completeScene: (
    character: CharacterId,
    sceneId: string,
    outfit: string,
    elapsedMs: number,
    peakBpm: number,
  ) => void;

  switchSlot: (slot: number) => void;
  importSave: (state: SaveState, slot?: number) => void;
  resetSlot: (slot: number) => void;
  exportCode: () => string;
}

function persist(slot: number, save: SaveState): void {
  saveSlot(slot, save);
}

export const useGameStore = create<GameStore>((set, get) => ({
  hydrated: false,
  ageVerified: false,
  slot: 0,
  save: createEmptySave(),

  hydrate: () => {
    if (get().hydrated) return;
    const slot = getActiveSlot();
    const save = loadSlot(slot) ?? createEmptySave();
    const ageVerified =
      typeof window !== "undefined" &&
      window.localStorage.getItem(AGE_KEY) === "1";
    set({ hydrated: true, slot, save, ageVerified });
  },

  verifyAge: () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AGE_KEY, "1");
    }
    set({ ageVerified: true });
  },

  setPlayerName: (name) =>
    set((s) => {
      const save = { ...s.save, playerName: name };
      persist(s.slot, save);
      return { save };
    }),

  setPetName: (name) =>
    set((s) => {
      const save = { ...s.save, petName: name };
      persist(s.slot, save);
      return { save };
    }),

  updateSettings: (patch) =>
    set((s) => {
      const save = { ...s.save, settings: { ...s.save.settings, ...patch } };
      persist(s.slot, save);
      return { save };
    }),

  addChips: (amount) =>
    set((s) => {
      const save = { ...s.save, chips: Math.max(0, s.save.chips + amount) };
      persist(s.slot, save);
      return { save };
    }),

  addAffection: (character, amount) =>
    set((s) => {
      const current = s.save.characters[character];
      const save = {
        ...s.save,
        characters: {
          ...s.save.characters,
          [character]: {
            ...current,
            affection: current.affection + amount,
          },
        },
      };
      persist(s.slot, save);
      return { save };
    }),

  recordStyle: (character, style) =>
    set((s) => {
      const current = s.save.characters[character];
      const save = {
        ...s.save,
        characters: {
          ...s.save.characters,
          [character]: {
            ...current,
            styleCounts: {
              ...current.styleCounts,
              [style]: (current.styleCounts[style] ?? 0) + 1,
            },
          },
        },
      };
      persist(s.slot, save);
      return { save };
    }),

  unlockOutfit: (character, outfit) =>
    set((s) => {
      const current = s.save.characters[character];
      if (current.unlockedOutfits.includes(outfit)) return s;
      const save = {
        ...s.save,
        characters: {
          ...s.save.characters,
          [character]: {
            ...current,
            unlockedOutfits: [...current.unlockedOutfits, outfit],
          },
        },
      };
      persist(s.slot, save);
      return { save };
    }),

  completeScene: (character, sceneId, outfit, elapsedMs, peakBpm) =>
    set((s) => {
      const current = s.save.characters[character];
      const completedScenes = current.completedScenes.includes(sceneId)
        ? current.completedScenes
        : [...current.completedScenes, sceneId];
      const unlockedOutfits = current.unlockedOutfits.includes(outfit)
        ? current.unlockedOutfits
        : [...current.unlockedOutfits, outfit];

      const day = today();
      const stats = s.save.stats;
      const streakDays =
        stats.lastPlayedDay === day
          ? Math.max(1, stats.streakDays)
          : stats.lastPlayedDay === day - 1
            ? stats.streakDays + 1
            : 1;

      const save: SaveState = {
        ...s.save,
        chips: s.save.chips + 60,
        characters: {
          ...s.save.characters,
          [character]: {
            ...current,
            // Chapters unlock in order, so the arc always progresses.
            chapter: Math.max(current.chapter, current.chapter + 1),
            completedScenes,
            unlockedOutfits,
          },
        },
        stats: {
          sessionsCompleted: stats.sessionsCompleted + 1,
          longestSessionMs: Math.max(stats.longestSessionMs, elapsedMs),
          peakBpm: Math.max(stats.peakBpm, peakBpm),
          streakDays,
          lastPlayedDay: day,
        },
      };
      persist(s.slot, save);
      return { save };
    }),

  switchSlot: (slot) => {
    setActiveSlot(slot);
    const save = loadSlot(slot) ?? createEmptySave();
    set({ slot, save });
  },

  importSave: (state, slot) =>
    set((s) => {
      const target = slot ?? s.slot;
      persist(target, state);
      setActiveSlot(target);
      return { slot: target, save: state };
    }),

  resetSlot: (slot) =>
    set((s) => {
      clearSlot(slot);
      if (slot !== s.slot) return s;
      const save = createEmptySave();
      persist(slot, save);
      return { save };
    }),

  exportCode: () => encodeSave(get().save),
}));
