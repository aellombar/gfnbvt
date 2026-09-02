# WHERE TO PUT YOUR ART (read this first)

You do **not** need `rig.json`. You do **not** need eye/mouth variants.

## Drop PNGs here

```
public/art/<scene-id>/0.png
public/art/<scene-id>/1.png
public/art/<scene-id>/2.png
public/art/<scene-id>/3.png   ← only if that scene asks for it
```

Examples:

| Scene | Folder | Files |
| --- | --- | --- |
| Raven — Last Call | `public/art/raven-first-timer/` | `0.png` `1.png` `2.png` |
| Miko — Only You | `public/art/miko-only-you/` | `0.png` `1.png` `2.png` `3.png` |
| Blaze — Rematch | `public/art/blaze-rematch/` | `0.png` `1.png` `2.png` |

Every scene folder already has a tiny `README.txt` listing the exact filenames for that scene.

## Rules that make it work

1. **Same pose + same camera** across `0/1/2/3` — only the clothes change (peel layers).
2. Vertical portrait, **832×1216** (or 1024×1536). Girl centered.
3. **No text, watermark, UI, speech bubbles, logos** in the image.
4. Save as **PNG**. Exact names: `0.png`, `1.png`, …
5. Refresh the game. If the file is there, that scene auto-switches off the SVG placeholder.

## Prompts

Copy-paste Automatic1111 prompts for every scene live in:

**[`docs/PONY_V6_A1111_PROMPTS.md`](../docs/PONY_V6_A1111_PROMPTS.md)**

Art direction: **Fappy Party–like intimate JOI CG, but more 3D** (anime Blender/Cycles look, soft SSS skin, expressive face).
