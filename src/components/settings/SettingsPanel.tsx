"use client";

import { useCallback, useState } from "react";
import { useGameStore } from "@/stores/gameStore";
import {
  decodeSave,
  describeSave,
  SaveCodeError,
  type SaveState,
} from "@/lib/save/SaveCodec";
import {
  listSlots,
  setSlotLabel,
  type SlotSummary,
} from "@/lib/save/SlotManager";

function Slider({
  label,
  value,
  min = 0,
  max = 1,
  step = 0.05,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  format?: (value: number) => string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between">
        <span className="tag">{label}</span>
        <span className="data text-[11px] text-paper-dim">
          {format ? format(value) : `${Math.round(value * 100)}%`}
        </span>
      </div>
      <input
        type="range"
        className="w-full"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-start justify-between gap-4 border border-rule px-4 py-3 text-left transition-colors hover:bg-ink-3"
    >
      <span>
        <span className="block text-sm">{label}</span>
        <span className="tag mt-1 block normal-case tracking-normal">{hint}</span>
      </span>
      <span
        className={`mt-1 h-4 w-8 shrink-0 p-0.5 transition-colors ${
          checked ? "bg-[var(--signal)]" : "bg-rule"
        }`}
      >
        <span
          className={`block h-3 w-3 transition-transform ${
            checked ? "translate-x-4 bg-ink" : "bg-paper-dim"
          }`}
        />
      </span>
    </button>
  );
}

