import type { CharacterProfile } from "@/lib/types";

/**
 * Eyes and mouth are drawn as swappable overlays sitting on a shared head
 * anchor. Every combination composites freely, which is how a handful of
 * parts covers hundreds of expressions.
 */

interface EyesProps {
  variant: string;
  profile: CharacterProfile;
  blink: boolean;
}

function Eye({
  cx,
  variant,
  profile,
  mirror,
}: {
  cx: number;
  variant: string;
  profile: CharacterProfile;
  mirror: boolean;
}) {
  const cy = 152;
  const dir = mirror ? -1 : 1;

  if (variant === "closed") {
    return (
      <path
        d={`M ${cx - 15} ${cy} q 15 12 30 0`}
        fill="none"
        stroke="#3a2430"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    );
  }

  // How much of the eye the upper lid covers.
  const lid =
    variant === "half" ? 0.42 : variant === "soft" ? 0.26 : variant === "rolled" ? 0.3 : 0;
  const openScale = variant === "wide" ? 1.18 : 1;

  // Iris offset drives crossed / rolled looks.
  const irisX = variant === "crossed" ? dir * 5 : 0;
  const irisY = variant === "rolled" ? -7 : variant === "crossed" ? -3 : 0;
  const showIris = variant !== "rolled";

  const rx = 15 * openScale;
  const ry = 17 * openScale;

  return (
    <g>
      <clipPath id={`eye-clip-${mirror ? "l" : "r"}-${variant}`}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
      </clipPath>

      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fdf6f8" />

      <g clipPath={`url(#eye-clip-${mirror ? "l" : "r"}-${variant})`}>
        {showIris ? (
          <>
            <circle
              cx={cx + irisX}
              cy={cy + irisY + 1}
              r={10.5}
              fill={profile.rig.eyes}
            />
            <circle cx={cx + irisX} cy={cy + irisY + 1} r={5} fill="#1d1018" />
            <circle
              cx={cx + irisX - 4}
              cy={cy + irisY - 4}
              r={3.4}
              fill="#ffffff"
              opacity="0.9"
            />
          </>
        ) : (
          <>
            <circle cx={cx} cy={cy - 12} r={9} fill={profile.rig.eyes} opacity="0.85" />
            <circle cx={cx} cy={cy - 13} r={4} fill="#1d1018" />
          </>
        )}

        {lid > 0 && (
          <rect
            x={cx - rx - 2}
            y={cy - ry - 2}
            width={rx * 2 + 4}
            height={(ry * 2 + 4) * lid}
            fill={profile.rig.skin}
          />
        )}
      </g>

      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill="none"
        stroke="#3a2430"
        strokeWidth="2.6"
      />

      {variant === "watery" && (
        <ellipse
          cx={cx + 3}
          cy={cy + 8}
          rx={5}
          ry={4}
          fill="#bfe6ff"
          opacity="0.75"
        />
      )}
    </g>
  );
}

export function Eyes({ variant, profile, blink }: EyesProps) {
  const resolved = blink ? "closed" : variant;
  return (
    <g>
      <Eye cx={172} variant={resolved} profile={profile} mirror />
      <Eye cx={228} variant={resolved} profile={profile} mirror={false} />
      {/* Brows shift with the expression to sell the intensity. */}
      <path
        d={`M 158 ${resolved === "wide" ? 124 : 128} q 14 -7 28 -2`}
        fill="none"
        stroke="#3a2430"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d={`M 214 ${resolved === "wide" ? 122 : 126} q 14 -5 28 2`}
        fill="none"
        stroke="#3a2430"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
  );
}

export function Mouth({ variant }: { variant: string }) {
  const cx = 200;
  const cy = 196;

  switch (variant) {
    case "slight":
      return (
        <ellipse cx={cx} cy={cy} rx={7} ry={5} fill="#7d2a3f" stroke="#4a1626" strokeWidth="1.6" />
      );
    case "open":
      return (
        <g>
          <ellipse cx={cx} cy={cy + 1} rx={11} ry={10} fill="#7d2a3f" stroke="#4a1626" strokeWidth="1.8" />
          <ellipse cx={cx} cy={cy + 5} rx={7} ry={4} fill="#c4566d" />
        </g>
      );
    case "wide":
      return (
        <g>
          <ellipse cx={cx} cy={cy + 2} rx={14} ry={14} fill="#6f2436" stroke="#4a1626" strokeWidth="1.8" />
          <ellipse cx={cx} cy={cy + 8} rx={9} ry={5} fill="#c4566d" />
        </g>
      );
    case "tongue":
      return (
        <g>
          <ellipse cx={cx} cy={cy + 2} rx={15} ry={15} fill="#6f2436" stroke="#4a1626" strokeWidth="1.8" />
          <path
            d={`M ${cx - 8} ${cy + 5} q 8 18 16 0 z`}
            fill="#e8788f"
            stroke="#c4566d"
            strokeWidth="1.4"
          />
        </g>
      );
    case "smile":
      return (
        <path
          d={`M ${cx - 12} ${cy - 2} q 12 12 24 0`}
          fill="none"
          stroke="#4a1626"
          strokeWidth="3"
          strokeLinecap="round"
        />
      );
    case "bite":
      return (
        <g>
          <path
            d={`M ${cx - 11} ${cy} q 11 8 22 0`}
            fill="none"
            stroke="#4a1626"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <ellipse cx={cx + 2} cy={cy + 4} rx={6} ry={3} fill="#c4566d" opacity="0.8" />
        </g>
      );
    default:
      return (
        <path
          d={`M ${cx - 9} ${cy} q 9 6 18 0`}
          fill="none"
          stroke="#4a1626"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
      );
  }
}
