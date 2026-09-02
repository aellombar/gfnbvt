# Pony Diffusion V6 — Automatic1111 prompts (all scenes)

## Art direction (lock this in every prompt)

**Target look:** like *Jedyne's Fappy Party* (Mosbles) — **flat cel colors**,
**thick bold outlines**, hard shadows, slightly more face/hair/outfit detail than
a pure doodle, big expressive faces. Not soft glossy CG, not painterly, **not 3D**.
Keep backgrounds simple so she reads clearly.

### A1111 settings (use for every generate)

| Setting | Value |
| --- | --- |
| Model | **Pony Diffusion V6 XL** (or your Pony merge that keeps `score_` tags) |
| Sampling | DPM++ 2M Karras or Euler a |
| Steps | **34** |
| CFG | **7** |
| Size | **832 × 1216** (portrait) |
| Clip skip | 2 |
| Seed | pick one seed **per girl** and reuse it for her peels so face stays locked |

**Consistency tips:** lock seed per girl, keep the character block identical, only
swap the peel line. FaceID / character LoRA still helps across scenes — see
[`CHARACTER_CONSISTENCY.md`](./CHARACTER_CONSISTENCY.md).

**Workflow per scene**
1. Generate `0.png` (clothed) until the face/body are perfect. **Lock that seed.**
2. Reuse the **same seed + same prompt**, only swap the outfit/peel tags → save as `1.png`, `2.png`, `3.png`.
3. Drop files into each pack's `DROP/image.png` (or `public/art/<scene-id>/`). Done.

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

Paste this at the **start** of every positive prompt (also baked into `public/gen/*/POSITIVE.txt`):

```text
score_9, score_8_up, score_7_up, source_anime, rating_explicit,
1girl, solo, adult woman, 20s, looking at viewer, eye contact, seductive smile,
2d, anime, flat color, flat colors, simple coloring, cel shading, hard shadow,
clean lineart, thick lineart, expressive face, large expressive eyes,
indie hentai illustration, comic style, simple shapes, limited palette,
lewd, erotic, NSFW, aroused, flushed, bedroom eyes, heavy breathing,
vertical composition, centered, simple background,
erotic atmosphere, JOI coach pose, watching viewer masturbate
```

## Shared negative prompt (every image)

```text
score_6, score_5, score_4, text, watermark, logo, signature, username,
speech bubble, ui, border, frame, monochrome, sketch, rough, unfinished,
3d, blender, cycles, raytracing, unreal engine, octane, cgi, plastic skin,
soft shading, soft gradients, painterly, oil painting, photorealistic,
realistic photo, raw photo, subsurface scattering, ambient occlusion,
intricate details, busy background, hyper detailed, glossy skin,
ugly, deformed, bad anatomy, bad hands, extra fingers, fused fingers, extra limbs,
child, loli, underage, young, teen, flat chest, lowres, blurry
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
Poses are locked to chapter + JOI dialogue. **Source of truth:** `tools/a1111/build_queue.py` → regenerate with:

```bash
python3 tools/a1111/make_easy_copy.py
```

Then copy each `public/gen/NN_<scene>__<layer>/POSITIVE.txt` into A1111 and save the PNG to that folder's `DROP/image.png`.

Peel ladder (every scene):
- **0** clothed JOI coach ("hands on yourself / eyes on me")
- **1** undress while she watches you stroke
- **2** wet / spreading / matching your pace with her body
- **3** finish-freaky climax pose + praise afterglow

---

## 1) Raven — Last Call
**Folder:** `public/gen/*_raven-first-timer__*/` (or legacy `public/art/raven-first-timer/`)
**Dialogue beat:** Hands on your lap. Eyes on me.
**Setting:** `dark velvet casino booth after last call, magenta rim light, cards forgotten on table`

| File | PEEL (pose must match dialogue) |
| --- | --- |
| `0.png` | `black lace dealer outfit, short skirt, choker, leaning over booth toward viewer, finger to lips then pointing at viewer's lap, hungry half-lidded eyes, JOI command pose` |
| `1.png` | `unbuttoned lace bodice, black lace bra, skirt hiked over hips, thighs pressed tightly together, hand sliding between her own thighs matching your stroke, flushed wet stain implication` |
| `2.png` | `black lace lingerie only, sitting on booth edge facing viewer, legs spread wide, spreading pussy with fingers, dripping, open mouth begging you to cum, heavy blush` |

