# START HERE — first time using Automatic1111

## Can Cursor generate these via API?

**No.** Your WebUI is on your PC; this cloud agent can’t see it.

## Where to work

Everything is in **`public/gen/`** so the game can load your PNGs with no extra copy step.

Open: [`public/gen/INDEX.md`](../../public/gen/INDEX.md)

---

## One-time WebUI setup

1. Open Automatic1111 / Forge (`http://127.0.0.1:7860`)
2. Load checkpoint **Pony Diffusion V6 XL**
3. Settings → Stable Diffusion → **Clip skip = 2** → Apply
4. Go to **txt2img**

---

## Make one image (repeat)

Example: first Raven image

1. Open folder `public/gen/01_raven-first-timer__0/`
2. Copy **`POSITIVE.txt`** → paste into **Prompt**
3. Copy **`NEGATIVE.txt`** → paste into **Negative prompt**
4. Match **`SETTINGS.txt`** (832×1216, steps 30, CFG 6.5)
5. Click **Generate**
6. Save the PNG into:

   ```
   public/gen/01_raven-first-timer__0/DROP/image.png
   ```

   Exact name: **`image.png`** inside that folder’s **`DROP/`** directory.
7. Refresh the game. That scene uses your art.
8. Do folder `02_…`, then `03_…`, etc.

---

## Same girl tip

When you like Raven’s face, copy her **Seed** from image info and reuse it
for her other folders.

---

## Do NOT use

- `public/art/…` (legacy; optional)
- Copying files around after generate — `DROP/image.png` is enough
