"use client";

import { useEffect, useState } from "react";

/**
 * Scene art from public/gen/.../DROP/image.png (preferred) or legacy
 * public/art/{sceneId}/{layer}.png.
 *
 * Gen packs live under public/gen/01_raven-first-timer__0/DROP/image.png
 * Manifest: public/gen/manifest.json
 */

type Manifest = Record<string, Record<string, string>>;

const manifestCache: { value: Manifest | null; loading: Promise<Manifest | null> | null } =
  { value: null, loading: null };

const layerCache = new Map<string, { layers: number[]; urls: Record<number, string> }>();

function basePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH ?? "";
}

async function loadManifest(): Promise<Manifest | null> {
  if (manifestCache.value) return manifestCache.value;
  if (manifestCache.loading) return manifestCache.loading;

  manifestCache.loading = (async () => {
    try {
      const res = await fetch(`${basePath()}/gen/manifest.json`, {
        cache: "no-store",
      });
      if (!res.ok) return null;
      const data = (await res.json()) as Manifest;
      manifestCache.value = data;
      return data;
    } catch {
      return null;
    } finally {
      manifestCache.loading = null;
    }
  })();

  return manifestCache.loading;
}

async function probeUrl(url: string): Promise<boolean> {
  try {
    const head = await fetch(url, { method: "HEAD", cache: "no-store" });
    if (head.ok) return true;
  } catch {
    /* some hosts reject HEAD */
  }
  try {
    const get = await fetch(url, { method: "GET", cache: "no-store" });
    return get.ok;
  } catch {
    return false;
  }
}

/** Candidate URLs for one peel layer, preferred first. */
function candidates(
  sceneId: string,
  layer: number,
  manifest: Manifest | null,
): string[] {
  const base = basePath();
  const list: string[] = [];
  const folder = manifest?.[sceneId]?.[String(layer)];
  if (folder) {
    list.push(`${base}/gen/${folder}/DROP/image.png`);
  }
  // Legacy flat drop
  list.push(`${base}/art/${sceneId}/${layer}.png`);
  return list;
}

async function resolveLayer(
  sceneId: string,
  layer: number,
  manifest: Manifest | null,
): Promise<string | null> {
  for (const url of candidates(sceneId, layer, manifest)) {
    if (await probeUrl(url)) return url;
  }
  return null;
}

export function useSceneArt(sceneId: string | undefined): {
  layers: number[] | null;
  loading: boolean;
  srcFor: (outfitLayer: number) => string | null;
} {
  const [entry, setEntry] = useState<{
    layers: number[];
    urls: Record<number, string>;
  } | null>(() => (sceneId ? layerCache.get(sceneId) ?? null : null));
  const [loading, setLoading] = useState(() =>
    Boolean(sceneId && !layerCache.has(sceneId)),
  );

  useEffect(() => {
    if (!sceneId) {
      setEntry(null);
      setLoading(false);
      return;
    }
    if (layerCache.has(sceneId)) {
      setEntry(layerCache.get(sceneId)!);
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      const manifest = await loadManifest();
      const urls: Record<number, string> = {};
      const layers: number[] = [];
      for (let i = 0; i <= 3; i++) {
        const url = await resolveLayer(sceneId, i, manifest);
        if (url) {
          layers.push(i);
          urls[i] = url;
        }
      }
      const next = { layers, urls };
      layerCache.set(sceneId, next);
      if (!cancelled) {
        setEntry(next);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sceneId]);

  const srcFor = (outfitLayer: number): string | null => {
    if (!entry?.layers.length) return null;
    const available = [...entry.layers].sort((a, b) => a - b);
    let pick = available[0];
    for (const layer of available) {
      if (layer <= outfitLayer) pick = layer;
    }
    return entry.urls[pick] ?? null;
  };

  return {
    layers: entry && entry.layers.length > 0 ? entry.layers : null,
    loading,
    srcFor,
  };
}
