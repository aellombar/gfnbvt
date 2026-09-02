# Expanding the dialogue and story

## Current state

Roughly 190 lines exist across both characters — enough to prove the systems,
well short of the target. The plan calls for 600–800 lines per girl.

| File | What lives there |
| --- | --- |
| `src/data/lines/raven.ts` | Raven's pace lines, milestones, peel lines |
| `src/data/lines/miko.ts` | Miko's equivalents |
| `src/data/chapters/raven.ts` | Raven's story beats, choices, and her replies |
| `src/data/chapters/miko.ts` | Miko's equivalents |

The engine already supports things the current writing barely uses:

- **`moods`** on a line restricts it to `playful` / `clingy` / `sleepy` /
  `hyped`. Moods roll daily per girl. Filling all four out is the cheapest way
  to multiply perceived content.
- **`kind: "thought"`** renders as dimmed italics — her inner voice.
- **`kind: "interrupt"`** renders with an accent bar for lines she cuts off.
- **`{name}`** is replaced with the pet name the player chose.
- **`requiresAffection`** on a choice keeps it locked until she trusts you.

## Hard tone rules

Every line must obey these or it breaks the game's identity:

- **Praise only.** "good boy", "you're doing so well", "keep going for me",
  "I'm proud of you".
- **Never** degradation, humiliation, "pathetic", "you don't deserve it",
  punishment, or mockery. Affectionate teasing is fine; cruelty is not.
- **Fast stroking, light on edging.** Encourage speed and endurance. Rest lines
  are short warm breathers, never denial or "hands off".
- She wants you to finish. The finish is a reward, not something withheld.

## Prompt to expand the pace dialogue

---

I'm writing dialogue for an 18+ hands-free pacing game. I need you to expand
one character's line pools. Tone discipline matters more than volume.

**Character:** [Raven — a smoky, velvet-voiced casino dealer in her mid-20s.
Unhurried and quietly confident. She speaks in long, low sentences with a lot
of air and ellipses in them. She never raises her voice; when she wants you
faster she leans closer and drops to a whisper. She calls the player
"sweetheart", "good boy", "darling". She is genuinely fond of him and slightly
guarded about how much.]

**Hard rules:**
- Warm and encouraging at all times. Praise-heavy. Lots of "good boy".
- Absolutely no degradation, humiliation, punishment, mockery, or cruel denial.
  No "you don't deserve it". Teasing is allowed only if it's affectionate.
- She is encouraging speed and stamina, not withholding. She wants him to
  finish.
- Use `{name}` as a token wherever she'd use a pet name — the game substitutes
  the player's chosen one.
- Keep every line short enough to read at a glance: one or two sentences max.
- Stay in her specific voice. Someone reading a line with the name hidden
  should know it's her and not a generic narrator.

**Write these pools. Give me 14 lines for each unless noted.**

1. `warmup` — settling in, slow, no rush
2. `groove` — steady rhythm found, quiet approval
3. `push` — asking him to go faster, still calm
4. `sprint` — fast, urgent, breathless but never harsh (write 20)
5. `rest` — a 5–15 second breather; warm, reassuring, "back with me in a moment"
6. `finish` — giving permission, wanting it (write 10)
7. `aftercare` — tender, proud, come-down (write 10)

**Then write mood variants.** For each of `playful`, `clingy`, `sleepy` and
`hyped`, give me 6 additional `groove` lines and 6 additional `sprint` lines
that read distinctly as that mood while staying unmistakably her.

**Also write:**
- 8 `thought` lines — her private inner voice, in first person, italic in game.
  These should reveal she's more affected by him than she lets on.
- 6 `interrupt` lines — sentences she cuts off mid-word at peak intensity.
  End them with an em dash.
- 8 `peel` lines — short, for when she removes a layer of clothing.
- 3 lines each for the 25%, 50%, 75% and 90% progress milestones.

**Output format** — a TypeScript array I can paste directly:

```ts
{ id: "r-g-11", text: "That's it. Right there, sweetheart.", moods: ["playful"] },
{ id: "r-t-3", text: "*he's actually keeping up…*", kind: "thought" },
```

