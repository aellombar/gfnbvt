"use client";

import { CharacterView } from "@/components/visual/CharacterView";
import { CHARACTERS, CHARACTER_IDS } from "@/data/characters";
import { chaptersFor, scenesFor } from "@/data";
import { artStateFor } from "@/lib/joi/artStates";
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
    <div className="animate-[fade-up_320ms_ease-out_both] space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Collection</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-xs uppercase tracking-[0.2em] text-white/45 transition hover:text-white"
        >
          Close
        </button>
      </div>

      <section className="panel grid grid-cols-2 gap-4 rounded-2xl p-5 sm:grid-cols-4">
        {[
          { label: "Sessions", value: String(stats.sessionsCompleted) },
          { label: "Longest", value: formatDuration(stats.longestSessionMs) },
          { label: "Peak pace", value: stats.peakBpm ? `${stats.peakBpm} bpm` : "—" },
          { label: "Day streak", value: String(stats.streakDays) },
        ].map((stat) => (
          <div key={stat.label}>
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
              {stat.label}
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums">{stat.value}</p>
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
              <h3 className="text-lg font-semibold">{profile.name}</h3>
              <span className="text-xs text-white/45">
                {completion}% complete · affection {progress.affection}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: totalLayers + 1 }, (_, layer) => {
                const unlocked = layer <= unlockedLayers;
                return (
                  <div
                    key={layer}
                    className={`panel overflow-hidden rounded-2xl ${
                      unlocked ? "" : "opacity-30"
                    }`}
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
                          background={id === "miko" ? "shrine" : "booth"}
                          speaking={false}
                          strokePosition={() => 0}
                          beatPhase={() => 0}
                          shot="body"
                          intensity={0}
                          animate={false}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-white/30">
                          Locked
                        </div>
                      )}
                    </div>
                    <p className="px-3 py-2 text-[11px] text-white/55">
                      {LAYER_NAMES[layer]}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="panel rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                Still to unlock
              </p>
              <ul className="mt-2 space-y-1.5 text-xs text-white/60">
                {scenes.map((scene) => {
                  const done = progress.completedScenes.includes(scene.id);
                  return (
                    <li key={scene.id} className="flex items-center gap-2">
                      <span
                        className={`inline-block h-1.5 w-1.5 rounded-full ${
                          done ? "bg-mint" : "bg-white/25"
                        }`}
                      />
                      <span className={done ? "text-white/40 line-through" : ""}>
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
