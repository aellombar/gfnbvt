"use client";

import { useEffect, useMemo, useRef } from "react";
import { Spring } from "@/lib/art/SpringChain";
import { SHOT_FRAMING } from "@/lib/art/shots";
import { PHASE_GRADE } from "@/lib/joi/artStates";
import type {
  ArtState,
  CharacterProfile,
  RigManifest,
  RigShot,
  ShotKind,
} from "@/lib/types";

interface ImageStageProps {
  profile: CharacterProfile;
  manifest: RigManifest;
  characterId: string;
  art: ArtState;
  outfitLayer: number;
  speaking: boolean;
  strokePosition: () => number;
  beatPhase: () => number;
  shot: ShotKind;
  intensity: number;
  animate: boolean;
}

/**
 * Renders real generated art.
 *
 * Image models can't reliably hand back separated animation layers, so this
 * stage animates flat PNGs instead:
 *
 * - motion that works on any single image (breathing, camera, grade, tremble)
 *   is applied as CSS transforms and filters;
 * - blinking and talking come from cross-fading between *variants of the same
 *   framing* — the identical pose regenerated with only the eyes or mouth
 *   changed;
 * - the stroking hand only animates when a separate transparent arm layer is
 *   supplied. Without one, those segments still work, they just don't move
 *   her arm.
 */
