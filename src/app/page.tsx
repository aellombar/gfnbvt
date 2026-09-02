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
        <p className="tag animate-[blink_1.1s_steps(2,end)_infinite]">
          [ tuning signal ]
        </p>
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
  const navItems: { id: Screen["name"]; label: string; screen: Screen }[] = [
    { id: "lounge", label: "Channels", screen: { name: "lounge" } },
    ...(settings.skipCasino
      ? []
      : ([
          { id: "casino", label: "Table", screen: { name: "casino" } },
        ] as const)),
    { id: "gallery", label: "Archive", screen: { name: "gallery" } },
    { id: "settings", label: "Setup", screen: { name: "settings" } },
  ];

  return (
    <main className="min-h-dvh">
      {shield}

      {/* Fixed left rail with the wordmark set vertically. */}
      <div className="pointer-events-none fixed inset-y-0 left-0 z-30 hidden w-14 border-r border-rule bg-ink lg:block">
        <p
          className="display absolute left-1/2 top-8 -translate-x-1/2 text-sm"
          style={{ writingMode: "vertical-rl", letterSpacing: "0.34em" }}
        >
          Baddie Casino
        </p>
        <p
          className="tag absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ writingMode: "vertical-rl", letterSpacing: "0.28em" }}
        >
          after hours · 18+
        </p>
      </div>

      <div className="lg:pl-14">
        {/* Status bar. */}
        <div className="sticky top-0 z-20 border-b border-rule bg-ink/95 backdrop-blur-[2px]">
          <div className="mx-auto flex max-w-5xl items-stretch">
            <div className="flex items-center gap-3 border-r border-rule px-4 py-3">
              <span className="rec-dot" />
              <p className="tag lg:hidden">Baddie Casino</p>
              <p className="tag hidden lg:block">on air</p>
            </div>

            <nav className="flex flex-1 items-stretch overflow-x-auto">
              {navItems.map((item) => {
                const active = screen.name === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setScreen(item.screen)}
                    className={`tag border-r border-rule px-4 py-3 whitespace-nowrap transition-colors ${
                      active ? "text-paper" : "hover:text-paper"
                    }`}
                    style={
                      active
                        ? { background: "var(--color-ink-3)", color: "#ece7dd" }
                        : undefined
                    }
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {!settings.skipCasino && (
              <div className="flex items-center gap-2 border-l border-rule px-4 py-3">
                <span className="tag">chips</span>
                <span className="data text-xs" style={{ color: "var(--color-warn)" }}>
                  {String(save.chips).padStart(4, "0")}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto w-full max-w-5xl px-4 pb-20 pt-6 sm:px-6">
          {exitNudge && (
            <div
              className="mb-6 border-l-2 bg-ink-2 p-4 text-sm"
              style={{ borderColor: "var(--color-signal)" }}
            >
              <p className="tag">[ interrupted ]</p>
              <p className="mt-2">{exitNudge}</p>
              <button
                type="button"
                onClick={() => setExitNudge(null)}
                className="tag mt-2 hover:text-paper"
              >
                dismiss
              </button>
            </div>
          )}

          {lastSummary && screen.name === "lounge" && (
            <div className="mb-6 flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-rule pb-4">
              <p className="tag">last session</p>
              <p className="data text-sm">
                {Math.round(lastSummary.elapsedMs / 1000 / 60)} min · peak{" "}
                {lastSummary.peakBpm} bpm
              </p>
              <p className="text-sm text-paper-dim">She was impressed.</p>
            </div>
          )}

          {screen.name === "lounge" && (
            <div className="animate-[cut-in_180ms_steps(3,end)_both]">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h1 className="display text-6xl leading-[0.85] sm:text-8xl">
                  Who&apos;s
                  <br />
                  dealing
                  <br />
                  tonight
                </h1>
                <p className="max-w-xs text-sm leading-relaxed text-paper-dim">
                  Four channels. Her mood rolls over at midnight and her story
                  picks up exactly where you left it.
                </p>
              </div>

              <div className="mt-10">
                <CharacterSelect
                  progress={save.characters}
                  onSelect={(character) =>
                    setScreen({ name: "chapters", character })
                  }
                />
              </div>
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
        </div>
      </div>
    </main>
  );
}
