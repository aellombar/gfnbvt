# Pony Diffusion V6 — Automatic1111 prompts (all scenes)

## Art direction (lock this in every prompt)

**Target look:** like *Jedyne's Fappy Party* (Mosbles) intimate JOI artwork —
polished **2D anime CG / visual-novel CG**, strong eye contact, expressive face,
soft erotic lighting, full-body scrollable portrait energy. **Not 3D**, not
Blender, not photoreal. Soft-shaded digital illustration, clean and glossy like
a high-end hentai CG.

### A1111 settings (use for every generate)

| Setting | Value |
| --- | --- |
| Model | **Pony Diffusion V6 XL** (or your Pony merge that keeps `score_` tags) |
| Sampling | DPM++ 2M Karras or Euler a |
| Steps | 28–32 |
| CFG | 6–7 |
| Size | **832 × 1216** (portrait) |
| Clip skip | 2 |
| Seed | pick one seed **per girl** and reuse it for her peels so face stays locked |

**Workflow per scene**
1. Generate `0.png` (clothed) until the face/body are perfect. **Lock that seed.**
2. Reuse the **same seed + same prompt**, only swap the outfit/peel tags → save as `1.png`, `2.png`, `3.png`.
3. Drop files into `public/art/<scene-id>/` exactly as named. Done.

### Queue ALL scenes at once

See **[`CHARACTER_CONSISTENCY.md`](./CHARACTER_CONSISTENCY.md)** (how the model
keeps the same girl) and run:

```bash
python3 tools/a1111/build_queue.py
```

That writes `tools/a1111/queue_prompts_from_file.txt` for A1111's
**Prompts from file or textbox** script — one line per peel, overnight-able.

Without a locked seed / FaceID / LoRA, faces will drift. Tags alone are not enough.

---

## Shared positive style block

Paste this at the **start** of every positive prompt:

```text
score_9, score_8_up, score_7_up, source_anime, rating_explicit,
1girl, solo, adult woman, 20s, looking at viewer, eye contact, seductive smile,
2d, anime, anime cg, visual novel cg, digital illustration, soft shading,
polished hentai cg, expressive face, beautiful detailed eyes, detailed face,
smooth anime skin, soft gradients, clean linework, intimate portrait,
vertical composition, centered, from thighs up, soft lighting, erotic atmosphere,
highly detailed, clean background,
```

## Shared negative prompt (every image)

```text
score_6, score_5, score_4, text, watermark, logo, signature, username,
speech bubble, ui, border, frame, comic, monochrome, sketch, lineart, rough,
3d, blender, cycles, raytracing, unreal engine, octane, cgi, plastic skin,
realistic photo, raw photo, photorealistic, pore skin, freckles overload,
ugly, deformed, bad anatomy, bad hands, extra fingers, fused fingers, extra limbs,
child, loli, underage, young, teen, flat chest, lowres, blurry,
```

---

## Character locks (keep these exact)

### Raven
```text
raven, long straight black hair, blunt bangs, deep red eyes, pale skin,
slim waist, medium breasts, calm confident expression, soft half-lidded eyes,
smoky beauty mark under left eye optional,
```

### Miko
```text
miko, long dark brown almost-black hair with soft side bangs, warm amber-brown eyes,
fair warm skin, gentle smile, soft blush, medium breasts, devoted expression,
shrine maiden beauty,
```

### Blaze
```text
blaze, short messy bright orange-red hair, cyan-teal eyes, tanned warm skin,
athletic toned body, medium-large breasts, sharp playful grin, hyped expression,
racing girlfriend energy,
```

### Seraph
```text
seraph, long wavy pale platinum-blonde hair, soft lavender-blue eyes, porcelain skin,
serene expression, large soft breasts, gentle smile, fallen angel beauty,
faint golden halo remnant optional,
```

---

# SCENE PROMPTS

For each scene: copy **Positive**, keep the shared negative, generate peels by
only changing the **PEEL** line. Save into the folder shown.

---

## 1) Raven — Last Call
**Folder:** `public/art/raven-first-timer/`  
**Files:** `0.png` `1.png` `2.png`

