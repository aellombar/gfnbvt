"use client";

import { CharacterView } from "@/components/visual/CharacterView";
import { CHARACTERS, CHARACTER_IDS } from "@/data/characters";
import { chaptersFor } from "@/data";
import { artStateFor } from "@/lib/joi/artStates";
import { MOOD_BLURBS, MOOD_LABELS, moodFor } from "@/lib/dialogue/MoodSystem";
import type { CharacterProgress } from "@/lib/save/SaveCodec";
import type { CharacterId } from "@/lib/types";

interface CharacterSelectProps {
  progress: Record<CharacterId, CharacterProgress>;
  onSelect: (id: CharacterId) => void;
}

/** Channel list rather than a grid of cards — big index numbers, hard rules. */
export function CharacterSelect({ progress, onSelect }: CharacterSelectProps) {
  const art = artStateFor("groove", "none", 0);

  return (
    <div className="border-t border-rule">
      {CHARACTER_IDS.map((id, index) => {
        const profile = CHARACTERS[id];
        const chapters = chaptersFor(id);
        const done = progress[id].completedScenes.length;
        const mood = moodFor(id);
        const seeded = chapters.length <= 1;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            data-signal
            style={{ ["--signal" as string]: profile.theme.primary }}
            className="group relative block w-full border-b border-rule text-left transition-colors hover:bg-ink-2"
          >
            <div className="grid grid-cols-[3.25rem_1fr] items-stretch sm:grid-cols-[4.5rem_11rem_1fr]">
              {/* Channel number. */}
              <div className="flex items-start justify-center border-r border-rule py-5">
                <span className="data text-xs text-paper-dim">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Preview feed. */}
              <div className="relative hidden h-44 overflow-hidden border-r border-rule sm:block">
                <CharacterView
                  profile={profile}
                  art={art}
                  outfitLayer={0}
                  background={profile.homeBackground}
                  speaking={false}
                  strokePosition={() => 0}
                  beatPhase={() => 0}
                  shot="body"
                  intensity={0}
                  animate
                />
                <span
                  className="absolute left-0 top-0 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-ink"
                  style={{ background: profile.theme.primary }}
                >
                  live
                </span>
              </div>

              {/* Details. */}
              <div className="flex flex-col justify-between gap-4 p-4 sm:p-5">
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="display text-3xl sm:text-4xl">
                      {profile.name}
                    </h3>
                    <span
                      className="tag"
                      style={{ color: profile.theme.primary }}
                    >
                      {profile.archetype}
                    </span>
                  </div>

                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-paper-dim">
                    {profile.tagline}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  <span className="tag">
                    mood · {MOOD_LABELS[mood].toLowerCase()}
                  </span>
                  <span className="tag hidden md:inline">
                    {MOOD_BLURBS[mood]}
                  </span>
                  <span className="data ml-auto text-[11px] text-paper-dim">
                    {done}/{chapters.length} ch
                  </span>
                  {seeded && (
                    <span
                      className="border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.16em]"
                      style={{
                        borderColor: "var(--color-warn)",
                        color: "var(--color-warn)",
                      }}
                    >
                      seed script
                    </span>
                  )}
                </div>

                {/* Progress as a segmented bar, one cell per chapter. */}
                <div className="flex gap-0.5">
                  {chapters.map((chapter, i) => (
                    <span
                      key={chapter.sceneId}
                      className="h-1 flex-1"
                      style={{
                        background:
                          i < done
                            ? profile.theme.primary
                            : "var(--color-rule)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Hover marker. */}
            <span
              className="absolute bottom-0 left-0 top-0 w-[3px] opacity-0 transition-opacity group-hover:opacity-100"
              style={{ background: profile.theme.primary }}
            />
          </button>
        );
      })}
    </div>
  );
}
