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
  ahegao = false,
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
      const breathScale = 1 + breath * (ahegao ? 0.006 : 0.0012);
      const zoom = framing.zoom * (ahegao ? 1.03 : 1);
      el.style.transform = `scale(${(zoom * breathScale).toFixed(5)})`;
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [animate, beatPhase, framing.zoom, ahegao]);

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
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: `center ${ahegao ? 32 : framing.focusY}%` }}
          draggable={false}
        />
        {fadeSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fadeSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover animate-[cut-in_420ms_ease_both]"
            style={{ objectPosition: `center ${ahegao ? 32 : framing.focusY}%` }}
            draggable={false}
          />
        )}
      </div>
        {ahegao && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 28%, rgba(255,80,140,0.28), transparent 42%)",
              mixBlendMode: "soft-light",
            }}
          />
        )}
    </div>
  );
}
