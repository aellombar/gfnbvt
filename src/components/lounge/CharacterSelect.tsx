"use client";

import { CharacterStage } from "@/components/visual/CharacterStage";
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

export function CharacterSelect({ progress, onSelect }: CharacterSelectProps) {
  const art = artStateFor("groove", "none", 0);

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {CHARACTER_IDS.map((id) => {
        const profile = CHARACTERS[id];
        const chapters = chaptersFor(id);
        const done = progress[id].completedScenes.length;
        const mood = moodFor(id);

        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className="panel group relative overflow-hidden rounded-3xl text-left transition hover:border-blush/50"
          >
            <div className="relative h-64 overflow-hidden">
              <CharacterStage
                profile={profile}
                art={art}
                outfitLayer={0}
                background={id === "miko" ? "shrine" : "booth"}
                speaking={false}
                strokePosition={() => 0}
                beatPhase={() => 0}
                paceMirror={false}
                intensity={0}
                animate
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-velvet to-transparent" />
              <span
                className="absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{
                  background: profile.theme.glow,
                  color: profile.theme.primary,
                }}
              >
                {MOOD_LABELS[mood]} today
              </span>
            </div>

            <div className="p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-xl font-semibold">{profile.name}</h3>
                <span className="text-[11px] uppercase tracking-[0.16em] text-white/40">
                  {done}/{chapters.length} chapters
                </span>
              </div>
              <p
                className="mt-1 text-xs uppercase tracking-[0.16em]"
                style={{ color: profile.theme.primary }}
              >
                {profile.archetype}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                {profile.tagline}
              </p>
              <p className="mt-3 text-xs italic text-white/40">
                {MOOD_BLURBS[mood]}
              </p>

              <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(done / chapters.length) * 100}%`,
                    background: `linear-gradient(90deg, ${profile.theme.secondary}, ${profile.theme.primary})`,
                  }}
                />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
