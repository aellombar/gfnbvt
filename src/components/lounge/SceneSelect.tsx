"use client";

import { chaptersFor } from "@/data";
import { getScene } from "@/data/scenes";
import { MOOD_BLURBS, MOOD_LABELS, moodFor } from "@/lib/dialogue/MoodSystem";
import type { CharacterProgress } from "@/lib/save/SaveCodec";
import type { CharacterProfile, Difficulty } from "@/lib/types";

const DIFFICULTIES: { id: Difficulty; label: string; blurb: string }[] = [
  { id: "soft", label: "Soft", blurb: "Slower, shorter, very forgiving" },
  { id: "standard", label: "Standard", blurb: "Mostly fast, one breather" },
  { id: "intense", label: "Intense", blurb: "Longest sprints, briefest rest" },
];

interface SceneSelectProps {
  profile: CharacterProfile;
  progress: CharacterProgress;
  difficulty: Difficulty;
  suggested: Difficulty;
  onDifficulty: (difficulty: Difficulty) => void;
  onStart: (chapter: number) => void;
  onBack: () => void;
}

export function SceneSelect({
  profile,
  progress,
  difficulty,
  suggested,
  onDifficulty,
  onStart,
  onBack,
}: SceneSelectProps) {
  const chapters = chaptersFor(profile.id);
  const mood = moodFor(profile.id);

  return (
    <div className="animate-[fade-up_320ms_ease-out_both]">
      <button
        type="button"
        onClick={onBack}
        className="mb-5 text-xs uppercase tracking-[0.2em] text-white/45 transition hover:text-white"
      >
        ← Back to the floor
      </button>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold">{profile.name}</h2>
          <p
            className="mt-1 text-xs uppercase tracking-[0.18em]"
            style={{ color: profile.theme.primary }}
          >
            {MOOD_LABELS[mood]} · {MOOD_BLURBS[mood]}
          </p>
        </div>
        <div className="text-right text-xs text-white/45">
          <p>Affection {progress.affection}</p>
          <p>{progress.unlockedOutfits.length} outfits unlocked</p>
        </div>
      </div>

      <div className="panel mt-6 rounded-2xl p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-white/45">
          Pace tier
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {DIFFICULTIES.map((tier) => {
            const active = tier.id === difficulty;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => onDifficulty(tier.id)}
                className={`rounded-xl border px-4 py-3 text-left transition ${
                  active
                    ? "border-blush bg-blush/15"
                    : "border-white/12 hover:border-white/25 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{tier.label}</span>
                  {tier.id === suggested && (
                    <span className="rounded-full bg-mint/20 px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] text-mint">
                      suggested
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[11px] leading-snug text-white/50">
                  {tier.blurb}
                </p>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-[11px] text-white/35">
          Tiers only change pacing — more fast stroking, never more edging.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {chapters.map((chapter) => {
          const scene = getScene(chapter.sceneId);
          const unlocked = chapter.chapter <= progress.chapter;
          const completed = progress.completedScenes.includes(chapter.sceneId);

          return (
            <div
              key={chapter.sceneId}
              className={`panel rounded-2xl p-5 transition ${
                unlocked ? "" : "opacity-45"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
                    Chapter {chapter.chapter}
                    {completed && " · replayed"}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">{chapter.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {scene?.intensity.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/12 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-white/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!unlocked}
                  onClick={() => onStart(chapter.chapter)}
                  className={`shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                    unlocked
                      ? "bg-blush text-ink hover:bg-ember"
                      : "cursor-not-allowed border border-white/12 text-white/30"
                  }`}
                >
                  {unlocked
                    ? completed
                      ? "Play again"
                      : "Begin"
                    : "Locked"}
                </button>
              </div>
              {!unlocked && (
                <p className="mt-3 text-[11px] text-white/35">
                  Finish chapter {chapter.chapter - 1} first — her story runs in
                  order.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