---

## 2) Raven — After Close
**Folder:** `public/gen/*_raven-private-booth__*/` (or legacy `public/art/raven-private-booth/`)
**Dialogue beat:** Take it out. Slow. I want to watch you get hard.
**Setting:** `private booth after close, velvet rope shut, magenta glow, no dealers left`

| File | PEEL (pose must match dialogue) |
| --- | --- |
| `0.png` | `sheer black robe half open over lace lingerie, reclining on booth bench, looking down at viewer's cock, licking lips, slow JOI tease` |
| `1.png` | `robe off one shoulder, black bra, panties, knees up soles toward viewer, toes curling, hand miming a stroke toward camera, bedroom eyes` |
| `2.png` | `bra off, panties pulled aside, two fingers spreading pussy, shiny wet, breathy open mouth, watching you pump` |
| `3.png` | `nude except choker and thigh highs, on all fours on bench facing viewer, arched back, ass up, tongue out slightly, ahegao pleasure face, sweaty afterglow` |

---

## 3) Raven — Before Her Shift
**Folder:** `public/gen/*_raven-velvet-room__*/` (or legacy `public/art/raven-velvet-room/`)
**Dialogue beat:** Sits beside you. Twenty minutes. Every throb she feels.
**Setting:** `off-floor velvet room, deep red curtains, intimate lamp, no cameras`

| File | PEEL (pose must match dialogue) |
| --- | --- |
| `0.png` | `wine silk slip dress, thin straps, sitting beside viewer not across, hand on viewer's thigh near cock, whispering close, lustful calm` |
| `1.png` | `dress straps down, breasts half out, straddling above viewer's lap, grinding pose, wet eyes, guiding your stroke pace with her hips` |
| `2.png` | `dress bunched at waist, no lingerie, cowgirl facing viewer, one hand on breast, other hand on her clit, riding while coaching your fist` |
| `3.png` | `fully nude, dress discarded, sitting in viewer's lap, forehead to forehead, messy hair, cum on stomach implication, soft proud smile` |

---

## 4) Raven — Off The Clock
**Folder:** `public/gen/*_raven-off-the-clock__*/` (or legacy `public/art/raven-off-the-clock/`)
**Dialogue beat:** Not hiding how wet watching you makes her.
**Setting:** `her apartment bedroom, warm lamp, rumpled sheets, private and slow`

| File | PEEL (pose must match dialogue) |
| --- | --- |
| `0.png` | `champagne silk nightgown, barefoot on bed edge, legs parted inviting, looking at viewer like she waited all day to watch you stroke` |
| `1.png` | `nightgown half off, bare breasts presented, kneeling on bed, hand deep between legs, moaning open mouth, desperate for your eyes` |
| `2.png` | `nude from waist up, silk around thighs, lying back propped on elbows, legs spread toward viewer, pussy dripping, filthy praise expression` |
| `3.png` | `fully nude on rumpled sheets, aftercare cuddle pulling viewer in, soft proud smile, cum on her stomach, sweaty satisfied glow` |

---

## 5) Raven — House Rules
**Folder:** `public/gen/*_raven-house-rules__*/` (or legacy `public/art/raven-house-rules/`)
**Dialogue beat:** Stroke when I say. Cum when I allow it.
**Setting:** `velvet private suite, house lights off, pink signal rim light, her rules now`