**Positive**
```text
score_9, score_8_up, score_7_up, source_anime, rating_explicit,
1girl, solo, adult woman, 20s, looking at viewer, eye contact, seductive smile,
2d, anime, anime cg, visual novel cg, digital illustration, soft shading,
polished hentai cg, expressive face, beautiful detailed eyes, detailed face,
smooth anime skin, soft gradients, clean linework, intimate portrait,
vertical composition, centered, from thighs up, soft lighting, erotic atmosphere,
highly detailed, clean background,
raven, long straight black hair, blunt bangs, deep red eyes, pale skin,
slim waist, medium breasts, calm confident expression, soft half-lidded eyes,
dark velvet casino booth, magenta rim light, violet ambient, low table cards soft bokeh,
[PEEL],
```

| File | Replace `[PEEL],` with |
| --- | --- |
| `0.png` | `black lace dealer outfit, sleeveless lace bodice, short black skirt, choker, standing behind booth, composed,` |
| `1.png` | `unbuttoned lace bodice, black lace bra, skirt hiked, choker, same pose, more flushed,` |
| `2.png` | `black lace lingerie only, sheer bra, panties, choker, same pose, heavy blush, inviting,` |

---

## 2) Raven — After Close
**Folder:** `public/art/raven-private-booth/`  
**Files:** `0.png` `1.png` `2.png` `3.png`

**Positive** — same Raven + booth block as above, then:

| File | PEEL |
| --- | --- |
| `0.png` | `black lace lounge wear, sheer robe half open over lingerie, sitting on booth bench,` |
| `1.png` | `robe slipped off one shoulder, black lace bra and panties, same pose,` |
| `2.png` | `bra unhooked hanging, panties, robe pooled, same pose, nipples soft light,` |
| `3.png` | `nude except choker and thigh highs, same pose, soft afterglow lighting,` |

---

## 3) Raven — Before Her Shift
**Folder:** `public/art/raven-velvet-room/`  
**Files:** `0.png` `1.png` `2.png` `3.png`

**Setting swap:** `private velvet room, deep red curtains, no cameras, intimate lamp light,`

| File | PEEL |
| --- | --- |
| `0.png` | `velvet private dress, deep wine slip dress, thin straps, elegant,` |
| `1.png` | `slip dress straps down, lace bra showing, same pose,` |
| `2.png` | `dress around waist, lingerie only,` |
| `3.png` | `nude, dress discarded beside her, soft lustful calm,` |

---

## 4) Raven — Off The Clock
**Folder:** `public/art/raven-off-the-clock/`  
**Files:** `0.png` `1.png` `2.png` `3.png`

**Setting:** `dim apartment bedroom, warm lamp, rumpled sheets soft bokeh,`

| File | PEEL |
| --- | --- |
| `0.png` | `silk apartment slip, champagne silk nightgown, barefoot,` |
| `1.png` | `nightgown half off, bare breasts, silk pooled at hips,` |
| `2.png` | `nude from waist up, silk around thighs,` |
| `3.png` | `fully nude on bed edge, sheets, soft aftercare lighting,` |

---

## 5) Raven — House Rules
**Folder:** `public/art/raven-house-rules/`  
**Files:** `0.png` `1.png` `2.png` `3.png`

**Setting:** `velvet private suite, house lights off, only signal-pink rim light,`

| File | PEEL |
| --- | --- |
| `0.png` | `private black lingerie set, garter, stockings, commanding calm,` |
| `1.png` | `bra removed, garter and stockings,` |
| `2.png` | `panties pulled aside, stockings,` |
| `3.png` | `nude in stockings only, proud soft smile,` |

---

## 6) Miko — For Luck
**Folder:** `public/art/miko-for-luck/`  
**Files:** `0.png` `1.png` `2.png`

**Positive**
```text
score_9, score_8_up, score_7_up, source_anime, rating_explicit,
1girl, solo, adult woman, 20s, looking at viewer, eye contact, seductive smile,
2d, anime, anime cg, visual novel cg, digital illustration, soft shading,
polished hentai cg, expressive face, beautiful detailed eyes, detailed face,
smooth anime skin, soft gradients, clean linework, intimate portrait,
vertical composition, centered, from thighs up, soft lighting, erotic atmosphere,
highly detailed, clean background,
miko, long dark brown almost-black hair with soft side bangs, warm amber-brown eyes,
fair warm skin, gentle smile, soft blush, medium breasts, devoted expression,
shrine maiden beauty,
quiet shrine alcove on casino slot floor, paper lanterns, warm gold light, incense haze,
[PEEL],
```

