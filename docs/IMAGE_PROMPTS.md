# Generating art that actually works with the engine

## The one thing that matters

Text-to-image models cannot reliably hand back cleanly separated animation
layers. So the engine does **not** ask for that. Instead it animates
**variants of an identical framing**: the same image regenerated with only one
feature changed, cross-faded at runtime.

That means the single most important instruction to give any image model is:

> **Keep the pose, framing, camera distance, crop, lighting and background
> pixel-identical between variants. Change only the one feature I name.**

If the framing drifts between variants, the cross-fade looks like a jump cut.
If the framing holds, she blinks and talks convincingly.

## What animates, and what it needs

| Effect | Needs | Works on a flat PNG? |
| --- | --- | --- |
| Breathing, camera push-in, per-beat throb, tremble, drift | nothing | Yes |
| Colour grade, bloom, vignette, finish flash | nothing | Yes |
| Blinking | `eyesClosed` variant | Yes — variant swap |
| Talking | `mouthOpen` (+ `mouthWide`) variant | Yes — variant swap |
| Flushed escalation | `blushHeavy` variant | Yes — variant swap |
| Ahegao at finish | `ahegao` variant | Yes — variant swap |
| Hair sway | separate transparent `hair` layer | Only with a real layer |
| **Stroking hand** | separate transparent `arm` layer | Only with a real layer |

So: **you get 90% of the life from flat variants.** Only the stroking hand and
hair sway genuinely need cut-out layers. If you never get the arm layer, tag
those segments as `full` or `body` shots instead and nothing breaks.

## Shot types to generate

Not every scene is a stroking-hand shot. The engine has four framings and
picks a different one per phase, so generate all four per outfit:

- **`body`** — full body, pulled back, she's posing for you. Used in warmup,
  rest and aftercare. Purely for admiring her.
- **`full`** — standard three-quarter framing, waist up.
- **`face`** — tight on her face and shoulders. Used at the finish, where the
  escalation reads strongest. This is the shot that most needs the variant set.
- **`pace-mirror`** — she's stroking the air toward the camera. Only this shot
  needs the arm layer.

## Prompt to send to Grok

Paste this, then run it once per outfit layer. Replace the bracketed parts.

---

I need a consistent set of anime-style character images for a game. Consistency
between images matters more than any single image looking good.

**Character:** [Raven — early-20s anime woman, long straight black hair with a
blunt fringe, deep red eyes, pale skin, slim build, calm confident expression.
Wearing a black lace dealer outfit: sleeveless lace bodice, short skirt, choker.
Setting: a dark velvet casino booth lit in magenta and violet.]

**Style:** high-quality anime / semi-realistic illustration, clean cel shading,
soft rim lighting, detailed but not busy. Vertical 2:3 aspect ratio,
1024x1536px.

**Absolute requirements across the whole set:**
- Identical character design in every image — same face, same hair length, same
  outfit, same body proportions. Treat this as one character sheet.
- Vertical portrait orientation, 1024x1536, character centred horizontally.
- Dark background so the UI text overlays remain readable at the bottom third.
- Leave the bottom ~20% of the frame visually simple — text sits there.
- No text, no watermarks, no borders, no logos in the image.
- Adult character, clearly of adult age and appearance.

**Now generate these images.** Group A, B, C and D are four different camera
framings. Within each group, every image must be **pixel-identical except for
the one change named** — same pose, same crop, same camera distance, same
lighting, same background. Do not re-pose or re-frame between variants.

**Group A — `body` (full body, admiring):**
- A1: full body, standing, relaxed confident pose, looking at the viewer,
  slight smile. Head to below the knees in frame.
- A2: identical to A1 in every way, except her eyes are fully closed.
- A3: identical to A1 in every way, except her mouth is open as if mid-sentence.

**Group B — `full` (waist up):**
- B1: waist-up, three-quarter turn toward the viewer, one hand near her collar,
  warm eye contact.
- B2: identical to B1, eyes fully closed.
- B3: identical to B1, mouth open mid-word.
- B4: identical to B1, mouth open wider, more breathless.

**Group C — `face` (tight close-up — most important group):**
- C1: close-up of face and shoulders, calm, faint blush, direct eye contact.
- C2: identical to C1, eyes fully closed.
- C3: identical to C1, mouth slightly open.
- C4: identical to C1, mouth open wide, breathing hard.
- C5: identical to C1, but heavily flushed — strong blush across cheeks, light
  sweat sheen on forehead and collarbone.
- C6: identical to C1, but an intensely overwhelmed expression: eyes rolled
  upward and unfocused, mouth open with tongue slightly out, heavy blush,
  watery eyes.

**Group D — `pace-mirror` (she demonstrates a rhythm):**
- D1: waist-up, facing the viewer, her right forearm raised in front of her
  with a loose closed grip, as if demonstrating a slow rhythmic motion toward
  the camera. Eye contact, encouraging expression.
- D2: identical to D1, eyes fully closed.
- D3: identical to D1, mouth open mid-word.
- D4: **the same image as D1 with the entire right arm and hand removed** —
  her body and the background exactly as in D1, but no right arm, and the area
  where the arm was filled in with the correct background and body behind it.
- D5: **only the right arm and hand from D1**, in the exact same position and
  scale as in D1, on a fully transparent background. Nothing else in frame.

D4 and D5 are the layer split that lets her arm actually animate. If you cannot
produce a clean transparent cut-out for D5, say so and skip D4/D5 — just give
me D1–D3.

---

## After you have the images

1. Drop the PNGs into `public/characters/raven/`.
2. Copy `rig.example.json` to `rig.json` in that folder and point each entry at
   your actual filenames.
3. Reload. The engine detects `rig.json` and swaps off the placeholder rig
   automatically — no code changes.

Naming used in the example manifest maps to the groups above:

| Prompt image | Filename |
| --- | --- |
| A1 / A2 / A3 | `l0-body-base.png` / `-eyes-closed` / `-mouth-open` |
| B1–B4 | `l0-full-base.png` / `-eyes-closed` / `-mouth-open` / `-mouth-wide` |
| C1–C6 | `l0-face-base.png` / `-eyes-closed` / `-mouth-open` / `-mouth-wide` / `-blush-heavy` / `-ahegao` |
| D4 / D5 | `l0-pace-base.png` / `l0-pace-arm.png` |

Repeat the whole set per outfit layer, changing only the outfit description:

- **Layer 0** — fully dressed (dealer outfit)
- **Layer 1** — same outfit, opened / partly removed
- **Layer 2** — lingerie underneath

Set `armPivot` in the manifest to the pixel coordinates of her **shoulder
joint** in the `pace-mirror` images. That is the point the arm rotates around.

## If the variants don't line up

Two reliable fallbacks:

1. **Inpainting instead of regeneration.** Generate the base image once, then
   ask for an edit that changes only the eyes or mouth. This holds framing far
   better than a fresh generation.
2. **Skip the variant.** Omit it from `rig.json`. She'll still breathe, the
   camera still moves, the grade still shifts — she just won't blink in that
   shot. Nothing errors.