| File | PEEL (pose must match dialogue) |
| --- | --- |
| `0.png` | `black lingerie, garter belt, stockings, standing over viewer looking down, finger pointing at viewer's cock, soft commanding praise smile` |
| `1.png` | `bra gone, stockings on, kneeling between viewer's legs POV from above, looking up, mouth open tongue ready, praise not mean` |
| `2.png` | `panties pulled aside, cowgirl riding facing viewer, hands pinning his wrists, dripping wet, urgent house-rules lust face` |
| `3.png` | `nude in stockings only, straddling viewer's lap aftercare pose, thighs framing him, forehead kiss, proud good-boy smirk, cum glow` |

---

## 6) Miko — For Luck
**Folder:** `public/gen/*_miko-for-luck__*/` (or legacy `public/art/miko-for-luck/`)
**Dialogue beat:** Hands on yourself. Let me watch you take it.
**Setting:** `quiet shrine alcove on the slot floor, paper lanterns, warm gold, chips abandoned`

| File | PEEL (pose must match dialogue) |
| --- | --- |
| `0.png` | `white shrine maiden outfit, kneeling polite, sleeves raised, palms showing then gesturing to viewer's lap, shy bold smile, luck-blessing JOI` |
| `1.png` | `hakama open, white top undone, red ribbon bra, kneeling, thighs pressed together hard, watching your fist, embarrassed eager blush` |
| `2.png` | `shrine lingerie only, on all fours on prayer mat, ass up toward viewer, looking back over shoulder, dripping, 'cum for luck' needy face` |

---

## 7) Miko — Closing Blessing
**Folder:** `public/gen/*_miko-closing-blessing__*/` (or legacy `public/art/miko-closing-blessing/`)
**Dialogue beat:** Hands off everything but yourself.
**Setting:** `closed shrine floor, lights down, ceremonial lanterns, good kimono night`

| File | PEEL (pose must match dialogue) |
| --- | --- |
| `0.png` | `ornate cream-crimson kimono, formal obi, kneeling close enough breath hits viewer's lap, devoted hungry eyes` |
| `1.png` | `obi undone, kimono open on chest, bare cleavage, hands hovering near viewer's cock without touching, worshipful flush` |
| `2.png` | `kimono at waist, bare breasts, seiza with thighs open, fingering herself while staring at your strokes, soft moan face` |
| `3.png` | `nude wrapped in open kimono like offering cloth, on her back legs spread wrapped around waist pose, tears of joy, 'you deserve this' expression` |

---

## 8) Miko — Private Offering
**Folder:** `public/gen/*_miko-private-offering__*/` (or legacy `public/art/miko-private-offering/`)
**Dialogue beat:** Cock in your hand. Eyes on me. Sacred filthy.
**Setting:** `behind shrine curtain, private offering room, red lanterns, sacred and filthy`

| File | PEEL (pose must match dialogue) |
| --- | --- |
| `0.png` | `sheer red ceremonial robe, kneeling offering pose, palms up under viewer's cock height, looking at viewer like you are the blessing` |
| `1.png` | `robe open, red lace lingerie, crawling between viewer's knees, ass up, hungry devoted eyes, tongue slightly out` |
| `2.png` | `lingerie half off, POV between her knees, mouth open near cock, tongue out, not sucking yet, coaching you to stroke into her mouth` |
| `3.png` | `fully nude kneeling, forehead on viewer's thigh, both hands wrapping his cock with him, tongue out, cum-on-face ready worship expression` |

---

## 9) Miko — Only You
**Folder:** `public/gen/*_miko-only-you__*/` (or legacy `public/art/miko-only-you/`)
**Dialogue beat:** Only offering she wants is you.
**Setting:** `empty shrine at night, moonlight through paper screens, only you`

| File | PEEL (pose must match dialogue) |
| --- | --- |
| `0.png` | `white devotion silk kimono, sitting in viewer's lap facing him, forehead together, soft claim my-only-offering smile` |
| `1.png` | `kimono open, bare skin pressed to viewer, slow grinding, wet thighs shiny, desperate devoted blush` |
| `2.png` | `nude under open white silk, slow cowgirl riding, hands on his chest, whispering praise, sacred slut blush` |
| `3.png` | `fully nude, clinging aftercare embrace on shrine floor, silk under her, soft happy tears, owned-and-devoted smile` |