export function SettingsPanel({ onClose }: { onClose: () => void }) {
  const save = useGameStore((s) => s.save);
  const slot = useGameStore((s) => s.slot);
  const updateSettings = useGameStore((s) => s.updateSettings);
  const setPetName = useGameStore((s) => s.setPetName);
  const setPlayerName = useGameStore((s) => s.setPlayerName);
  const switchSlot = useGameStore((s) => s.switchSlot);
  const importSave = useGameStore((s) => s.importSave);
  const resetSlot = useGameStore((s) => s.resetSlot);
  const exportCode = useGameStore((s) => s.exportCode);

  // This panel only mounts client-side, so reading storage lazily is safe and
  // avoids a cascading setState in an effect.
  const [slots, setSlots] = useState<SlotSummary[]>(() => listSlots());
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [pending, setPending] = useState<SaveState | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const refresh = useCallback(() => setSlots(listSlots()), []);

  const s = save.settings;

  const tryDecode = () => {
    setError("");
    setPending(null);
    try {
      setPending(decodeSave(input));
    } catch (err) {
      setError(
        err instanceof SaveCodeError ? err.message : "That code could not be read.",
      );
    }
  };

  const copy = async () => {
    const value = exportCode();
    setCode(value);
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked — the code is on screen to copy by hand.
    }
  };

  return (
    <div className="animate-[cut-in_180ms_steps(3,end)_both] space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="display text-5xl">Setup</h2>
        <button
          type="button"
          onClick={onClose}
          className="tag hover:text-paper"
        >
          Close
        </button>
      </div>

      <section className="slab space-y-4 p-5">
        <h3 className="tag border-b border-rule pb-2" style={{ color: "#ece7dd" }}>
          Pace
        </h3>
        <Slider
          label="Her speed vs yours"
          value={s.baseSpeed}
          min={0.7}
          max={1.3}
          step={0.05}
          format={(v) => `${v.toFixed(2)}×`}
          onChange={(baseSpeed) => updateSettings({ baseSpeed })}
        />
        <p className="tag normal-case tracking-normal">
          Scales every tempo so her &quot;fast&quot; matches your fast.
        </p>
        <Toggle
          label="Pace mirror"
          hint="She strokes the air so you can copy her rhythm."
          checked={s.paceMirror}
          onChange={(paceMirror) => updateSettings({ paceMirror })}
        />
        <Toggle
          label="Skip warmup"
          hint="Jump straight into the faster phases."
          checked={s.skipWarmup}
          onChange={(skipWarmup) => updateSettings({ skipWarmup })}
        />
      </section>

      <section className="slab space-y-4 p-5">
        <h3 className="tag border-b border-rule pb-2" style={{ color: "#ece7dd" }}>
          Audio
        </h3>
        <Slider
          label="Pulse"
          value={s.pulseVolume}
          onChange={(pulseVolume) => updateSettings({ pulseVolume })}
        />
        <Slider
          label="Her voice"
          value={s.voiceVolume}
          onChange={(voiceVolume) => updateSettings({ voiceVolume })}
        />
        <Slider
          label="Room ambience"
          value={s.ambientVolume}
          onChange={(ambientVolume) => updateSettings({ ambientVolume })}
        />
      </section>

      <section className="slab space-y-4 p-5">
        <h3 className="tag border-b border-rule pb-2" style={{ color: "#ece7dd" }}>
          You
        </h3>
        <label className="block">
          <span className="tag mb-2 block">your name</span>
          <input
            value={save.playerName}
            onChange={(event) => setPlayerName(event.target.value)}
            placeholder="optional"
            className="field"
          />
        </label>
        <label className="block">
          <span className="tag mb-2 block">what she calls you</span>
          <input
            value={save.petName}
            onChange={(event) => setPetName(event.target.value)}
            placeholder="good boy"
            className="field"
          />
        </label>
        <Toggle
          label="Hide the casino"
          hint="Skip the chips entirely and go straight to her."
          checked={s.skipCasino}
          onChange={(skipCasino) => updateSettings({ skipCasino })}
        />
      </section>

      <section className="slab space-y-4 p-5">
        <h3 className="tag border-b border-rule pb-2" style={{ color: "#ece7dd" }}>
          Save slots
        </h3>
        <div className="grid gap-2">
          {slots.map((entry) => (
            <div
              key={entry.slot}
              className={`border px-4 py-3 ${
                entry.slot === slot ? "border-[var(--signal)] bg-ink-3" : "border-rule"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <input
                  value={entry.label}
                  onChange={(event) => {
                    setSlotLabel(entry.slot, event.target.value);
                    refresh();
                  }}
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none"
                />
                <div className="flex gap-2">
                  {entry.slot !== slot && (
                    <button
                      type="button"
                      onClick={() => {
                        switchSlot(entry.slot);
                        refresh();
                      }}
                      className="tag border border-rule px-2 py-1 hover:text-paper"
                    >
                      Use
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      resetSlot(entry.slot);
                      refresh();
                    }}
                    className="tag border border-rule px-2 py-1 hover:text-paper"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <p className="data mt-1 text-[10px] text-paper-dim">{entry.summary}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="slab space-y-4 p-5">
        <h3 className="tag border-b border-rule pb-2" style={{ color: "#ece7dd" }}>
          Transfer progress
        </h3>
        <p className="tag normal-case tracking-normal">
          Export a code to move this slot to another browser or device. No
          account needed.
        </p>

        <button
          type="button"
          onClick={copy}
          className="btn-paper w-full"
        >
          {copied ? "Copied to clipboard" : "Export this slot"}
        </button>
        {code && (
          <p className="data break-all border border-rule bg-ink p-3 text-[11px]" style={{ color: "var(--color-signal-2)" }}>
            {code}
          </p>
        )}

        <div className="pt-2">
          <input
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setPending(null);
              setError("");
            }}
            placeholder="BADDIE-XXXXX-XXXXX-…"
            className="field"
          />
          <button
            type="button"
            onClick={tryDecode}
            disabled={!input.trim()}
            className="btn-ghost mt-2 w-full"
          >
            Check code
          </button>

          {error && <p className="tag mt-2 normal-case tracking-normal" style={{ color: "var(--color-signal)" }}>{error}</p>}

          {pending && (
            <div className="mt-3 border-l-2 bg-ink-3 p-3" style={{ borderColor: "var(--color-signal-2)" }}>
              <p className="data text-[11px]">{describeSave(pending)}</p>
              <p className="tag mt-1 normal-case tracking-normal">
                This will overwrite the slot you are using now.
              </p>
              <button
                type="button"
                onClick={() => {
                  importSave(pending);
                  setPending(null);
                  setInput("");
                  refresh();
                }}
                className="btn-paper mt-3 w-full"
              >
                Load this save
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
