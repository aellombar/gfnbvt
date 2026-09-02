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
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="text-white/60">{label}</span>
        <span className="tabular-nums text-white/40">
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
      className="flex w-full items-start justify-between gap-4 rounded-xl border border-white/12 px-4 py-3 text-left transition hover:bg-white/5"
    >
      <span>
        <span className="block text-sm text-white/85">{label}</span>
        <span className="mt-0.5 block text-[11px] text-white/45">{hint}</span>
      </span>
      <span
        className={`mt-1 h-5 w-9 shrink-0 rounded-full p-0.5 transition ${
          checked ? "bg-blush" : "bg-white/15"
        }`}
      >
        <span
          className={`block h-4 w-4 rounded-full bg-white transition ${
            checked ? "translate-x-4" : ""
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
    <div className="animate-[fade-up_320ms_ease-out_both] space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Settings</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-xs uppercase tracking-[0.2em] text-white/45 transition hover:text-white"
        >
          Close
        </button>
      </div>

      <section className="panel space-y-4 rounded-2xl p-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/55">
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
        <p className="text-[11px] text-white/40">
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

      <section className="panel space-y-4 rounded-2xl p-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/55">
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

      <section className="panel space-y-4 rounded-2xl p-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/55">
          You
        </h3>
        <label className="block">
          <span className="mb-2 block text-xs text-white/60">Your name</span>
          <input
            value={save.playerName}
            onChange={(event) => setPlayerName(event.target.value)}
            placeholder="optional"
            className="w-full rounded-xl border border-white/12 bg-black/30 px-4 py-2.5 text-sm outline-none focus:border-blush/60"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs text-white/60">
            What she calls you
          </span>
          <input
            value={save.petName}
            onChange={(event) => setPetName(event.target.value)}
            placeholder="good boy"
            className="w-full rounded-xl border border-white/12 bg-black/30 px-4 py-2.5 text-sm outline-none focus:border-blush/60"
          />
        </label>
        <Toggle
          label="Hide the casino"
          hint="Skip the chips entirely and go straight to her."
          checked={s.skipCasino}
          onChange={(skipCasino) => updateSettings({ skipCasino })}
        />
      </section>

      <section className="panel space-y-4 rounded-2xl p-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/55">
          Save slots
        </h3>
        <div className="grid gap-2">
          {slots.map((entry) => (
            <div
              key={entry.slot}
              className={`rounded-xl border px-4 py-3 ${
                entry.slot === slot
                  ? "border-blush/60 bg-blush/10"
                  : "border-white/12"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <input
                  value={entry.label}
                  onChange={(event) => {
                    setSlotLabel(entry.slot, event.target.value);
                    refresh();
                  }}
                  className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none"
                />
                <div className="flex gap-2">
                  {entry.slot !== slot && (
                    <button
                      type="button"
                      onClick={() => {
                        switchSlot(entry.slot);
                        refresh();
                      }}
                      className="rounded-lg border border-white/15 px-3 py-1 text-xs transition hover:bg-white/5"
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
                    className="rounded-lg border border-white/15 px-3 py-1 text-xs text-white/50 transition hover:bg-white/5"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <p className="mt-1 text-[11px] text-white/40">{entry.summary}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel space-y-4 rounded-2xl p-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/55">
          Transfer progress
        </h3>
        <p className="text-[11px] text-white/45">
          Export a code to move this slot to another browser or device. No
          account needed.
        </p>

        <button
          type="button"
          onClick={copy}
          className="w-full rounded-xl bg-white/10 px-4 py-2.5 text-sm transition hover:bg-white/15"
        >
          {copied ? "Copied to clipboard" : "Export this slot"}
        </button>
        {code && (
          <p className="break-all rounded-xl border border-white/12 bg-black/40 p-3 font-mono text-[11px] tracking-wide text-mint">
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
            className="w-full rounded-xl border border-white/12 bg-black/30 px-4 py-2.5 font-mono text-xs outline-none focus:border-blush/60"
          />
          <button
            type="button"
            onClick={tryDecode}
            disabled={!input.trim()}
            className="mt-2 w-full rounded-xl border border-white/15 px-4 py-2.5 text-sm transition hover:bg-white/5 disabled:opacity-40"
          >
            Check code
          </button>

          {error && <p className="mt-2 text-xs text-blush">{error}</p>}

          {pending && (
            <div className="mt-3 rounded-xl border border-mint/40 bg-mint/10 p-3">
              <p className="text-xs text-white/80">{describeSave(pending)}</p>
              <p className="mt-1 text-[11px] text-white/45">
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
                className="mt-3 w-full rounded-lg bg-mint px-4 py-2 text-xs font-semibold text-ink"
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
