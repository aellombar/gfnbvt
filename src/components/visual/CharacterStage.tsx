"use client";

import { useEffect, useRef, useState } from "react";
import { Eyes, Mouth } from "@/components/visual/Face";
import { Spring } from "@/lib/art/SpringChain";
import { SHOT_FRAMING } from "@/lib/art/shots";
import { blushAlpha, PHASE_GRADE } from "@/lib/joi/artStates";
import type { ArtState, CharacterProfile, ShotKind } from "@/lib/types";

interface CharacterStageProps {
  profile: CharacterProfile;
  art: ArtState;
  outfitLayer: number;
  background: string;
  speaking: boolean;
  /** Live 0..1 stroke position. Read every frame so the hand tracks the audio. */
  strokePosition: () => number;
  beatPhase: () => number;
  /** Framing. Only "pace-mirror" shows her stroking hand. */
  shot: ShotKind;
  /** Drives camera push-in and motion trail intensity. */
  intensity: number;
  animate: boolean;
}

const SHOULDER = { x: 258, y: 252 };

const BACKGROUNDS: Record<string, [string, string]> = {
  booth: ["#2a1030", "#0b0611"],
  velvet: ["#3a1230", "#0d0713"],
  shrine: ["#2d1720", "#0c0710"],
};

export function CharacterStage({
  profile,
  art,
  outfitLayer,
  background,
  speaking,
  strokePosition,
  beatPhase,
  shot,
  intensity,
  animate,
}: CharacterStageProps) {
  const framing = SHOT_FRAMING[shot];
  const paceMirror = framing.showArm;
  const rootRef = useRef<SVGGElement | null>(null);
  const bodyRef = useRef<SVGGElement | null>(null);
  const headRef = useRef<SVGGElement | null>(null);
  const armRef = useRef<SVGGElement | null>(null);
  const trailARef = useRef<SVGGElement | null>(null);
  const trailBRef = useRef<SVGGElement | null>(null);
  const hairBackRef = useRef<SVGGElement | null>(null);
  const hairFrontRef = useRef<SVGGElement | null>(null);
  const clothRef = useRef<SVGGElement | null>(null);
  const droolRef = useRef<SVGGElement | null>(null);

  const [blinking, setBlinking] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);

  // Mirrored into refs so the animation loop reads the latest values without
  // restarting every time the art state changes.
  const artRef = useRef(art);
  const speakingRef = useRef(speaking);
  const intensityRef = useRef(intensity);
  const framingRef = useRef(framing);

  useEffect(() => {
    artRef.current = art;
    speakingRef.current = speaking;
    intensityRef.current = intensity;
    framingRef.current = framing;
  }, [art, speaking, intensity, framing]);

  useEffect(() => {
    if (!animate) return;

    let raf = 0;
    let last = performance.now();
    const hairSpring = new Spring(0.075, 0.76);
    const clothSpring = new Spring(0.13, 0.8);
    const zoomSpring = new Spring(0.05, 0.85);
    // Shot changes glide rather than cut, so framing shifts feel intentional.
    const shotZoomSpring = new Spring(0.035, 0.86);
    const shotYSpring = new Spring(0.035, 0.86);
    shotZoomSpring.reset(framingRef.current.zoom);
    shotYSpring.reset(framingRef.current.offsetY);

    let nextBlink = performance.now() + 1800 + Math.random() * 2600;
    let blinkEnd = 0;
    let nextFlap = 0;
    let flapState = false;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const stroke = strokePosition();
      const phase = beatPhase();
      const power = intensityRef.current;
      const state = artRef.current;

      // Breathing: a slow chest rise locked to the pulse.
      const breath = (1 - Math.cos(phase * Math.PI * 2)) / 2;
      const tremble =
        state.tremble > 0
          ? Math.sin(now / 26) * state.tremble * 1.6
          : 0;

      if (bodyRef.current) {
        const lift = 1 + breath * (0.010 + power * 0.008);
        bodyRef.current.setAttribute(
          "transform",
          `translate(${tremble} 0) translate(200 330) scale(1 ${lift.toFixed(4)}) translate(-200 -330)`,
        );
      }

      if (headRef.current) {
        const bob = breath * (1.6 + power * 1.4);
        const tilt = state.arched ? -2.5 : 0;
        headRef.current.setAttribute(
          "transform",
          `translate(${tremble * 0.6} ${bob.toFixed(2)}) rotate(${tilt} 200 170)`,
        );
      }

      // Pace mirror: her hand sweeps a full stroke every beat.
      if (framingRef.current.showArm) {
        const span = 34 + power * 8;
        const angle = -span / 2 + stroke * span;
        const set = (el: SVGGElement | null, offset: number, opacity: number) => {
          if (!el) return;
          el.setAttribute(
            "transform",
            `rotate(${(angle + offset).toFixed(2)} ${SHOULDER.x} ${SHOULDER.y})`,
          );
          el.setAttribute("opacity", String(opacity));
        };
        set(armRef.current, 0, 1);
        // Motion trail only appears once the pace is genuinely fast.
        const trail = Math.max(0, power - 0.45) * 0.5;
        const dir = stroke > 0.5 ? -1 : 1;
        set(trailARef.current, dir * 4.5, trail);
        set(trailBRef.current, dir * 9, trail * 0.55);
      }

      // Hair and cloth chase the body with a little lag.
      const swayTarget = (stroke - 0.5) * (3 + power * 4) + (breath - 0.5) * 2;
      const hair = hairSpring.step(swayTarget, dt);
      hairBackRef.current?.setAttribute(
        "transform",
        `rotate(${hair.toFixed(2)} 200 118)`,
      );
      hairFrontRef.current?.setAttribute(
        "transform",
        `rotate(${(hair * 0.45).toFixed(2)} 200 128)`,
      );
      const cloth = clothSpring.step(swayTarget * 1.3, dt);
      clothRef.current?.setAttribute(
        "transform",
        `rotate(${cloth.toFixed(2)} 200 380)`,
      );

      // Camera: shot framing, plus push-in with the pace and a per-beat throb.
      const shotFraming = framingRef.current;
      const shotZoom = shotZoomSpring.step(shotFraming.zoom, dt);
      const shotY = shotYSpring.step(shotFraming.offsetY, dt);
      // Admiring shots drift slowly so a still frame never feels dead.
      const drift = shotFraming.drift
        ? Math.sin(now / 4200) * shotFraming.drift * 6
        : 0;
      const zoom = zoomSpring.step(1 + power * 0.1, dt);
      const bounce = 1 + (1 - phase) * 0.008 * (0.4 + power);
      const scale = zoom * bounce * shotZoom;
      rootRef.current?.setAttribute(
        "transform",
        `translate(${(shotFraming.offsetX + drift).toFixed(2)} ${(-shotY).toFixed(2)}) translate(200 320) scale(${scale.toFixed(4)}) translate(-200 -320)`,
      );

      // Drool drifts downward at peak.
      if (droolRef.current && state.drool) {
        const drift = 3 + Math.sin(now / 700) * 2.5;
        droolRef.current.setAttribute("transform", `translate(0 ${drift.toFixed(2)})`);
      }

      if (now >= nextBlink && !blinkEnd) {
        blinkEnd = now + 120;
        setBlinking(true);
      }
      if (blinkEnd && now >= blinkEnd) {
        blinkEnd = 0;
        nextBlink = now + 1800 + Math.random() * 3200;
        setBlinking(false);
      }

      // Mouth flaps while she is mid-line.
      if (speakingRef.current) {
        if (now >= nextFlap) {
          nextFlap = now + 110 + Math.random() * 90;
          flapState = !flapState;
          setMouthOpen(flapState);
        }
      } else if (flapState) {
        flapState = false;
        setMouthOpen(false);
      }
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [animate, beatPhase, paceMirror, strokePosition]);

  const [bgTop, bgBottom] = BACKGROUNDS[background] ?? BACKGROUNDS.booth;
  const grade = PHASE_GRADE[art.grade];
  const skin = profile.rig.skin;

  // While speaking, open the mouth a step further than the resting state.
  const mouthVariant =
    mouthOpen && art.mouth !== "tongue"
      ? art.mouth === "closed"
        ? "slight"
        : art.mouth === "slight"
          ? "open"
          : "wide"
      : art.mouth;

  const armPath = `M ${SHOULDER.x} ${SHOULDER.y} C ${SHOULDER.x + 14} ${SHOULDER.y + 60}, 244 ${SHOULDER.y + 96}, 224 388`;

  const renderArm = (key: string) => (
    <g key={key}>
      <path
        d={armPath}
        fill="none"
        stroke={skin}
        strokeWidth="26"
        strokeLinecap="round"
      />
      <circle cx={224} cy={392} r={16} fill={skin} />
      <ellipse cx={224} cy={402} rx={11} ry={9} fill={skin} />
    </g>
  );

  return (
    <svg
      viewBox="0 0 400 620"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id="stage-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={bgTop} />
          <stop offset="100%" stopColor={bgBottom} />
        </linearGradient>
        <radialGradient id="stage-glow" cx="50%" cy="34%" r="62%">
          <stop offset="0%" stopColor={profile.theme.primary} stopOpacity="0.32" />
          <stop offset="100%" stopColor={profile.theme.primary} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="stage-vignette" cx="50%" cy="46%" r="72%">
          <stop offset="60%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.72" />
        </radialGradient>
        <linearGradient id="hair-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={profile.rig.hair} />
          <stop offset="100%" stopColor={profile.rig.hairBack} />
        </linearGradient>
      </defs>

      <rect width="400" height="620" fill="url(#stage-bg)" />
      <rect width="400" height="620" fill="url(#stage-glow)" />

      <g ref={rootRef}>
        {/* Hair behind the body. */}
        <g ref={hairBackRef}>
          <path
            d="M 200 62 C 128 62 108 128 112 196 C 116 268 104 348 118 420 C 140 400 152 352 150 300 C 168 322 232 322 250 300 C 248 352 260 400 282 420 C 296 348 284 268 288 196 C 292 128 272 62 200 62 Z"
            fill="url(#hair-grad)"
          />
        </g>

        {/* Torso, breathing. */}
        <g ref={bodyRef}>
          <rect x="186" y="196" width="28" height="46" rx="12" fill={skin} />
          <path
            d="M 200 232 C 150 236 132 266 130 306 C 128 356 138 404 142 452 L 258 452 C 262 404 272 356 270 306 C 268 266 250 236 200 232 Z"
            fill={skin}
          />
          <ellipse cx="176" cy="292" rx="26" ry="23" fill={skin} />
          <ellipse cx="224" cy="292" rx="26" ry="23" fill={skin} />

          {/* Outfit layers peel back as the session progresses. */}
          {outfitLayer <= 0 && (
            <path
              d="M 200 230 C 152 234 134 264 132 306 C 130 358 140 408 144 458 L 256 458 C 260 408 270 358 268 306 C 266 264 248 234 200 230 Z"
              fill={profile.rig.outfit}
            />
          )}
          {outfitLayer === 1 && (
            <>
              <path
                d="M 200 230 C 168 234 150 262 146 306 C 142 358 146 410 148 458 L 176 458 C 172 402 168 344 172 300 C 176 266 188 244 200 230 Z"
                fill={profile.rig.outfit}
              />
              <path
                d="M 200 230 C 232 234 250 262 254 306 C 258 358 254 410 252 458 L 224 458 C 228 402 232 344 228 300 C 224 266 212 244 200 230 Z"
                fill={profile.rig.outfit}
              />
            </>
          )}
          {outfitLayer >= 1 && (
            <>
              <path
                d="M 148 286 q 52 -22 104 0 l -4 26 q -48 -18 -96 0 Z"
                fill={profile.rig.outfitTrim}
                opacity="0.92"
              />
              <path
                d="M 150 404 q 50 -16 100 0 l 0 30 q -50 -14 -100 0 Z"
                fill={profile.rig.outfitTrim}
                opacity="0.92"
              />
            </>
          )}
          {outfitLayer >= 2 && (
            <>
              <ellipse cx="176" cy="292" rx="15" ry="13" fill={profile.rig.outfitTrim} opacity="0.95" />
              <ellipse cx="224" cy="292" rx="15" ry="13" fill={profile.rig.outfitTrim} opacity="0.95" />
            </>
          )}

          {/* Loose cloth with its own sway. */}
          <g ref={clothRef}>
            <path
              d="M 142 452 C 130 496 126 540 130 578 L 270 578 C 274 540 270 496 258 452 Z"
              fill={outfitLayer >= 2 ? profile.rig.outfitTrim : profile.rig.outfit}
              opacity={outfitLayer >= 2 ? 0.85 : 1}
            />
            <path
              d="M 142 452 C 130 496 126 540 130 578 L 158 578 C 154 536 152 494 158 452 Z"
              fill="#000000"
              opacity="0.14"
            />
          </g>
        </g>

        {/* Pace mirror arm, with trail ghosts behind it. */}
        {paceMirror && (
          <>
            <g ref={trailBRef} opacity="0">{renderArm("trail-b")}</g>
            <g ref={trailARef} opacity="0">{renderArm("trail-a")}</g>
            <g ref={armRef}>{renderArm("arm")}</g>
          </>
        )}

        {/* Head. */}
        <g ref={headRef}>
          <ellipse cx="200" cy="158" rx="64" ry="72" fill={skin} />
          <ellipse cx="137" cy="166" rx="8" ry="12" fill={skin} />
          <ellipse cx="263" cy="166" rx="8" ry="12" fill={skin} />

          <Eyes variant={art.eyes} profile={profile} blink={blinking} />

          <path
            d="M 197 178 q 4 5 6 1"
            fill="none"
            stroke="#c99a92"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <Mouth variant={mouthVariant} />

          {/* Blush and sweat ramp with intensity. */}
          <g opacity={blushAlpha(art.blush)}>
            <ellipse cx="156" cy="180" rx="19" ry="11" fill="#ff6d92" opacity="0.7" />
            <ellipse cx="244" cy="180" rx="19" ry="11" fill="#ff6d92" opacity="0.7" />
          </g>
          {art.blush === "heavy" && (
            <g opacity="0.65">
              <ellipse cx="170" cy="112" rx="4" ry="7" fill="#cfefff" opacity="0.8" />
              <ellipse cx="236" cy="118" rx="3.4" ry="6" fill="#cfefff" opacity="0.7" />
            </g>
          )}

          {art.drool && (
            <g ref={droolRef}>
              <path
                d="M 208 206 q 3 14 0 22"
                fill="none"
                stroke="#cfe9ff"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.8"
              />
              <circle cx="208" cy="230" r="3.4" fill="#cfe9ff" opacity="0.8" />
            </g>
          )}
          {art.tears && (
            <>
              <path d="M 168 168 q -2 16 1 26" fill="none" stroke="#bfe6ff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
              <path d="M 232 168 q 2 14 -1 22" fill="none" stroke="#bfe6ff" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
            </>
          )}

          {/* Bangs sit in front of the face. */}
          <g ref={hairFrontRef}>
            <path
              d="M 200 62 C 140 62 118 112 124 168 C 138 138 150 122 172 116 C 180 132 196 138 208 128 C 226 138 246 132 258 116 C 266 132 272 148 276 168 C 282 112 260 62 200 62 Z"
              fill={profile.rig.hair}
            />
          </g>
        </g>
      </g>

      {/* Per-phase colour grade and bloom. */}
      <rect
        width="400"
        height="620"
        fill={grade.tint}
        opacity={grade.bloom * 0.42}
        style={{ mixBlendMode: "soft-light" }}
      />
      {art.grade === "finish" && (
        <rect width="400" height="620" fill="#ffe6b0" opacity="0.14" style={{ mixBlendMode: "screen" }} />
      )}
      <rect width="400" height="620" fill="url(#stage-vignette)" />
    </svg>
  );
}
