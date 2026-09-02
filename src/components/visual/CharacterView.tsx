"use client";

import { SceneArtStage } from "@/components/visual/SceneArtStage";
import { homeSceneId } from "@/lib/art/dropUrl";
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
  sceneId?: string;
}

/**
 * Always render drop-in PNG art. SVG placeholders and old rig packs are gone
 * so they never flash before the photo loads.
 */
export function CharacterView(props: CharacterViewProps) {
  const sceneId = props.sceneId ?? homeSceneId(props.profile.id);
  const sceneArt = useSceneArt(sceneId);
  const sceneSrc = sceneArt.srcFor(props.outfitLayer);

  if (!sceneSrc) return <div className="absolute inset-0 bg-ink" />;

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
