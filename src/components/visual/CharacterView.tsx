"use client";

import { CharacterStage } from "@/components/visual/CharacterStage";
import { ImageStage } from "@/components/visual/ImageStage";
import { useRigManifest } from "@/lib/art/useRigManifest";
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
}

/**
 * Single entry point for drawing a character.
 *
 * If a generated art pack exists at /characters/{id}/rig.json it is used;
 * otherwise the procedural SVG rig stands in. Every caller is identical
 * either way, so adding art never touches game code.
 */
export function CharacterView(props: CharacterViewProps) {
  const { manifest } = useRigManifest(props.profile.id);

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
