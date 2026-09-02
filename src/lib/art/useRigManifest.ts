"use client";

import { useEffect, useState } from "react";
import type { CharacterId, RigManifest } from "@/lib/types";

const cache = new Map<CharacterId, RigManifest | null>();

/**
 * Looks for real generated art at /characters/{id}/rig.json.
 *
 * When the file is absent the game falls back to the procedural SVG rig, so
 * dropping art in is purely additive — no code changes required.
 */
export function useRigManifest(character: CharacterId): {
  manifest: RigManifest | null;
  loading: boolean;
} {
  const [manifest, setManifest] = useState<RigManifest | null>(
    () => cache.get(character) ?? null,
  );
  const [loading, setLoading] = useState(() => !cache.has(character));

  // Switching character re-reads the cache during render rather than in an
  // effect, which avoids a cascading render.
  const [loadedFor, setLoadedFor] = useState(character);
  if (loadedFor !== character) {
    setLoadedFor(character);
    setManifest(cache.get(character) ?? null);
    setLoading(!cache.has(character));
  }

  useEffect(() => {
    if (cache.has(character)) return;

    let cancelled = false;

    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    fetch(`${base}/characters/${character}/rig.json`, { cache: "force-cache" })
      .then((response) => (response.ok ? response.json() : null))
      .catch(() => null)
      .then((data: RigManifest | null) => {
        cache.set(character, data);
        if (cancelled) return;
        setManifest(data);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [character]);

  return { manifest, loading };
}
