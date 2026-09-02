# How A1111 keeps the *same girl* across outfits & scenes

Short answer: **it doesn't, unless you lock her.**

Pony Diffusion does not read `raven` as a permanent person. Those tags only
bias hair/eyes/vibe. Across different scenes/outfits the model will happily
invent a new face unless you force identity with one of the methods below.

---

## What actually works (best → okay)

### 1) Character LoRA (best, once, then easy forever)
Train a tiny LoRA on 15–30 images of one girl (same face, varied outfits).
Then every prompt includes:

```text
<lora:raven_v1:0.8>, raven, …
```

Do this once per girl. After that, batch queueing is safe — outfits can change
and she still looks like her.

### 2) IP-Adapter FaceID / face reference (best without training)
1. Generate a clean face sheet for Raven you love.
2. In A1111/Forge, enable **IP-Adapter FaceID** (or InstantID).
3. Pin that face image at weight ~0.7–0.9 for every Raven job.
4. Change only outfit/scene tags in the prompt.

Same for Miko / Blaze / Seraph — one reference face each.

### 3) Locked seed + identical character block (good for peels of ONE scene)
Within a single scene:

1. Generate `0.png` until the face is perfect.
2. Copy that **seed**.
3. Re-run with the **exact same seed + character tags**, only swap the peel/outfit line → `1.png`, `2.png`.

This is why `tools/a1111/build_queue.py` has a `SEEDS` map.

**Limit:** the same seed across *different scenes* (booth → bedroom) often still
drifts because the background/outfit tokens pull the composition. Use LoRA or
FaceID for cross-scene identity.

### 4) img2img from her face crop (good bridge)
Take the good `0.png`, crop the face, or use the whole body with denoise
**0.35–0.55**, and prompt the new outfit/scene. Keeps identity better than
fresh txt2img.

---

## Recommended pipeline for this game

1. **Face lock day**
   - Generate 1 hero portrait per girl. Save seed + image.
   - Paste seeds into `SEEDS` in `tools/a1111/build_queue.py`
   - Optional but strongly recommended: make a FaceID reference or train LoRA

2. **Build the queue**
   ```bash
   python3 tools/a1111/build_queue.py
   ```
   Creates:
   - `tools/a1111/queue_prompts_from_file.txt` — drop into A1111
   - `tools/a1111/queue_jobs.json` — machine-readable
   - `tools/a1111/rename_map.txt` — where each output PNG belongs

3. **Run the queue in Automatic1111**
   - Script dropdown → **Prompts from file or textbox**
   - Load `queue_prompts_from_file.txt`
   - Generate (it walks every line = every peel of every scene)

   Or if A1111 API is up (`--api` flag when launching WebUI):
   ```bash
   python3 tools/a1111/build_queue.py --api http://127.0.0.1:7860
   ```
   That writes finished PNGs straight into `public/art/<scene-id>/<n>.png`.

4. **Drop / rename**
   If you used the file script (not API), rename using `rename_map.txt`:
   ```
   raven-first-timer__0.png  ->  public/art/raven-first-timer/0.png
   raven-first-timer__1.png  ->  public/art/raven-first-timer/1.png
   …
   ```

---

## Why peels stay matching inside a scene

The queue keeps, for every peel of a scene:

- the **same girl tag block**
- the **same setting line**
- the **same seed** (once you set it)
- **only the outfit/peel line changes**

That is what makes `0/1/2/3` look like the same pose with clothes coming off,
instead of four random women.

---

## Quick checklist

- [ ] One locked seed (and/or FaceID / LoRA) **per girl**
- [ ] Never rewrite her hair/eye tags between scenes
- [ ] Change only setting + outfit for new scenes
- [ ] For peels: same seed, same pose wording (`same pose`)
- [ ] No text/watermarks in negatives (already included)
