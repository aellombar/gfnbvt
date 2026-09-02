"use client";

import { CharacterView } from "@/components/visual/CharacterView";
import { CHARACTERS, CHARACTER_IDS } from "@/data/characters";
import { chaptersFor, scenesFor } from "@/data";
import { artStateFor } from "@/lib/joi/artStates";
import { homeSceneId } from "@/lib/art/dropUrl";
import type { SaveState } from "@/lib/save/SaveCodec";

const LAYER_NAMES = ["Dressed", "Open", "Underneath", "Bare"];

function formatDuration(ms: number): string {
  if (!ms) return "—";
  const total = Math.round(ms / 1000);
  return `${Math.floor(total / 60)}m ${total % 60}s`;
}

export function Gallery({
  save,
  onClose,
}: {
  save: SaveState;
  onClose: () => void;
}) {
  const stats = save.stats;

  return (
    <div className="animate-[cut-in_180ms_steps(3,end)_both] space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="display text-5xl">Archive</h2>
        <button
          type="button"
          onClick={onClose}
          className="tag hover:text-paper"
        >
          Close
        </button>
      </div>

      <section className="grid grid-cols-2 gap-px border border-rule bg-rule sm:grid-cols-4">
        {[
          { label: "Sessions", value: String(stats.sessionsCompleted) },
          { label: "Longest", value: formatDuration(stats.longestSessionMs) },
          { label: "Peak pace", value: stats.peakBpm ? `${stats.peakBpm} bpm` : "—" },
          { label: "Day streak", value: String(stats.streakDays) },
        ].map((stat) => (
          <div key={stat.label} className="bg-ink-2 p-4">
            <p className="tag">{stat.label}</p>
            <p className="data mt-1 text-lg">{stat.value}</p>
          </div>
        ))}
      </section>

      {CHARACTER_IDS.map((id) => {
        const profile = CHARACTERS[id];
        const progress = save.characters[id];
        const chapters = chaptersFor(id);
        const scenes = scenesFor(id);
        const totalLayers = 3;
        const unlockedLayers = Math.min(
          totalLayers,
          progress.completedScenes.length + (progress.completedScenes.length ? 1 : 0),
        );
        const completion = Math.round(
          ((progress.completedScenes.length / chapters.length) * 0.6 +
            (unlockedLayers / totalLayers) * 0.4) *
            100,
        );

        return (
          <section key={id} className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="display text-3xl">{profile.name}</h3>
              <span className="data text-[11px] text-paper-dim">
                {completion}% · aff {progress.affection}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: totalLayers + 1 }, (_, layer) => {
                const unlocked = layer <= unlockedLayers;
                return (
                  <div
                    key={layer}
                    className={`border border-rule bg-ink-2 ${unlocked ? "" : "opacity-30"}`}
                  >
                    <div className="relative h-40">
                      {unlocked ? (
                        <CharacterView
                          profile={profile}
                          art={artStateFor(
                            layer >= 3 ? "sprint" : "groove",
                            "none",
                            0,
                          )}
                          outfitLayer={layer}
                          background={profile.homeBackground}
                          sceneId={homeSceneId(id)}
                          speaking={false}
                          strokePosition={() => 0}
                          beatPhase={() => 0}
                          shot="body"
                          intensity={0}
                          animate={false}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="tag">locked</span>
                        </div>
                      )}
                    </div>
                    <p className="tag border-t border-rule px-3 py-2">
                      {LAYER_NAMES[layer]}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="slab p-4">
              <p className="tag border-b border-rule pb-2">still to unlock</p>
              <ul className="mt-3 space-y-1.5 text-xs text-paper-dim">
                {scenes.map((scene) => {
                  const done = progress.completedScenes.includes(scene.id);
                  return (
                    <li key={scene.id} className="flex items-center gap-2">
                      <span
                        className="inline-block h-1.5 w-1.5"
                        style={{ background: done ? profile.theme.primary : "var(--color-rule)" }}
                      />
                      <span className={done ? "text-paper-dim/50 line-through" : ""}>
                        {scene.title} — {scene.outfit}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        );
      })}
    </div>
  );
}
