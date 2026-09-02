"use client";

import { CHARACTERS, CHARACTER_IDS } from "@/data/characters";
import { chaptersFor } from "@/data";
import { characterPortraitUrl } from "@/lib/art/dropUrl";
import { MOOD_BLURBS, MOOD_LABELS, moodFor } from "@/lib/dialogue/MoodSystem";
import type { CharacterProgress } from "@/lib/save/SaveCodec";
import type { CharacterId } from "@/lib/types";

interface CharacterSelectProps {
  progress: Record<CharacterId, CharacterProgress>;
  onSelect: (id: CharacterId) => void;
}

export function CharacterSelect({ progress, onSelect }: CharacterSelectProps) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      {CHARACTER_IDS.map((id, index) => {
        const profile = CHARACTERS[id];
        const chapters = chaptersFor(id);
        const done = progress[id].completedScenes.length;
        const mood = moodFor(id);
        const portrait = characterPortraitUrl(id, 0);

        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            data-signal
            style={{ ["--signal" as string]: profile.theme.primary }}
            className="group relative overflow-hidden border border-rule text-left transition-[border-color,transform] hover:-translate-y-0.5 hover:border-[var(--signal)]"
          >
            <div className="relative h-72 overflow-hidden bg-ink sm:h-80">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={portrait}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-[center_36%] transition-transform duration-500 group-hover:scale-[1.06]"
                draggable={false}
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `linear-gradient(to top, ${profile.theme.primary}cc 0%, transparent 55%)`,
                }}
              />
              <span
                className="absolute left-3 top-3 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-ink"
                style={{ background: profile.theme.primary }}
              >
                ch {String(index + 1).padStart(2, "0")} · live
              </span>
              <span className="absolute right-3 top-3 tag text-paper">
                {done}/{chapters.length}
              </span>
            </div>

            <div className="relative -mt-16 px-4 pb-4">
              <h3 className="display text-4xl chroma sm:text-5xl">{profile.name}</h3>
              <p className="tag mt-1" style={{ color: profile.theme.primary }}>
                {profile.archetype}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-paper">
                {profile.tagline}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="tag">mood · {MOOD_LABELS[mood].toLowerCase()}</span>
                <span className="tag hidden sm:inline">{MOOD_BLURBS[mood]}</span>
              </div>
              <div className="mt-3 flex gap-0.5">
                {chapters.map((chapter, i) => (
                  <span
                    key={chapter.sceneId}
                    className="h-1.5 flex-1"
                    style={{
                      background:
                        i < done ? profile.theme.primary : "rgba(255,255,255,0.18)",
                    }}
                  />
                ))}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
