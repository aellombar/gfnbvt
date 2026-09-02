"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CharacterStage } from "@/components/visual/CharacterStage";
import { applyTokens } from "@/lib/dialogue/text";
import { artStateFor } from "@/lib/joi/artStates";
import { replyText } from "@/data";
import type {
  CharacterProfile,
  ChoiceOption,
  ConversationBeat,
  Line,
} from "@/lib/types";

type Entry =
  | { kind: "line"; line: Line }
  | { kind: "reply"; text: string }
  | { kind: "choice"; beat: ConversationBeat };

interface ConversationProps {
  profile: CharacterProfile;
  beats: ConversationBeat[];
  petName: string;
  affection: number;
  background: string;
  outfitLayer: number;
  onChoice: (option: ChoiceOption) => void;
  onDone: () => void;
  ctaLabel: string;
}

const TYPE_SPEED_MS = 18;

export function Conversation({
  profile,
  beats,
  petName,
  affection,
  background,
  outfitLayer,
  onChoice,
  onDone,
  ctaLabel,
}: ConversationProps) {
  /** Flatten beats into a linear queue of lines and choice points. */
  const entries = useMemo(() => {
    const list: Entry[] = [];
    beats.forEach((beat) => {
      beat.lines.forEach((line) => list.push({ kind: "line", line }));
      if (beat.choice) list.push({ kind: "choice", beat });
    });
    return list;
  }, [beats]);

  const [index, setIndex] = useState(0);
  const [replyFor, setReplyFor] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(0);

  const entry = entries[index];
  const activeText =
    replyFor !== null
      ? replyFor
      : entry?.kind === "line"
        ? applyTokens(entry.line.text, petName)
        : "";

  // Restart the reveal whenever the line changes. Adjusting state during
  // render is the documented pattern for deriving from changing props.
  const [lastText, setLastText] = useState(activeText);
  if (lastText !== activeText) {
    setLastText(activeText);
    setRevealed(0);
  }

  const complete = revealed >= activeText.length;
  const typed = activeText.slice(0, revealed);

  useEffect(() => {
    if (!activeText) return;
    const timer = setInterval(() => {
      setRevealed((n) => {
        if (n >= activeText.length) {
          clearInterval(timer);
          return n;
        }
        return n + 1;
      });
    }, TYPE_SPEED_MS);
    return () => clearInterval(timer);
  }, [activeText]);

  const advance = useCallback(() => {
    if (!complete) {
      setRevealed(activeText.length);
      return;
    }
    if (replyFor !== null) {
      setReplyFor(null);
      setIndex((i) => i + 1);
      return;
    }
    if (entry?.kind === "choice") return;
    if (index >= entries.length - 1) {
      onDone();
      return;
    }
    setIndex((i) => i + 1);
  }, [activeText, complete, entries.length, entry, index, onDone, replyFor]);

  const pick = (option: ChoiceOption) => {
    onChoice(option);
    setReplyFor(replyText(profile.id, option.reply));
  };

  const showChoices = entry?.kind === "choice" && replyFor === null && complete;
  const isThought = entry?.kind === "line" && entry.line.kind === "thought";
  const atEnd = index >= entries.length - 1 && replyFor === null;

  const art = useMemo(
    () => artStateFor("groove", "none", 0),
    [],
  );

  return (
    <div className="relative flex min-h-dvh flex-col">
      <div className="pointer-events-none absolute inset-0">
        <CharacterStage
          profile={profile}
          art={art}
          outfitLayer={outfitLayer}
          background={background}
          speaking={!complete}
          strokePosition={() => 0}
          beatPhase={() => 0}
          paceMirror={false}
          intensity={0}
          animate
        />
      </div>

      <div className="relative mt-auto w-full bg-gradient-to-t from-ink via-ink/90 to-transparent px-4 pb-6 pt-24 sm:px-8">
        <div className="mx-auto w-full max-w-3xl">
          <div className="panel rounded-2xl p-5 sm:p-6">
            <p
              className="text-xs font-semibold uppercase tracking-[0.24em]"
              style={{ color: profile.theme.primary }}
            >
              {profile.name}
            </p>
            <p
              className={`mt-3 min-h-[4.5rem] text-lg leading-relaxed sm:text-xl ${
                isThought ? "italic text-white/55" : "text-white/90"
              }`}
            >
              {typed}
              {!complete && <span className="ml-0.5 animate-pulse">▌</span>}
            </p>

            {showChoices ? (
              <div className="mt-5 grid gap-2">
                {entry.beat.choice?.prompt && (
                  <p className="mb-1 text-xs uppercase tracking-[0.2em] text-white/40">
                    {entry.beat.choice.prompt}
                  </p>
                )}
                {entry.beat.choice?.options.map((option) => {
                  const locked =
                    option.requiresAffection !== undefined &&
                    affection < option.requiresAffection;
                  return (
                    <button
                      key={option.text}
                      type="button"
                      disabled={locked}
                      onClick={() => pick(option)}
                      className={`group flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${
                        locked
                          ? "cursor-not-allowed border-white/8 text-white/25"
                          : "border-white/15 text-white/85 hover:border-blush/60 hover:bg-blush/10"
                      }`}
                    >
                      <span>{option.text}</span>
                      <span className="ml-4 shrink-0 text-[10px] uppercase tracking-[0.18em] text-white/35">
                        {locked
                          ? `needs ${option.requiresAffection} affection`
                          : option.style}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <button
                type="button"
                onClick={advance}
                className="mt-5 w-full rounded-xl bg-white/10 px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/15"
              >
                {!complete
                  ? "Skip"
                  : atEnd && entry?.kind !== "choice"
                    ? ctaLabel
                    : "Continue"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
