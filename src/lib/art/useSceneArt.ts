"use client";

import { useEffect, useState } from "react";
import { ahegaoPngUrl, dropPngUrl } from "@/lib/art/dropUrl";

/**
 * Scene art drop paths (first hit wins):
 *   1) public/art/{sceneId}/DROP/{layer}.png     ← easiest drag & drop
 *   2) public/gen/{pack}/DROP/image.png          ← numbered packs
 *   3) public/art/{sceneId}/{layer}.png          ← legacy flat
 *
 * Manifest: public/gen/manifest.json
 */

type Manifest = Record<string, Record<string, string>>;

const manifestCache: { value: Manifest | null; loading: Promise<Manifest | null> | null } =
  { value: null, loading: null };

const layerCache = new Map<
  string,
  { layers: number[]; urls: Record<number, string>; ahegaoUrl: string | null }
>();

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

function candidates(
  sceneId: string,
  layer: number,
  manifest: Manifest | null,
): string[] {
  const base = basePath();
  const list: string[] = [];
  list.push(dropPngUrl(sceneId, layer));
  const folder = manifest?.[sceneId]?.[String(layer)];
  if (folder) {
    list.push(`${base}/gen/${folder}/DROP/image.png`);
  }
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

function optimisticEntry(sceneId: string) {
  const urls: Record<number, string> = {};
  const layers: number[] = [];
  for (let i = 0; i <= 3; i++) {
    layers.push(i);
    urls[i] = dropPngUrl(sceneId, i);
  }
  return { layers, urls, ahegaoUrl: ahegaoPngUrl(sceneId) };
}

export function useSceneArt(sceneId: string | undefined): {
  layers: number[] | null;
  loading: boolean;
  ahegaoSrc: string | null;
  srcFor: (outfitLayer: number) => string | null;
} {
  const [entry, setEntry] = useState<{
    layers: number[];
    urls: Record<number, string>;
    ahegaoUrl: string | null;
  } | null>(() => {
    if (!sceneId) return null;
    return layerCache.get(sceneId) ?? optimisticEntry(sceneId);
  });
  const [loading, setLoading] = useState(false);

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

    setEntry(optimisticEntry(sceneId));

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
      const ahegaoHit = await probeUrl(ahegaoPngUrl(sceneId));
      const ahegaoUrl = ahegaoHit ? ahegaoPngUrl(sceneId) : null;
      const next =
        layers.length > 0
          ? { layers, urls, ahegaoUrl }
          : optimisticEntry(sceneId);
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
    ahegaoSrc: entry?.ahegaoUrl ?? null,
    srcFor,
  };
}
