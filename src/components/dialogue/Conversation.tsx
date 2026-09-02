"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CharacterView } from "@/components/visual/CharacterView";
import { LineText } from "@/components/dialogue/LineText";
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
  sceneId?: string;
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
  sceneId,
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

  const signal = profile.theme.primary;

  return (
    <div
      data-signal
      style={{ ["--signal" as string]: signal }}
      className="relative flex min-h-dvh flex-col"
    >
      <div className="pointer-events-none absolute inset-0">
        <CharacterView
          profile={profile}
          art={art}
          outfitLayer={outfitLayer}
          background={background}
          speaking={false}
          strokePosition={() => 0}
          beatPhase={() => 0}
          shot="full"
          intensity={0}
          animate
          sceneId={sceneId}
        />
      </div>

      <div className="relative mt-auto w-full bg-gradient-to-t from-ink via-ink/92 to-transparent px-4 pb-5 pt-28 sm:px-8">
        <div className="mx-auto w-full max-w-4xl">
          {/* Speaker plate, flush against the text block. */}
          <div className="flex items-center gap-2">
            <span
              className="px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-ink"
              style={{ background: signal }}
            >
              {profile.name}
            </span>
            {isThought && <span className="tag">thinking</span>}
            <span className="ml-auto tag">
              {String(index + 1).padStart(2, "0")}/
              {String(entries.length).padStart(2, "0")}
            </span>
          </div>

          <div
            className="border-l-2 bg-ink/70 p-4 sm:p-5"
            style={{ borderColor: signal }}
          >
            <div
              className={`min-h-[5.5rem] ${
                isThought ? "italic text-paper-dim" : ""
              }`}
            >
              {isThought ? (
                <span className="text-lg leading-relaxed sm:text-xl">
                  {typed}
                </span>
              ) : (
                <LineText
                  text={typed}
                  profile={profile}
                  petName={petName}
                  size="story"
                />
              )}
              {!complete && (
                <span className="animate-[blink_1.1s_steps(2,end)_infinite]">
                  ▌
                </span>
              )}
            </div>

            {showChoices ? (
              <div className="mt-5">
                {entry.beat.choice?.prompt && (
                  <p className="tag mb-2">{entry.beat.choice.prompt}</p>
                )}
                <div className="border border-rule">
                  {entry.beat.choice?.options.map((option, i) => {
                    const locked =
                      option.requiresAffection !== undefined &&
                      affection < option.requiresAffection;
                    return (
                      <button
                        key={option.text}
                        type="button"
                        disabled={locked}
                        onClick={() => pick(option)}
                        className={`group flex w-full items-baseline gap-3 px-4 py-3 text-left text-sm transition-colors ${
                          i > 0 ? "border-t border-rule" : ""
                        } ${
                          locked
                            ? "cursor-not-allowed text-paper-dim/40"
                            : "hover:bg-ink-3"
                        }`}
                      >
                        <span className="data text-[10px] text-paper-dim">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1">{option.text}</span>
                        <span
                          className="tag shrink-0"
                          style={
                            locked ? undefined : { color: signal }
                          }
                        >
                          {locked
                            ? `locked · ${option.requiresAffection} aff`
                            : option.style}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={advance}
                className={`mt-5 w-full ${
                  atEnd && entry?.kind !== "choice" ? "btn-paper" : "btn-ghost"
                }`}
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
