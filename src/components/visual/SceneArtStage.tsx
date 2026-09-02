"use client";

import { useEffect, useRef, useState } from "react";
import { SHOT_FRAMING } from "@/lib/art/shots";
import type { ShotKind } from "@/lib/types";

interface SceneArtStageProps {
  src: string;
  shot: ShotKind;
  /** Kept for API parity — motion is intentionally near-zero. */
  intensity: number;
  animate: boolean;
  beatPhase: () => number;
}

/**
 * Full-bleed scene PNG. One image per peel layer; camera shots are CSS crops
 * of that same portrait so you only generate 0.png / 1.png / 2.png / 3.png.
 */
export function SceneArtStage({
  src,
  shot,
  animate,
  beatPhase,
}: SceneArtStageProps) {
  const framing = SHOT_FRAMING[shot];
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [visibleSrc, setVisibleSrc] = useState(src);
  const [fadeSrc, setFadeSrc] = useState<string | null>(null);

  // Soft cross-fade when the peel layer swaps.
  useEffect(() => {
    if (src === visibleSrc) return;
    setFadeSrc(src);
    const t = window.setTimeout(() => {
      setVisibleSrc(src);
      setFadeSrc(null);
    }, 420);
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
      // Almost unnoticeable breathing — was ~0.8–1.5% before.
      const breath = (1 - Math.cos(phase * Math.PI * 2)) / 2;
      const breathScale = 1 + breath * 0.0012;
      const zoom = framing.zoom;
      const y = -framing.offsetY / 12;
      el.style.transform = [
        `translate(0, ${y.toFixed(3)}%)`,
        `scale(${(zoom * breathScale).toFixed(5)})`,
      ].join(" ");
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [animate, beatPhase, framing.offsetY, framing.zoom]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink">
      <div
        ref={rootRef}
        className="absolute inset-0 origin-center will-change-transform"
        style={{ transition: "none" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={visibleSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
          draggable={false}
        />
        {fadeSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fadeSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-[center_20%] animate-[cut-in_420ms_ease_both]"
            draggable={false}
          />
        )}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.35) 100%)",
        }}
      />
    </div>
  );
}
