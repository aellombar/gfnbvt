import {
  createEmptySave,
  describeSave,
  type SaveState,
} from "@/lib/save/SaveCodec";

export const SLOT_COUNT = 3;
const KEY = (slot: number) => `baddie-casino:slot:${slot}`;
const ACTIVE_KEY = "baddie-casino:active-slot";
const LABEL_KEY = (slot: number) => `baddie-casino:slot-label:${slot}`;

export interface SlotSummary {
  slot: number;
  label: string;
  used: boolean;
  summary: string;
}

function available(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function loadSlot(slot: number): SaveState | null {
  if (!available()) return null;
  const raw = window.localStorage.getItem(KEY(slot));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SaveState;
  } catch {
    return null;
  }
}

export function saveSlot(slot: number, state: SaveState): void {
  if (!available()) return;
  window.localStorage.setItem(KEY(slot), JSON.stringify(state));
}

export function clearSlot(slot: number): void {
  if (!available()) return;
  window.localStorage.removeItem(KEY(slot));
  window.localStorage.removeItem(LABEL_KEY(slot));
}

export function getSlotLabel(slot: number): string {
  if (!available()) return `Slot ${slot + 1}`;
  return window.localStorage.getItem(LABEL_KEY(slot)) ?? `Slot ${slot + 1}`;
}

export function setSlotLabel(slot: number, label: string): void {
  if (!available()) return;
  window.localStorage.setItem(LABEL_KEY(slot), label);
}

export function getActiveSlot(): number {
  if (!available()) return 0;
  return Number(window.localStorage.getItem(ACTIVE_KEY)) || 0;
}

export function setActiveSlot(slot: number): void {
  if (!available()) return;
  window.localStorage.setItem(ACTIVE_KEY, String(slot));
}

export function listSlots(): SlotSummary[] {
  return Array.from({ length: SLOT_COUNT }, (_, slot) => {
    const state = loadSlot(slot);
    return {
      slot,
      label: getSlotLabel(slot),
      used: state !== null,
      summary: state ? describeSave(state) : "Empty",
    };
  });
}

export function loadActiveOrNew(): SaveState {
  return loadSlot(getActiveSlot()) ?? createEmptySave();
}
