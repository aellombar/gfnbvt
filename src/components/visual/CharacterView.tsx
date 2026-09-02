"use client";

import { CharacterStage } from "@/components/visual/CharacterStage";
import { ImageStage } from "@/components/visual/ImageStage";
import { SceneArtStage } from "@/components/visual/SceneArtStage";
import { useRigManifest } from "@/lib/art/useRigManifest";
import { useSceneArt } from "@/lib/art/useSceneArt";
import type { ArtState, CharacterProfile, ShotKind } from "@/lib/types";

interface CharacterViewProps {
  profile: CharacterProfile;
  art: ArtState;
  outfitLayer: number;
  background: string;
  speaking: boolean;
  strokePosition: () => number;
  beatPhase: () => number;
  shot: ShotKind;
  intensity: number;
  animate: boolean;
  /** When set, prefer drop-in PNGs from /public/art/{sceneId}/{layer}.png */
  sceneId?: string;
}

/**
 * Drawing order:
 * 1. Per-scene drop-in art at /public/art/{sceneId}/0.png… (easiest — use this)
 * 2. Legacy per-character rig.json packs
 * 3. Procedural SVG placeholder
 */
export function CharacterView(props: CharacterViewProps) {
  const sceneArt = useSceneArt(props.sceneId);
  const { manifest } = useRigManifest(props.profile.id);

  const sceneSrc = sceneArt.srcFor(props.outfitLayer);
  if (sceneSrc) {
    return (
      <SceneArtStage
        src={sceneSrc}
        shot={props.shot}
        intensity={props.intensity}
        animate={props.animate}
        beatPhase={props.beatPhase}
      />
    );
  }

  if (manifest) {
    return (
      <ImageStage
        {...props}
        manifest={manifest}
        characterId={props.profile.id}
      />
    );
  }

  return <CharacterStage {...props} />;
}