---

## 10) Blaze — Rematch
**Folder:** `public/gen/*_blaze-rematch__*/` (or legacy `public/art/blaze-rematch/`)
**Dialogue beat:** Stroke when I say. Look so good losing.
**Setting:** `neon pit rail night, cyan orange signs, asphalt bokeh, rematch energy`

| File | PEEL (pose must match dialogue) |
| --- | --- |
| `0.png` | `race crew jacket, crop top, short shorts, leaning on rail over viewer, pointing at his cock, grin like she already won watching you stroke` |
| `1.png` | `jacket open, sports bra, shorts unbuttoned tugged down, one foot up on rail, flashing pussy, hyped pick-up-the-pace face` |
| `2.png` | `tiny shorts and bra only, sweaty sheen, straddling rail facing viewer, hand pumping air in stroke rhythm, shouting encouragement ahegao-edge face` |

---

## 11) Blaze — Pit Lane
**Folder:** `public/gen/*_blaze-pit-lane__*/` (or legacy `public/art/blaze-pit-lane/`)
**Dialogue beat:** I call the RPM. Every drop.
**Setting:** `empty pit lane, neon overhead, no chips just her calling RPM`

| File | PEEL (pose must match dialogue) |
| --- | --- |
| `0.png` | `pit zip jacket half open, tight race pants, bouncing on heels, pointing at viewer's cock, I-call-the-RPM grin` |
| `1.png` | `jacket off, tank top sweat-soaked, pants shoved under ass, bent over racing tire, looking back, stroke-faster hand gesture, wet shine` |
| `2.png` | `sports lingerie, sitting on toolbox legs spread wide, fingering pussy, staring at your fist, loud moan face` |
| `3.png` | `nude with racing gloves only, on knees POV, gloved hands wrapping his cock with him, tongue out, finish-line ahegao` |

---

## 12) Blaze — Redline
**Folder:** `public/gen/*_blaze-redline__*/` (or legacy `public/art/blaze-redline/`)
**Dialogue beat:** Full throttle. Door locked.
**Setting:** `locked redline lounge, neon red wash, door locked, full throttle`

| File | PEEL (pose must match dialogue) |
| --- | --- |
| `0.png` | `red mesh top, micro skirt, fishnets, pinning viewer to couch, competitive lust grin, redline eyes` |
| `1.png` | `mesh yanked up, bare breasts pressed to his face, grinding on lap over clothes, dripping through thong, redline eyes` |
| `2.png` | `skirt gone, thong aside, reverse cowgirl looking back over shoulder, bouncing hard, don't-you-dare-slow-down face` |
| `3.png` | `nude in fishnets, collapsed on his chest after both finish, sweaty proud laugh, cum glow, winner aftercare` |

---

## 13) Blaze — Pole Position
**Folder:** `public/gen/*_blaze-pole-position__*/` (or legacy `public/art/blaze-pole-position/`)
**Dialogue beat:** No bet. Completely on your side.
**Setting:** `winner circle lights, gold sparks, soft neon afterglow, rivals to lovers`

| File | PEEL (pose must match dialogue) |
| --- | --- |
| `0.png` | `winner sash over race lingerie, starting trophy pose then dropping to knees for viewer, hungry grin` |
| `1.png` | `winner sash only, lingerie off, presenting on podium floor, legs spread, fingers spreading pussy, make-me-cum-like-you-mean-it face` |
| `2.png` | `nude with sash across breasts, mating press under viewer, legs up, looking up in love and lust, moaning` |
| `3.png` | `fully nude aftercare, forehead kiss, soft for once, gently holding his cock, pole position proud smile` |

---