| File | PEEL |
| --- | --- |
| `0.png` | `white shrine maiden outfit, red accents, wide sleeves, polite kneeling pose,` |
| `1.png` | `hakama loosened, white top open, red ribbon bra, same pose, embarrassed smile,` |
| `2.png` | `shrine lingerie, white-and-red lace, sleeves off, eager blush,` |

---

## 7) Miko — Closing Blessing
**Folder:** `public/art/miko-closing-blessing/`  
**Files:** `0.png` `1.png` `2.png` `3.png`

**Setting:** `closed shrine floor, lights down, ceremonial lantern glow,`

| File | PEEL |
| --- | --- |
| `0.png` | `good kimono, ornate cream-and-crimson kimono, formal obi,` |
| `1.png` | `obi undone, kimono open on chest,` |
| `2.png` | `kimono slipped to waist, bare breasts,` |
| `3.png` | `nude wrapped in open kimono only, worshipful expression,` |

---

## 8) Miko — Private Offering
**Folder:** `public/art/miko-private-offering/`  
**Files:** `0.png` `1.png` `2.png` `3.png`

**Setting:** `behind shrine curtain, private offering room, red lanterns,`

| File | PEEL |
| --- | --- |
| `0.png` | `lantern red ceremonial robe, sheer red fabric,` |
| `1.png` | `robe open, red lace lingerie,` |
| `2.png` | `lingerie half off,` |
| `3.png` | `nude kneeling offering pose, hands on thighs, devoted eyes,` |

---

## 9) Miko — Only You
**Folder:** `public/art/miko-only-you/`  
**Files:** `0.png` `1.png` `2.png` `3.png`

**Setting:** `empty shrine at night, moonlight through paper screens,`

| File | PEEL |
| --- | --- |
| `0.png` | `devotion white silk kimono, pure white, red cord,` |
| `1.png` | `white kimono open, bare skin,` |
| `2.png` | `nude under open white silk,` |
| `3.png` | `fully nude, white silk under her, soft tears of joy optional,` |

---

## 10) Blaze — Rematch
**Folder:** `public/art/blaze-rematch/`  
**Files:** `0.png` `1.png` `2.png`

**Positive**
```text
score_9, score_8_up, score_7_up, source_anime, rating_explicit,
1girl, solo, adult woman, 20s, looking at viewer, eye contact, seductive smile,
2d, anime, anime cg, visual novel cg, digital illustration, soft shading,
polished hentai cg, expressive face, beautiful detailed eyes, detailed face,
smooth anime skin, soft gradients, clean linework, intimate portrait,
vertical composition, centered, from thighs up, soft lighting, erotic atmosphere,
highly detailed, clean background,
blaze, short messy bright orange-red hair, cyan-teal eyes, tanned warm skin,
athletic toned body, medium-large breasts, sharp playful grin, hyped expression,
racing girlfriend energy,
neon pit rail, cyan and orange neon signs, night asphalt bokeh, energetic lighting,
[PEEL],
```

| File | PEEL |
| --- | --- |
| `0.png` | `race crew jacket, crop top, short shorts, gloves hanging, leaning on rail,` |
| `1.png` | `jacket open, sports bra, shorts unbuttoned,` |
| `2.png` | `sports bra and tiny shorts only, sweaty sheen, triumphant grin,` |

---

## 11) Blaze — Pit Lane
**Folder:** `public/art/blaze-pit-lane/`  
**Files:** `0.png` `1.png` `2.png` `3.png`

**Setting:** `empty pit lane, neon overhead, jacket half-zipped energy,`

| File | PEEL |
| --- | --- |
| `0.png` | `pit zip jacket, tight race pants,` |
| `1.png` | `jacket off, tank top, pants low,` |
| `2.png` | `sports lingerie,` |
| `3.png` | `nude with racing gloves only, hyped blush,` |

---