export function ImageStage({
  profile,
  manifest,
  characterId,
  art,
  outfitLayer,
  speaking,
  strokePosition,
  beatPhase,
  shot,
  intensity,
  animate,
}: ImageStageProps) {
  const framing = SHOT_FRAMING[shot];

  const rig = useMemo<RigShot | null>(() => {
    const outfit =
      manifest.outfits[String(outfitLayer)] ?? manifest.outfits["0"];
    if (!outfit) return null;
    // Fall back through progressively looser framings so a partial art pack
    // still plays every scene.
    return (
      outfit.shots[shot] ??
      outfit.shots.full ??
      outfit.shots["pace-mirror"] ??
      outfit.shots.body ??
      outfit.shots.face ??
      null
    );
  }, [manifest, outfitLayer, shot]);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const armRef = useRef<HTMLImageElement | null>(null);
  const hairRef = useRef<HTMLImageElement | null>(null);
  const eyesRef = useRef<HTMLImageElement | null>(null);
  const mouthRef = useRef<HTMLImageElement | null>(null);

  const framingRef = useRef(framing);
  const artRef = useRef(art);
  const speakingRef = useRef(speaking);
  const intensityRef = useRef(intensity);

  useEffect(() => {
    framingRef.current = framing;
    artRef.current = art;
    speakingRef.current = speaking;
    intensityRef.current = intensity;
  }, [framing, art, speaking, intensity]);

  useEffect(() => {
    if (!animate) return;

    let raf = 0;
    let last = 0;
    const zoomSpring = new Spring(0.035, 0.86);
    const ySpring = new Spring(0.035, 0.86);
    zoomSpring.reset(framingRef.current.zoom);
    ySpring.reset(framingRef.current.offsetY);

    let nextBlink = performance.now() + 2000 + Math.random() * 2600;
    let blinkEnd = 0;
    let nextFlap = 0;
    let flapOpen = false;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const phase = beatPhase();
      const stroke = strokePosition();
      const power = intensityRef.current;
      const state = artRef.current;
      const shotFraming = framingRef.current;

      const breath = (1 - Math.cos(phase * Math.PI * 2)) / 2;
      const tremble =
        state.tremble > 0 ? Math.sin(now / 26) * state.tremble * 0.1 : 0;
      const drift = shotFraming.drift
        ? Math.sin(now / 4200) * shotFraming.drift * 0.15
        : 0;

      const zoom = zoomSpring.step(shotFraming.zoom, dt);
      const offsetY = ySpring.step(shotFraming.offsetY, dt);
      // Near-zero breathing — flat Pony art should barely move.
      const breathScale = 1 + breath * Math.min(0.0015, manifest.breathing ?? 0.0015);
      const bounce = 1 + (1 - phase) * 0.001;
      const push = 1 + power * 0.01;

      if (rootRef.current) {
        rootRef.current.style.transform = [
          `translate(${(tremble + drift).toFixed(2)}%, ${(-offsetY / 10).toFixed(2)}%)`,
          `scale(${(zoom * bounce * push).toFixed(4)})`,
          `scaleY(${breathScale.toFixed(4)})`,
        ].join(" ");
      }

      // Stroking hand, only when a separated arm layer exists.
      if (armRef.current && shotFraming.showArm) {
        const span = 26 + power * 8;
        const angle = -span / 2 + stroke * span;
        armRef.current.style.transform = `rotate(${angle.toFixed(2)}deg)`;
      }

      if (hairRef.current) {
        const sway = (stroke - 0.5) * 0.25;
        hairRef.current.style.transform = `rotate(${sway.toFixed(2)}deg)`;
      }

      // Blink: cross-fade the eyes-closed variant in and out.
      if (eyesRef.current) {
        if (now >= nextBlink && !blinkEnd) blinkEnd = now + 130;
        if (blinkEnd && now >= blinkEnd) {
          blinkEnd = 0;
          nextBlink = now + 2000 + Math.random() * 3200;
        }
        eyesRef.current.style.opacity = blinkEnd ? "1" : "0";
      }

      // No mouth-flap reaction to dialogue.
      if (mouthRef.current) {
        flapOpen = false;
        mouthRef.current.style.opacity = "0";
      }
      void speakingRef.current;
      void nextFlap;
      void power;
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [animate, beatPhase, manifest.breathing, strokePosition]);

  if (!rig) return null;

  const base = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/characters/${characterId}/`;
  const grade = PHASE_GRADE[art.grade];
  const variants = rig.variants ?? {};

  /**
   * Maps the crop region onto the container. Applied identically to every
   * layer and variant so they stay registered with each other.
   */
  const crop = rig.crop;
  const layerStyle: React.CSSProperties = crop
    ? {
        position: "absolute",
        width: `${(manifest.width / crop.width) * 100}%`,
        height: `${(manifest.height / crop.height) * 100}%`,
        left: `${(-crop.x / crop.width) * 100}%`,
        top: `${(-crop.y / crop.height) * 100}%`,
        objectFit: "cover",
      }
    : {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
      };

  // Escalation variants are driven by state rather than timers.
  const showAhegao = !!variants.ahegao && art.mouth === "tongue";
  const showBlush = !!variants.blushHeavy && art.blush === "heavy";
  const speakingVariant =
    art.mouth === "wide" ? variants.mouthWide : variants.mouthOpen;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        ref={rootRef}
        className="absolute inset-0 will-change-transform"
        style={{ transformOrigin: "50% 40%" }}
      >
        {/* eslint-disable @next/next/no-img-element -- rig frames are
            pre-sized local assets swapped every frame; the optimizer adds
            nothing and would break the cross-fade timing. */}
        <img src={`${base}${rig.base}`} alt="" style={layerStyle} />

        {showBlush && (
          <img
            src={`${base}${variants.blushHeavy}`}
            alt=""
            style={layerStyle}
            className="transition-opacity duration-500"
          />
        )}

        {showAhegao && (
          <img
            src={`${base}${variants.ahegao}`}
            alt=""
            style={layerStyle}
            className="transition-opacity duration-300"
          />
        )}

        {speakingVariant && (
          <img
            ref={mouthRef}
            src={`${base}${speakingVariant}`}
            alt=""
            style={{ ...layerStyle, opacity: 0 }}
          />
        )}

        {variants.eyesClosed && (
          <img
            ref={eyesRef}
            src={`${base}${variants.eyesClosed}`}
            alt=""
            style={{ ...layerStyle, opacity: 0 }}
          />
        )}

        {rig.layers?.hair && (
          <img
            ref={hairRef}
            src={`${base}${rig.layers.hair}`}
            alt=""
            style={{ ...layerStyle, transformOrigin: "50% 18%" }}
            className="will-change-transform"
          />
        )}

        {rig.layers?.arm && (
          <img
            ref={armRef}
            src={`${base}${rig.layers.arm}`}
            alt=""
            style={{
              ...layerStyle,
              transformOrigin: rig.armPivot
                ? `${(rig.armPivot.x / manifest.width) * 100}% ${(rig.armPivot.y / manifest.height) * 100}%`
                : "50% 30%",
            }}
            className="will-change-transform"
          />
        )}
        {/* eslint-enable @next/next/no-img-element */}
      </div>

      {/* Per-phase grade, bloom and vignette, matching the SVG rig. */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          background: grade.tint,
          opacity: grade.bloom * 0.34,
          mixBlendMode: "soft-light",
        }}
      />
      {art.grade === "finish" && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "#ffe6b0", opacity: 0.12, mixBlendMode: "screen" }}
        />
      )}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 44%, transparent 58%, rgba(0,0,0,0.72) 100%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 32%, ${profile.theme.primary}22 0%, transparent 62%)`,
        }}
      />
    </div>
  );
}
