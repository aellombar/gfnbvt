"use client";

import { useEffect, useState } from "react";

/**
 * Dead-simple scene art: drop PNGs in /public/art/{sceneId}/ as 0.png, 1.png…
 * No rig.json. No variants. The game picks the file for the current peel layer.
 */
const cache = new Map<string, number[]>();

async function probeLayer(sceneId: string, layer: number): Promise<boolean> {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const url = `${base}/art/${sceneId}/${layer}.png`;
  try {
    const res = await fetch(url, { method: "HEAD", cache: "force-cache" });
    if (res.ok) return true;
  } catch {
    /* fall through — some hosts reject HEAD */
  }
  try {
    const res = await fetch(url, { method: "GET", cache: "force-cache" });
    return res.ok;
  } catch {
    return false;
  }
}

export function useSceneArt(sceneId: string | undefined): {
  layers: number[] | null;
  loading: boolean;
  srcFor: (outfitLayer: number) => string | null;
} {
  const [layers, setLayers] = useState<number[] | null>(() =>
    sceneId ? (cache.get(sceneId) ?? null) : null,
  );
  const [loading, setLoading] = useState(() =>
    Boolean(sceneId && !cache.has(sceneId)),
  );

  useEffect(() => {
    if (!sceneId) {
      setLayers(null);
      setLoading(false);
      return;
    }
    if (cache.has(sceneId)) {
      setLayers(cache.get(sceneId)!);
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      const found: number[] = [];
      // Probe 0..3 — peels never go past 3 in this game.
      for (let i = 0; i <= 3; i++) {
        if (await probeLayer(sceneId, i)) found.push(i);
      }
      cache.set(sceneId, found);
      if (!cancelled) {
        setLayers(found);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sceneId]);

  const srcFor = (outfitLayer: number): string | null => {
    if (!sceneId || !layers?.length) return null;
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    const available = [...layers].sort((a, b) => a - b);
    // Use the highest layer that exists and is ≤ current peel.
    let pick = available[0];
    for (const layer of available) {
      if (layer <= outfitLayer) pick = layer;
    }
    return `${base}/art/${sceneId}/${pick}.png`;
  };

  return {
    layers: layers && layers.length > 0 ? layers : null,
    loading,
    srcFor,
  };
}
