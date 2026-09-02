#!/usr/bin/env python3
"""
Build a FIRST-TIMER pack for Automatic1111 / Forge.

Creates one folder per image with copy-paste files:
  POSITIVE.txt   → paste into the big prompt box
  NEGATIVE.txt   → paste into the negative box
  SETTINGS.txt   → what to set on the left / top
  SAVE_AS.txt    → exact path/filename in this repo

Also rebuilds the advanced queue files.
"""

from __future__ import annotations

import json
from pathlib import Path

# Reuse the scene list / style from build_queue
import build_queue as bq

ROOT = Path(__file__).resolve().parent
EASY = ROOT / "easy_copy"


def main() -> None:
    jobs = bq.build_jobs()
    bq.write_files(jobs)

    if EASY.exists():
        for p in EASY.rglob("*"):
            if p.is_file():
                p.unlink()
        for p in sorted(EASY.rglob("*"), reverse=True):
            if p.is_dir():
                p.rmdir()
    EASY.mkdir(parents=True, exist_ok=True)

    index_lines = [
        "# Easy copy pack — one folder = one image",
        "",
        "Open folders **in order**. For each folder:",
        "1. Open `POSITIVE.txt` → Ctrl+A → Ctrl+C → paste into A1111 **Prompt**",
        "2. Open `NEGATIVE.txt` → Ctrl+A → Ctrl+C → paste into A1111 **Negative prompt**",
        "3. Set the numbers in `SETTINGS.txt`",
        "4. Click **Generate**",
        "5. Save/download the PNG using the path in `SAVE_AS.txt`",
        "",
        "| # | Folder | Girl | Save as |",
        "| --- | --- | --- | --- |",
    ]

    for i, job in enumerate(jobs, 1):
        name = f"{i:02d}_{job['scene_id']}__{job['layer']}"
        folder = EASY / name
        folder.mkdir(parents=True, exist_ok=True)
        (folder / "POSITIVE.txt").write_text(job["prompt"] + "\n", encoding="utf-8")
        (folder / "NEGATIVE.txt").write_text(job["negative"] + "\n", encoding="utf-8")
        seed = job["seed"]
        seed_line = (
            f"Seed: {seed}   (keep this locked for this girl)"
            if seed >= 0
            else "Seed: -1  (random). After you like a face, copy the seed from the image info and reuse it for her other images."
        )
        (folder / "SETTINGS.txt").write_text(
            "\n".join(
                [
                    "In Automatic1111 / Forge txt2img tab:",
                    "",
                    "Checkpoint / model:  Pony Diffusion V6 XL",
                    "Sampling method:     DPM++ 2M Karras   (or Euler a)",
                    "Sampling steps:      30",
                    "CFG Scale:           6.5",
                    "Width:               832",
                    "Height:              1216",
                    "Batch count:         1",
                    "Batch size:          1",
                    "Clip skip:           2   (Settings → Stable Diffusion → Clip skip)",
                    seed_line,
                    "",
                    "Then click the big orange Generate button.",
                    "",
                ]
            ),
            encoding="utf-8",
        )
        (folder / "SAVE_AS.txt").write_text(
            "\n".join(
                [
                    "Save the finished PNG exactly here in the game repo:",
                    "",
                    f"  {job['drop_to']}",
                    "",
                    "Create the folder if needed. Name must be exact (0.png, 1.png, …).",
                    "Then refresh the game — that scene will use your art.",
                    "",
                ]
            ),
            encoding="utf-8",
        )
        index_lines.append(
            f"| {i} | `{name}` | {job['girl']} | `{job['drop_to']}` |"
        )

    (EASY / "INDEX.md").write_text("\n".join(index_lines) + "\n", encoding="utf-8")
    print(f"Wrote {len(jobs)} easy folders → {EASY}")
    print(f"Start at {EASY / 'INDEX.md'}")


if __name__ == "__main__":
    main()
