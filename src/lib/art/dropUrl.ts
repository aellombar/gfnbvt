import type { CharacterId } from "@/lib/types";

const HOME_SCENE: Record<CharacterId, string> = {
  raven: "raven-beach-dusk",
  miko: "miko-beach-tide",
  blaze: "blaze-beach-heat",
  seraph: "seraph-beach-halo",
};

export function homeSceneId(character: CharacterId): string {
  return HOME_SCENE[character];
}

export function dropPngUrl(sceneId: string, layer = 0): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}/art/${sceneId}/DROP/${layer}.png`;
}

export function ahegaoPngUrl(sceneId: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}/art/${sceneId}/DROP/ahegao.png`;
}

export function characterPortraitUrl(character: CharacterId, layer = 0): string {
  return dropPngUrl(homeSceneId(character), layer);
}