## 12) Blaze — Redline
**Folder:** `public/art/blaze-redline/`  
**Files:** `0.png` `1.png` `2.png` `3.png`

**Setting:** `locked redline lounge, neon red wash, door locked mood,`

| File | PEEL |
| --- | --- |
| `0.png` | `redline mesh top, micro skirt, fishnets,` |
| `1.png` | `mesh pulled up, bare breasts,` |
| `2.png` | `skirt off, thong,` |
| `3.png` | `nude, fishnets only, full throttle expression,` |

---

## 13) Blaze — Pole Position
**Folder:** `public/art/blaze-pole-position/`  
**Files:** `0.png` `1.png` `2.png` `3.png`

**Setting:** `winner circle lights, gold spark accents, soft afterglow neon,`

| File | PEEL |
| --- | --- |
| `0.png` | `winner circle sash over race lingerie,` |
| `1.png` | `sash only, lingerie half off,` |
| `2.png` | `nude with sash,` |
| `3.png` | `fully nude, soft proud smile after the win,` |

---

## 14) Seraph — Descent
**Folder:** `public/art/seraph-descent/`  
**Files:** `0.png` `1.png` `2.png`

**Positive**
```text
score_9, score_8_up, score_7_up, source_anime, rating_explicit,
1girl, solo, adult woman, 20s, looking at viewer, eye contact, seductive smile,
2d, anime, anime cg, visual novel cg, digital illustration, soft shading,
polished hentai cg, expressive face, beautiful detailed eyes, detailed face,
smooth anime skin, soft gradients, clean linework, intimate portrait,
vertical composition, centered, from thighs up, soft lighting, erotic atmosphere,
highly detailed, clean background,
seraph, long wavy pale platinum-blonde hair, soft lavender-blue eyes, porcelain skin,
serene expression, large soft breasts, gentle smile, fallen angel beauty,
faint cracked golden halo behind head,
empty roulette chapel, pale stone, cool blue-gold godrays, sacred quiet,
[PEEL],
```

| File | PEEL |
| --- | --- |
| `0.png` | `pale silk ceremonial robe, gold trim, modest but clinging,` |
| `1.png` | `robe open at chest, silk bra,` |
| `2.png` | `pale silk lingerie, halo dimmer, calm lust,` |

---

## 15) Seraph — Halo Slip
**Folder:** `public/art/seraph-halo-slip/`  
**Files:** `0.png` `1.png` `2.png` `3.png`

**Setting:** `chapel side chamber, halo light flickering,`

| File | PEEL |
| --- | --- |
| `0.png` | `loose halo silk dress, slipping straps,` |
| `1.png` | `dress fallen to waist,` |
| `2.png` | `lingerie, broken halo shards floating,` |
| `3.png` | `nude, faint halo remnant, serene devotion,` |

---

## 16) Seraph — Soft Blasphemy
**Folder:** `public/art/seraph-soft-blasphemy/`  
**Files:** `0.png` `1.png` `2.png` `3.png`

**Setting:** `desecrated chapel alcove, gold cloth on floor, warm blasphemous light,`

| File | PEEL |
| --- | --- |
| `0.png` | `unwinged silk wrap, almost nothing underneath,` |
| `1.png` | `wrap open, bare breasts,` |
| `2.png` | `nude under open wrap,` |
| `3.png` | `fully nude kneeling, offering pose, sacred calm,` |

---

## 17) Seraph — Fallen For You
**Folder:** `public/art/seraph-fallen-for-you/`  
**Files:** `0.png` `1.png` `2.png` `3.png`

**Setting:** `night chapel, no halo left, moonlight and gold candles,`

| File | PEEL |
| --- | --- |
| `0.png` | `chosen fall gown, sheer ivory,` |
| `1.png` | `gown open,` |
| `2.png` | `nude with open gown,` |
| `3.png` | `fully nude, no halo, soft loving smile, fallen on purpose,` |

---

## Checklist

- [ ] Pick one seed per girl; reuse for every peel of that girl
- [ ] Generate peels by changing **only** the PEEL line
- [ ] Save exact filenames into `public/art/<scene-id>/`
- [ ] No text in images
- [ ] Refresh game — scene should show your PNG instead of SVG
