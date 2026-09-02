"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AgeGate } from "@/components/AgeGate";
import { PrivacyShield } from "@/components/PrivacyShield";
import { CharacterSelect } from "@/components/lounge/CharacterSelect";
import { SceneSelect } from "@/components/lounge/SceneSelect";
import { Conversation } from "@/components/dialogue/Conversation";
import { JoiPlayer } from "@/components/joi/JoiPlayer";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { Gallery } from "@/components/gallery/Gallery";
import { SlotMachine } from "@/components/games/SlotMachine";
import { Onboarding } from "@/components/Onboarding";
import { CHARACTERS } from "@/data/characters";
import { chapterAt } from "@/data";
import { getScene } from "@/data/scenes";
import { moodFor } from "@/lib/dialogue/MoodSystem";
import { useGameStore } from "@/stores/gameStore";
import type { CharacterId, ChoiceOption, Difficulty } from "@/lib/types";

type Screen =
  | { name: "lounge" }
  | { name: "chapters"; character: CharacterId }
  | { name: "pre"; character: CharacterId; chapter: number }
  | { name: "session"; character: CharacterId; chapter: number }
  | { name: "post"; character: CharacterId; chapter: number }
  | { name: "settings" }
  | { name: "gallery" }
  | { name: "casino" };

export default function Page() {
  const hydrated = useGameStore((s) => s.hydrated);
  const ageVerified = useGameStore((s) => s.ageVerified);
  const save = useGameStore((s) => s.save);
  const hydrate = useGameStore((s) => s.hydrate);
  const verifyAge = useGameStore((s) => s.verifyAge);
  const addAffection = useGameStore((s) => s.addAffection);
  const recordStyle = useGameStore((s) => s.recordStyle);
  const completeScene = useGameStore((s) => s.completeScene);
  const updateSettings = useGameStore((s) => s.updateSettings);
  const addChips = useGameStore((s) => s.addChips);

  const [screen, setScreen] = useState<Screen>({ name: "lounge" });
  const [shielded, setShielded] = useState(false);
  const [lastSummary, setLastSummary] = useState<{
    elapsedMs: number;
    peakBpm: number;
  } | null>(null);
  const [exitNudge, setExitNudge] = useState<string | null>(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const settings = save.settings;

  /** Recommend a tier from how the player has actually been doing. */
  const suggested: Difficulty = useMemo(() => {
    const { sessionsCompleted, longestSessionMs } = save.stats;
    if (sessionsCompleted === 0) return "soft";
    if (longestSessionMs > 6 * 60_000 && sessionsCompleted >= 3)
      return "intense";
    return "standard";
  }, [save.stats]);

  const onChoice = useCallback(
    (character: CharacterId, option: ChoiceOption) => {
      recordStyle(character, option.style);
      if (option.affection) addAffection(character, option.affection);
    },
    [addAffection, recordStyle],
  );

  if (!hydrated) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <p className="text-sm text-white/40">Warming up the lounge…</p>
      </main>
    );
  }

  if (!ageVerified) return <AgeGate onVerified={verifyAge} />;

  if (!save.playerName && save.stats.sessionsCompleted === 0) {
    return <Onboarding />;
  }

  const shield = (
    <PrivacyShield
      onToggle={(hidden) => {
        setShielded(hidden);
      }}
    />
  );

  // Full-bleed screens.
  if (screen.name === "pre" || screen.name === "post") {
    const profile = CHARACTERS[screen.character];
    const chapter = chapterAt(screen.character, screen.chapter);
    const scene = chapter ? getScene(chapter.sceneId) : undefined;
    if (!chapter || !scene) {
      setScreen({ name: "lounge" });
      return null;
    }

    const isPre = screen.name === "pre";
    return (
      <main>
        {shield}
        <Conversation
          key={`${screen.name}-${chapter.sceneId}`}
          profile={profile}
          beats={isPre ? chapter.pre : chapter.post}
          petName={save.petName}
          affection={save.characters[screen.character].affection}
          background={scene.background}
          outfitLayer={isPre ? 0 : 2}
          ctaLabel={isPre ? "Hands off — begin" : "Back to the floor"}
          onChoice={(option) => onChoice(screen.character, option)}
          onDone={() => {
            if (isPre) {
              setScreen({
                name: "session",
                character: screen.character,
                chapter: screen.chapter,
              });
            } else {
              setScreen({ name: "chapters", character: screen.character });
            }
          }}
        />
      </main>
    );
  }

  if (screen.name === "session") {
    const profile = CHARACTERS[screen.character];
    const chapter = chapterAt(screen.character, screen.chapter);
    const scene = chapter ? getScene(chapter.sceneId) : undefined;
    if (!chapter || !scene) {
      setScreen({ name: "lounge" });
      return null;
    }

    return (
      <main>
        {shield}
        <JoiPlayer
          scene={scene}
          profile={profile}
          difficulty={settings.difficulty}
          mood={moodFor(screen.character)}
          petName={save.petName}
          baseSpeed={settings.baseSpeed}
          pulseVolume={settings.pulseVolume}
          ambientVolume={settings.ambientVolume}
          paceMirror={settings.paceMirror}
          skipWarmup={settings.skipWarmup}
          externallyPaused={shielded}
          onComplete={(summary) => {
            setLastSummary(summary);
            completeScene(
              screen.character,
              scene.id,
              scene.outfit,
              summary.elapsedMs,
              summary.peakBpm,
            );
            setScreen({
              name: "post",
              character: screen.character,
              chapter: screen.chapter,
            });
          }}
          onExit={(progress) => {
            setExitNudge(
              progress >= 0.85
                ? "You were so close. Come back when you're ready — she'll wait."
                : null,
            );
            setScreen({ name: "chapters", character: screen.character });
          }}
        />
      </main>
    );
  }

  // Chrome-wrapped screens.
  return (
    <main className="mx-auto min-h-dvh w-full max-w-5xl px-4 pb-16 pt-6 sm:px-6">
      {shield}

      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setScreen({ name: "lounge" })}
          className="text-left"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-blush">
            Baddie Casino
          </p>
          <p className="text-[11px] text-white/35">
            Hands-free · praise only · 18+
          </p>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {!settings.skipCasino && (
            <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs tabular-nums text-gold">
              {save.chips} chips
            </span>
          )}
          {!settings.skipCasino && (
            <button
              type="button"
              onClick={() => setScreen({ name: "casino" })}
              className="rounded-lg border border-white/12 px-3 py-1.5 text-xs transition hover:bg-white/5"
            >
              Table
            </button>
          )}
          <button
            type="button"
            onClick={() => setScreen({ name: "gallery" })}
            className="rounded-lg border border-white/12 px-3 py-1.5 text-xs transition hover:bg-white/5"
          >
            Collection
          </button>
          <button
            type="button"
            onClick={() => setScreen({ name: "settings" })}
            className="rounded-lg border border-white/12 px-3 py-1.5 text-xs transition hover:bg-white/5"
          >
            Settings
          </button>
        </div>
      </header>

      {exitNudge && (
        <div className="panel mb-6 rounded-2xl border-blush/40 p-4 text-sm text-white/75">
          {exitNudge}
          <button
            type="button"
            onClick={() => setExitNudge(null)}
            className="ml-3 text-xs text-white/40 underline"
          >
            dismiss
          </button>
        </div>
      )}

      {lastSummary && screen.name === "lounge" && (
        <div className="panel mb-6 rounded-2xl p-4 text-sm text-white/75">
          Last session: {Math.round(lastSummary.elapsedMs / 1000 / 60)} min at up
          to {lastSummary.peakBpm} bpm. She was impressed.
        </div>
      )}

      {screen.name === "lounge" && (
        <div className="animate-[fade-up_320ms_ease-out_both]">
          <h1 className="mb-1 text-3xl font-semibold tracking-tight sm:text-4xl">
            Who&apos;s dealing tonight?
          </h1>
          <p className="mb-7 text-sm text-white/50">
            Pick a girl. Her mood changes daily, and her story picks up where you
            left it.
          </p>
          <CharacterSelect
            progress={save.characters}
            onSelect={(character) => setScreen({ name: "chapters", character })}
          />
        </div>
      )}

      {screen.name === "chapters" && (
        <SceneSelect
          profile={CHARACTERS[screen.character]}
          progress={save.characters[screen.character]}
          difficulty={settings.difficulty}
          suggested={suggested}
          onDifficulty={(difficulty) => updateSettings({ difficulty })}
          onStart={(chapter) =>
            setScreen({ name: "pre", character: screen.character, chapter })
          }
          onBack={() => setScreen({ name: "lounge" })}
        />
      )}

      {screen.name === "settings" && (
        <SettingsPanel onClose={() => setScreen({ name: "lounge" })} />
      )}

      {screen.name === "gallery" && (
        <Gallery save={save} onClose={() => setScreen({ name: "lounge" })} />
      )}

      {screen.name === "casino" && (
        <SlotMachine
          profile={CHARACTERS.raven}
          chips={save.chips}
          onChips={addChips}
          onJackpot={() =>
            setScreen({
              name: "pre",
              character: "raven",
              chapter: Math.min(
                save.characters.raven.chapter,
                CHARACTERS.raven.chapters,
              ),
            })
          }
          onClose={() => setScreen({ name: "lounge" })}
        />
      )}
    </main>
  );
}
