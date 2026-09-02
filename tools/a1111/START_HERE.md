# START HERE — first time using Automatic1111

## Can Cursor generate these for me via the API?

**No — not from this cloud agent to your PC.**

Your Automatic1111 runs on *your* computer (`http://127.0.0.1:7860`).
Cursor’s cloud agent cannot see your localhost, so it cannot queue Pony V6
jobs for you or push the PNGs to GitHub by itself.

What *would* work later (optional, advanced):

- You run A1111 with `--api` and expose it (ngrok / tailscale), then tell the
  agent the public URL — still awkward and you must leave the WebUI running.
- Or you generate locally and just drop PNGs into `public/art/…` (this guide).

Cursor’s built-in image tool is a **different model**, not Pony Diffusion V6,
so it won’t match the Fappy-like 3D look you asked for.

**Easiest path for a first-timer: use the WebUI with the copy folders below.**

---

## What you need open

1. **Automatic1111 or Forge** already installed, with **Pony Diffusion V6 XL** loaded
2. This repo on your machine (or GitHub website to upload files later)
3. Folder: `tools/a1111/easy_copy/`

If `easy_copy` is missing, run once:

```bash
cd tools/a1111
python3 make_easy_copy.py
```

---

## One-time WebUI setup (do this once)

1. Open the WebUI in your browser (usually `http://127.0.0.1:7860`)
2. Top left / checkpoint dropdown → pick **Pony Diffusion V6 XL**
3. Click **Settings** (top)
4. Go to **Stable Diffusion**
5. Set **Clip skip** = `2`
6. Click **Apply settings**
7. Click **txt2img** tab (top)

You’re ready.

---

## How to make ONE image (do this 64 times, or stop when tired)

Open `tools/a1111/easy_copy/INDEX.md` — it lists every image in order.

### Example: first image (Raven, Last Call, clothed)

1. Open folder `tools/a1111/easy_copy/01_raven-first-timer__0/`
2. Open **`POSITIVE.txt`**
   - Press Ctrl+A (select all), Ctrl+C (copy)
   - In WebUI, click the big **Prompt** box, Ctrl+V (paste)
3. Open **`NEGATIVE.txt`**
   - Ctrl+A, Ctrl+C
   - In WebUI, click **Negative prompt**, Ctrl+V
4. Open **`SETTINGS.txt`** and set the left side to match:
   - Steps `30`
   - CFG `6.5`
   - Width `832`
   - Height `1216`
   - Sampler `DPM++ 2M Karras`
5. Click the big **Generate** button. Wait.
6. When you like it:
   - Click the download / save icon under the image  
     **or** find it in your WebUI `outputs/txt2img-images/` folder
7. Open **`SAVE_AS.txt`** — it says exactly where to put the file, e.g.

   ```
   public/art/raven-first-timer/0.png
   ```

   Rename your download to `0.png` and move it into that folder.
8. Go to folder `02_…` and repeat.

---

## Keeping her the same girl (simple version)

For your **first** Raven image you love:

1. Under the image in WebUI, open **ℹ️ info** / PNG info
2. Copy the **Seed** number (example: `2847193551`)
3. For every other Raven image, paste that seed into the Seed box  
   (turn off “random seed” / dice icon so it stays locked)

Do the same separately for Miko, Blaze, Seraph — **one seed each**.

That alone helps a lot for peels of the same scene.  
For *different* scenes still drifting, later add FaceID or a LoRA
(see `docs/CHARACTER_CONSISTENCY.md`) — skip that on day one.

---

## After a few PNGs are in place

1. Run the game (`npm run dev` or your Pages URL)
2. Play that scene — if `0.png` exists, the SVG placeholder is replaced automatically
3. Commit / push the `public/art/...` PNGs to GitHub when you’re happy

You do **not** need `rig.json`. You do **not** need the API.

---

## “Prompts from file” (optional, later)

When you’re comfortable, the advanced overnight queue is still here:

- `tools/a1111/queue_prompts_from_file.txt`
- WebUI → Script dropdown → **Prompts from file or textbox**

First-timers should ignore that and use `easy_copy/` one folder at a time.
