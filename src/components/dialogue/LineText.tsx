import type { CharacterProfile } from "@/lib/types";

/**
 * Renders one of her lines with emphasis picked out.
 *
 * Quoted speech, breath sounds and the pet name are styled differently so a
 * line reads at a glance instead of as a wall of text.
 */
export function LineText({
  text,
  profile,
  petName,
  size = "session",
}: {
  text: string;
  profile: CharacterProfile;
  petName: string;
  size?: "session" | "story";
}) {
  const petPattern = petName
    ? petName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    : "good boy";

  // Split into: pet name, breath sounds, and everything else.
  const pattern = new RegExp(
    `(${petPattern}|good boy|\\bhaa+\\b|\\bmm+h?\\b|\\bah+\\b)`,
    "gi",
  );

  const parts = text.split(pattern).filter((part) => part !== "");

  return (
    <span
      className={
        size === "session"
          ? "text-[1.7rem] leading-[1.22] sm:text-[2.4rem]"
          : "text-lg leading-relaxed sm:text-xl"
      }
    >
      {parts.map((part, index) => {
        const lower = part.toLowerCase();
        const isPet =
          lower === petName.toLowerCase() || lower === "good boy";
        const isBreath = /^(haa+|mm+h?|ah+)$/i.test(part);

        if (isPet) {
          return (
            <span
              key={index}
              className="font-bold"
              style={{
                color: profile.theme.primary,
                textShadow: `0 0 24px ${profile.theme.primary}80`,
              }}
            >
              {part}
            </span>
          );
        }

        if (isBreath) {
          return (
            <span key={index} className="italic text-white/55">
              {part}
            </span>
          );
        }

        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}