Use id prefixes: `r-w-` warmup, `r-g-` groove, `r-p-` push, `r-s-` sprint,
`r-r-` rest, `r-f-` finish, `r-a-` aftercare, `r-t-` thought, `r-peel-`,
`r-m25-` / `r-m50-` / `r-m75-` / `r-m90-` milestones. Continue numbering from
where the existing file leaves off. Omit `moods` for lines that fit any mood.

---

Run the same prompt again for Miko, swapping in:

> **Character:** Miko — a shrine attendant in her early 20s who works the slot
> floor. Sweet, devoted, and generous; she frames every session as a blessing
> she's giving you. Polite phrasing that keeps slipping into breathless
> eagerness. She says "you deserve this" and "let me take care of you". She
> calls the player "good boy", "my luck", "sweet thing". Where Raven commands,
> Miko offers. She blushes at her own boldness and doesn't take it back.

Use `m-` id prefixes.

## Prompt to expand the story

---

I'm writing the story mode for an 18+ visual-novel-style game. Between
sessions, the player and one character talk: she speaks, the player picks a
response, she reacts in character.

**The critical constraint:** the same player choice must draw a *completely
different* reaction from each character. Her reply has to be unmistakably hers.

**Character:** [paste the character description from above]

**Her arc:** [Raven — 12 chapters. She starts as a professional dealer and you
are a customer. By the midpoint she's bending the rules and staying past close
for you. By the end she's stopped pretending it's about the table at all. She
is guarded about her own feelings and reveals them slowly and reluctantly, and
that reluctance is the point.]

**Write chapters 4 through 8.** For each chapter give me:

1. **Title** — short, evocative, 2–4 words.
2. **Pre-session beats** — 8–12 lines of dialogue and narration setting the
   scene and advancing the relationship. Narration is plain text describing
   what she does; her speech is in quotes.
3. **Two choice points** in the pre-session section. Each offers 3 options
   drawn from these styles: `sweet`, `flirty`, `cocky`, `shy`, `honest`. Give
   each option an `affection` value from 1–4. Gate at most one option per
   chapter behind `requiresAffection` — a vulnerable or forward line she'd only
   accept once she trusts you.
4. **Her reply to every single option** — 1–3 sentences, in her voice,
   reacting specifically to what was said. Never generic.
5. **Post-session beats** — 6–10 lines of aftercare, plus one choice point with
   3 options and her replies.
6. **A closing hook** — 2 lines that set up the next chapter.

**Rules:**
- Praise-based warmth throughout. No degradation or cruelty, ever.
- The relationship must visibly progress chapter to chapter. Reference earlier
  chapters — she should remember things.
- Keep the sexual content suggestive and emotionally driven rather than
  graphic; the heat comes from how much she means it.
- Her guard drops unevenly. Let her retreat sometimes.

**Output format** — match this shape exactly so I can paste it in:

```ts
{
  chapter: 4,
  character: "raven",
  title: "Off The Clock",
  sceneId: "raven-off-the-clock",
  pre: [
    {
      lines: [
        { id: "r4-p1", text: "The floor is dark except for her booth." },
        { id: "r4-p2", text: "\"You're early. I'm not ready to share you yet.\"" },
      ],
      choice: {
        prompt: "She hasn't looked up from the deck.",
        options: [
          { style: "sweet", text: "I'll wait as long as you want.", affection: 3, reply: "r4-reply-sweet" },
        ],
      },
    },
  ],
  post: [ /* same shape */ ],
}
```

And a separate replies map:

```ts
export const RAVEN_REPLIES = {
  "r4-reply-sweet": "\"…You say things like that far too easily.\" She finally looks up.",
};
```

---

## Wiring new content in

- **New lines** — append to the arrays in `src/data/lines/`. The no-repeat
  window handles rotation; no other change needed.
- **New chapters** — append to the array in `src/data/chapters/`, add the
  replies to that file's `_REPLIES` map, then add a matching scene to
  `src/data/scenes.ts` with the same `sceneId`. Bump `chapters` on the
  character profile in `src/data/characters.ts`.
- **New scene pacing** — copy an existing scene's `segments` array and adjust.
  Set a `shot` per segment (`body`, `full`, `face`, `pace-mirror`) so the
  camera varies; omit it to use the sensible default for that phase.
