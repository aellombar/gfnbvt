# Automatic1111 batch queue

## Same girl across scenes?

SD does **not** remember characters by name. Read:

**[`docs/CHARACTER_CONSISTENCY.md`](../../docs/CHARACTER_CONSISTENCY.md)**

Minimum: lock one seed per girl in `build_queue.py` → `SEEDS`.
Better: IP-Adapter FaceID reference, or a character LoRA.

## Build the queue

```bash
python3 tools/a1111/build_queue.py
```

Outputs:

| File | What |
| --- | --- |
| `queue_prompts_from_file.txt` | Load in A1111 → Script → **Prompts from file or textbox** |
| `queue_jobs.json` | Same jobs, machine-readable |
| `rename_map.txt` | Where each finished PNG should land in `public/art/` |

64 jobs = every peel of every scene.

## Run in the WebUI

1. Paste seeds into `SEEDS` in `build_queue.py`, rebuild
2. Open Automatic1111 / Forge
3. Script → **Prompts from file or textbox**
4. Load `queue_prompts_from_file.txt`
5. Generate — it walks the list
6. Rename outputs using `rename_map.txt` into `public/art/<scene>/<n>.png`

## Or hit the API (auto-saves into the game folders)

Launch WebUI with `--api`, then:

```bash
python3 tools/a1111/build_queue.py --api http://127.0.0.1:7860
```

Refuses to run until all four `SEEDS` are set (not `-1`).
