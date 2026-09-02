# Automatic1111 / Forge

## First time? Start here

**[`START_HERE.md`](./START_HERE.md)** — click-by-click WebUI guide.

Then open **[`easy_copy/INDEX.md`](./easy_copy/INDEX.md)** and do one folder at a time
(`POSITIVE.txt` / `NEGATIVE.txt` / `SAVE_AS.txt`).

## Can Cursor attach to my A1111 API?

No from the cloud agent — it cannot see `localhost` on your PC.
Generate in the WebUI, drop PNGs into `public/art/…`, then commit.

## Same girl across scenes?

**[`docs/CHARACTER_CONSISTENCY.md`](../../docs/CHARACTER_CONSISTENCY.md)**

## Advanced overnight queue (later)

```bash
python3 tools/a1111/build_queue.py
python3 tools/a1111/make_easy_copy.py   # also refreshes easy_copy/
```

Or API (only if WebUI launched with `--api` **on your machine**):

```bash
python3 tools/a1111/build_queue.py --api http://127.0.0.1:7860
```
