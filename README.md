# Baddie Casino

**Play in your browser:** https://aellombar.github.io/gfnbvt/

An 18+ browser game where AI-generated anime characters host a hands-free
pacing experience. Wins at the table unlock story chapters; chapters unlock
sessions where she sets the rhythm and you follow along.

**Adults only.** Fictional characters. Virtual chips only — no real-money
wagering.

## Running it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build          # static production build (local paths)
npm run build:pages    # static build for GitHub Pages (/gfnbvt base path)
npm run typecheck      # tsc --noEmit
npx eslint src         # lint
```

The live site is a static export deployed by GitHub Actions on every push to
`main`. Local `next dev` still serves from `/` with no base path.

## Art direction

The UI is deliberately **late-night analog broadcast**, not generic dark mode:

- Near-black ground with a fixed film-grain and scanline overlay
- **Nothing is rounded and nothing is frosted.** Hard edges, hairline 1px
  rules, and offset hard shadows instead of blurs
- Oversized heavy condensed uppercase headlines (Anton), angular body text
  (Chakra Petch), and monospace (JetBrains Mono) for every number, label,
  timecode and save code
- One **solid signal colour per character**, never a gradient. It is exposed as
  a `--signal` CSS variable on a `[data-signal]` wrapper so nested components
  pick it up without prop drilling
- Broadcast furniture as real UI: channel numbers, a blinking rec dot, running
  timecode, colour bars, vertical rail type, and chromatic-offset display text

Design tokens and utilities live in
[`src/app/globals.css`](src/app/globals.css) — `.display`, `.tag`, `.data`,
`.slab`, `.btn-paper`, `.btn-ghost`, `.chroma`, `.field`.

## Design rules

Three rules shape every system in the codebase:

1. **No clicking during a session.** Once a scene starts there is nothing to
   press. All pacing comes from audio, her voice, and her on-screen hand.
2. **Praise, never degradation.** The tone is warm and encouraging. There are
   no punishment scenes, no humiliation, and no cruel denial.
3. **Fast stroking, light on edging.** Sessions spend most of their runtime in
   the faster phases. Rest beats are 5–15 second breathers, not denial holds.

## How it works

### Pace engine

[`src/lib/joi/PaceEngine.ts`](src/lib/joi/PaceEngine.ts) synthesises the pulse
with the Web Audio API. It is deliberately not a metronome tick — each beat is
a warm low sine thump, a breath-like noise texture, and a per-character accent
tone, all filtered warm.

Beat timing comes from the `AudioContext` clock rather than `setTimeout`, and
visual systems read `beatPhase()` / `strokePosition()` every frame. That is
what keeps her hand locked to the audio with no drift.

Tempo never jumps. `setBpm(target, rampMs)` eases between phases.

### Session loop

[`src/lib/joi/useSession.ts`](src/lib/joi/useSession.ts) walks the scene's pace
segments, ramps the engine, fires her dialogue on a per-phase cadence, triggers
milestone lines at 25/50/75/90%, and peels outfit layers at scheduled points.
It exposes no input handlers by design.

### Art system

The character is **composited from separate layers at runtime** rather than
drawn as finished images: background, hair-back, body, outfit layers, arm,
head, eyes, mouth, blush, drool, tears, hair-front.

Because the small overlays are reusable, a handful of parts covers a very large
number of states. All motion is **code, not frames**:

| Effect | How |
| --- | --- |
| Breathing | Vertical scale on the body layer, synced to the pulse |
| Hair / cloth sway | Damped springs ([`SpringChain.ts`](src/lib/art/SpringChain.ts)) |
| Pace mirror | Arm layer rotated around a shoulder pivot, driven by `strokePosition()` |
| Motion trail | Two ghost arms at offset angles, faded in at high BPM |
| Blink / mouth flap | Overlay swaps on timers |
| Camera push-in | Transform scale that rises with intensity |
| Pulse zoom bounce | Per-beat scale throb |
| Escalation | Blush alpha ramp, tremble offset, arched pose |
| Lighting grade | Per-phase colour overlay |

The current character art is a **procedural SVG placeholder rig**
([`CharacterStage.tsx`](src/components/visual/CharacterStage.tsx)) so the game
is playable end to end today. Swapping in generated art means replacing each
SVG layer with a transparent PNG at the same anchor — the animation, tagging
and escalation systems do not change.

### Dialogue

Each character has her own line pools split by phase, plus milestone and peel
lines ([`src/data/lines/`](src/data/lines/)). [`LinePool`](src/lib/dialogue/LinePool.ts)
keeps a rolling no-repeat window so a long sprint never loops.

Moods roll daily per character and are deterministic for the day
([`MoodSystem.ts`](src/lib/dialogue/MoodSystem.ts)), which reskins her line pool
without new writing.

`{name}` tokens are replaced with the pet name the player chose.

### Story and choices

Before and after each session it plays like a visual novel: she talks, you pick
a response, she replies **in her own voice**. The same option produces a
completely different reaction per character — compare the `cocky` replies in
[`chapters/raven.ts`](src/data/chapters/raven.ts) and
[`chapters/miko.ts`](src/data/chapters/miko.ts).

Choices raise affection and are recorded as a response-style profile. Some
options are affection-locked and stay greyed out until she trusts you.

Chapters unlock in order so the relationship actually progresses.

### Save codes

[`SaveCodec.ts`](src/lib/save/SaveCodec.ts) flattens progress into a delimited
string, encodes it as Crockford base32 (no ambiguous `0/O` or `1/I`), appends a
checksum, and groups it for readability:

```
BADDIE-7K3F2-Q9WMX-4LP8R-2ZND6-H5T1V-C3
```

There are three labelled slots. Importing shows a summary before it overwrites
anything, and a bad character or typo is rejected by the checksum.

### Privacy

`Esc` instantly swaps the screen for a neutral page and kills audio. Any key
returns you exactly where you were.

## Adding content

- **A new scene** — add to [`src/data/scenes.ts`](src/data/scenes.ts) with its
  pace segments, then a matching chapter in `src/data/chapters/`.
- **New lines** — append to the relevant pool in `src/data/lines/`. Pools are
  plain arrays; the no-repeat window handles the rest.
- **A new character** — add a profile in
  [`src/data/characters.ts`](src/data/characters.ts), a line file, a chapter
  file, then register them in [`src/data/index.ts`](src/data/index.ts).
- **Real art** — replace the SVG layers in `CharacterStage.tsx` with images
  positioned on the same anchors.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Zustand, Web
Audio API. No canvas or game-engine dependency — the rig is SVG plus transforms.