## 14) Seraph — Descent
**Folder:** `public/gen/*_seraph-descent__*/` (or legacy `public/art/seraph-descent/`)
**Dialogue beat:** Breathe with me. How obedient can you be.
**Setting:** `empty roulette chapel, pale stone, cool blue-gold godrays, first fall`

| File | PEEL (pose must match dialogue) |
| --- | --- |
| `0.png` | `pale silk ceremonial robe, sitting at empty roulette table watching viewer, halo steady, calm stroke-invitation pose` |
| `1.png` | `robe open at chest, silk bra, standing between viewer's knees, hand on his chest guiding breathing, soft sacred lust` |
| `2.png` | `pale silk lingerie, halo dimming, kneeling prayer pose facing viewer's cock, half-lidded devotion, mouth parted ready for cum blessing` |

---

## 15) Seraph — Halo Slip
**Folder:** `public/gen/*_seraph-halo-slip__*/` (or legacy `public/art/seraph-halo-slip/`)
**Dialogue beat:** Hands on yourself only when I say.
**Setting:** `chapel side chamber, halo tilted and flickering from thinking of you`

| File | PEEL (pose must match dialogue) |
| --- | --- |
| `0.png` | `loose halo silk dress slipping, sitting close, dress ridden up thighs, whispering stroke instructions, halo tilted` |
| `1.png` | `dress at waist, bare breasts, halo cracked light, straddling lap grinding on clothed cock, serene filthy praise face` |
| `2.png` | `lingerie, broken halo shards floating, on her back legs spread, fingering clit in time with your strokes, mouth open` |
| `3.png` | `nude, faint halo remnant, missionary under viewer, forehead pressed to his, stroke-for-me whispered mid-thrust face` |

---

## 16) Seraph — Soft Blasphemy
**Folder:** `public/gen/*_seraph-soft-blasphemy__*/` (or legacy `public/art/seraph-soft-blasphemy/`)
**Dialogue beat:** Your cum as an offering she chooses.
**Setting:** `desecrated chapel alcove, gold cloth on floor, she told them she was praying`

| File | PEEL (pose must match dialogue) |
| --- | --- |
| `0.png` | `unwinged silk wrap barely closed, kneeling, half halo gone, hands clasped then opening under cock as offering bowl` |
| `1.png` | `wrap open, bare breasts, pressing forehead to viewer's knee, halo guttering, begging for cum as holy offering` |
| `2.png` | `nude under open wrap, lying on gold cloth, legs open, fingers spreading pussy wide, blasphemous calm smile` |
| `3.png` | `fully nude kneeling, mouth open under viewer's cock POV, eyes wet with devotion, tongue out ready for cum sacrament` |

---

## 17) Seraph — Fallen For You
**Folder:** `public/gen/*_seraph-fallen-for-you__*/` (or legacy `public/art/seraph-fallen-for-you/`)
**Dialogue beat:** No halo. Chosen fall.
**Setting:** `night chapel, no halo left, only moonlight and gold candles, chosen fall`

| File | PEEL (pose must match dialogue) |
| --- | --- |
| `0.png` | `sheer ivory gown, no halo, holding viewer's face, soft confession pose before JOI, chosen fall eyes` |
| `1.png` | `gown open, bare body pressed to viewer, slow grinding, tears of relief, fallen on purpose smile` |
| `2.png` | `nude with open gown, slow deep cowgirl, praising every gasp, sacred slut for only you expression` |
| `3.png` | `fully nude aftercare, curled on his chest on chapel floor, no halo, loving smile, cum drying on stomach, chosen forever` |

---

## Checklist

- [ ] Pick one seed per girl; reuse for every peel of that girl
- [ ] Generate peels by changing **only** the PEEL / outfit line (keep face tags + seed)
- [ ] Save as `DROP/image.png` inside the matching `public/gen/...` folder
- [ ] Pose should match the chapter JOI beat (coach → wet → climax freaky)
- [ ] No text in images
- [ ] Refresh game — scene should show your PNG
