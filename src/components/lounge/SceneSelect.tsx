"use client";

import { chaptersFor } from "@/data";
import { getScene } from "@/data/scenes";
import { MOOD_BLURBS, MOOD_LABELS, moodFor } from "@/lib/dialogue/MoodSystem";
import { dropPngUrl } from "@/lib/art/dropUrl";
import { DEFAULT_SHOT } from "@/lib/art/shots";
import type { CharacterProgress } from "@/lib/save/SaveCodec";
import type { CharacterProfile, Difficulty } from "@/lib/types";

const DIFFICULTIES: { id: Difficulty; label: string; blurb: string }[] = [
  { id: "soft", label: "Soft", blurb: "Slower · shorter · forgiving" },
  { id: "standard", label: "Standard", blurb: "Mostly fast · one breather" },
  { id: "intense", label: "Intense", blurb: "Longest sprints · briefest rest" },
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
    <div
      data-signal
      style={{ ["--signal" as string]: profile.theme.primary }}
      className="animate-[cut-in_180ms_steps(3,end)_both]"
    >
      <button type="button" onClick={onBack} className="tag hover:text-paper">
        ← all channels
      </button>

      {/* Masthead. */}
      <div className="mt-5 border-b border-rule pb-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="tag" style={{ color: profile.theme.primary }}>
              {profile.archetype}
            </p>
            <h2 className="display mt-1 text-6xl sm:text-7xl">{profile.name}</h2>
          </div>

          <dl className="grid grid-cols-3 gap-x-6 text-right">
            {[
              { k: "affection", v: String(progress.affection) },
              { k: "outfits", v: String(progress.unlockedOutfits.length) },
              { k: "mood", v: MOOD_LABELS[mood] },
            ].map((item) => (
              <div key={item.k}>
                <dt className="tag">{item.k}</dt>
                <dd className="data mt-1 text-sm">{item.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="mt-3 text-sm italic text-paper-dim">{MOOD_BLURBS[mood]}</p>
      </div>

      {/* Pace tier as a segmented switch. */}
      <div className="mt-6">
        <p className="tag">pace tier</p>
        <div className="mt-2 grid border border-rule sm:grid-cols-3">
          {DIFFICULTIES.map((tier, index) => {
            const active = tier.id === difficulty;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => onDifficulty(tier.id)}
                className={`px-4 py-3 text-left transition-colors ${
                  index > 0 ? "border-t border-rule sm:border-l sm:border-t-0" : ""
                }`}
                style={
                  active
                    ? { background: profile.theme.primary, color: "#08080a" }
                    : undefined
                }
              >
                <div className="flex items-center gap-2">
                  <span className="data text-xs font-bold uppercase tracking-[0.16em]">
                    {tier.label}
                  </span>
                  {tier.id === suggested && !active && (
                    <span className="tag" style={{ color: "var(--color-warn)" }}>
                      suggested
                    </span>
                  )}
                </div>
                <p
                  className={`mt-1 text-[11px] ${
                    active ? "text-ink/70" : "text-paper-dim"
                  }`}
                >
                  {tier.blurb}
                </p>
              </button>
            );
          })}
        </div>
        <p className="tag mt-2">
          tiers change pacing only — more fast stroking, never more edging
        </p>
      </div>

      {/* Episode list. */}
      <div className="mt-8 border-t border-rule">
        {chapters.map((chapter) => {
          const scene = getScene(chapter.sceneId);
          const unlocked = chapter.chapter <= progress.chapter;
          const completed = progress.completedScenes.includes(chapter.sceneId);
          const shots = scene
            ? Array.from(
                new Set(
                  scene.segments.map(
                    (segment) => segment.shot ?? DEFAULT_SHOT[segment.kind],
                  ),
                ),
              )
            : [];
          const thumb = dropPngUrl(chapter.sceneId, 0);

          return (
            <div
              key={chapter.sceneId}
              className={`border-b border-rule ${unlocked ? "" : "opacity-40"}`}
            >
              <div className="grid grid-cols-[5.5rem_1fr] gap-0 sm:grid-cols-[8.5rem_1fr]">
                <div className="relative overflow-hidden border-r border-rule bg-ink">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumb}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
                    draggable={false}
                  />
                  <span className="absolute left-1.5 top-1.5 data text-[10px] text-paper">
                    {String(chapter.chapter).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex flex-wrap items-start justify-between gap-4 p-4 sm:p-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="display text-2xl">{chapter.title}</h3>
                      {completed && (
                        <span className="tag">· seen</span>
                      )}
                    </div>

                    <p className="tag mt-2">{scene?.outfit}</p>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                      {scene?.intensity.map((item) => (
                        <span key={item} className="tag">
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                      {shots.map((shot) => (
                        <span
                          key={shot}
                          className="tag"
                          style={{ color: profile.theme.primary }}
                        >
                          {SHOT_LABELS[shot]}
                        </span>
                      ))}
                    </div>

                    {!unlocked && (
                      <p className="tag mt-3">
                        finish ch {String(chapter.chapter - 1).padStart(2, "0")}{" "}
                        first — her story runs in order
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={!unlocked}
                    onClick={() => onStart(chapter.chapter)}
                    className={unlocked ? "btn-paper" : "btn-ghost"}
                  >
                    {unlocked ? (completed ? "Replay" : "Begin") : "Locked"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
