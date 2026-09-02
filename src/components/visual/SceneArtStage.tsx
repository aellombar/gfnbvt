"use client";

import { useEffect, useRef, useState } from "react";
import { SHOT_FRAMING } from "@/lib/art/shots";
import type { ShotKind } from "@/lib/types";

interface SceneArtStageProps {
  src: string;
  shot: ShotKind;
  intensity: number;
  animate: boolean;
  beatPhase: () => number;
  ahegao?: boolean;
  /** Side panels crop tighter so you get a second angle of the same still. */
  fit?: "contain" | "cover";
}

/**
 * Full-bleed scene PNG. Wide screens used to crop portraits to forehead;
 * the girl is now shown with object-contain so face and chest stay in frame,
 * with a blurred copy behind so the stage still fills the screen.
 */
export function SceneArtStage({
  src,
  shot,
  animate,
  beatPhase,
  ahegao = false,
  fit = "contain",
}: SceneArtStageProps) {
  const framing = SHOT_FRAMING[shot];
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [visibleSrc, setVisibleSrc] = useState(src);
  const [fadeSrc, setFadeSrc] = useState<string | null>(null);

  useEffect(() => {
    if (src === visibleSrc) return;
    setFadeSrc(src);
    const t = window.setTimeout(() => {
      setVisibleSrc(src);
      setFadeSrc(null);
    }, 280);
    return () => window.clearTimeout(t);
  }, [src, visibleSrc]);

  useEffect(() => {
    if (!animate) return;
    let raf = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const el = rootRef.current;
      if (!el) return;
      const phase = beatPhase();
      const breath = (1 - Math.cos(phase * Math.PI * 2)) / 2;
      const breathScale = 1 + breath * 0.001;
      const zoom = ahegao ? 1.02 : framing.zoom;
      el.style.transform = `scale(${(zoom * breathScale).toFixed(5)})`;
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [animate, beatPhase, framing.zoom, ahegao]);

  const portrait = (url: string, fading: boolean) => (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt=""
        aria-hidden
        className={`absolute inset-0 h-full w-full object-cover opacity-45 blur-2xl scale-110 ${
          fading ? "animate-[cut-in_420ms_ease_both]" : ""
        }`}
        draggable={false}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt=""
        className={`absolute inset-0 h-full w-full ${
          fit === "cover"
            ? "object-cover object-[center_32%]"
            : "object-contain object-center"
        } ${fading ? "animate-[cut-in_420ms_ease_both]" : ""}`}
        draggable={false}
      />
    </>
  );

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink">
      <div
        ref={rootRef}
        className="absolute inset-0 origin-center will-change-transform"
        style={{ transition: "none" }}
      >
        {portrait(visibleSrc, false)}
        {fadeSrc && portrait(fadeSrc, true)}
      </div>
      {ahegao && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 36%, rgba(255,80,140,0.22), transparent 48%)",
            mixBlendMode: "soft-light",
          }}
        />
      )}
    </div>
  );
}
