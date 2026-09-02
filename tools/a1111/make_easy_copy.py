#!/usr/bin/env python3
"""
Build first-timer gen packs the game can load directly.

Each image gets a folder under public/gen/:

  public/gen/01_raven-first-timer__0/
    POSITIVE.txt
    NEGATIVE.txt
    SETTINGS.txt
    DROP/
      README.txt          ← read this
      (put image.png here)

Save your A1111 output as:  DROP/image.png
Refresh the game — that scene uses it. No copying into public/art/.
"""

from __future__ import annotations

import json
from pathlib import Path

import build_queue as bq

REPO = Path(__file__).resolve().parents[2]
GEN = REPO / "public" / "gen"
TOOLS_EASY = Path(__file__).resolve().parent / "easy_copy"


def main() -> None:
    jobs = bq.build_jobs()
    bq.write_files(jobs)

    saved: dict[str, bytes] = {}
    if GEN.exists():
        for img in GEN.glob("*/DROP/image.png"):
            saved[img.parent.parent.name] = img.read_bytes()
        for p in GEN.rglob("*"):
            if p.is_file():
                p.unlink()
        for p in sorted(GEN.rglob("*"), reverse=True):
            if p.is_dir():
                p.rmdir()
    GEN.mkdir(parents=True, exist_ok=True)

    # manifest: sceneId -> { "0": "01_raven-first-timer__0", ... }
    manifest: dict[str, dict[str, str]] = {}
    index_lines = [
        "# Generate here — one folder = one image",
        "",
        "Poses are locked to chapter + JOI dialogue (coach → peel → wet/spread → climax freaky).",
        "Do not swap peels across layers — `__0` is clothed coach, last layer is finish-freaky.",
        "",
        "Style lock: thick bold outlines, flat cel color, slightly detailed face/hair/outfit.",
        "Use SETTINGS.txt as written (34 steps / CFG 7). Lock one seed per girl.",
        "",
        "For each folder, in order:",
        "1. Copy `POSITIVE.txt` → A1111 Prompt",
        "2. Copy `NEGATIVE.txt` → A1111 Negative prompt",
        "3. Match `SETTINGS.txt`",
        "4. Click **Generate**",
        "5. Save the PNG into that folder's **`DROP/image.png`** (exact name)",
        "6. Refresh the game — done. Do **not** copy to `public/art/`.",
        "",
        "| # | Folder | Girl | Drop file |",
        "| --- | --- | --- | --- |",
    ]

    for i, job in enumerate(jobs, 1):
        name = f"{i:02d}_{job['scene_id']}__{job['layer']}"
        folder = GEN / name
        drop = folder / "DROP"
        drop.mkdir(parents=True, exist_ok=True)

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
                    "Sampling steps:      34",
                    "CFG Scale:           7",
                    "Width:               832",
                    "Height:              1216",
                    "Batch count:         1",
                    "Batch size:          1",
                    "Clip skip:           2   (Settings → Stable Diffusion → Clip skip)",
                    seed_line,
                    "",
                    "Then click Generate.",
                    "",
                    f"Save the PNG as:  public/gen/{name}/DROP/image.png",
                    "",
                ]
            ),
            encoding="utf-8",
        )

        (drop / "README.txt").write_text(
            "\n".join(
                [
                    "PUT YOUR GENERATED PNG IN THIS FOLDER",
                    "",
                    "Exact filename required:",
                    "",
                    "    image.png",
                    "",
                    "Steps:",
                    "1. Generate in Automatic1111",
                    "2. Download / save the image",
                    "3. Move it here and rename it to image.png",
                    "4. Refresh the game — this slot lights up automatically",
                    "",
                    f"Scene: {job['scene_id']}   layer: {job['layer']}   girl: {job['girl']}",
                    "",
                ]
            ),
            encoding="utf-8",
        )

        # Keep an empty marker so git tracks the folder before any PNG exists
        (drop / ".gitkeep").write_text("", encoding="utf-8")

        # Restore a previously dropped image if this folder name still matches
        if name in saved:
            (drop / "image.png").write_bytes(saved[name])

        manifest.setdefault(job["scene_id"], {})[str(job["layer"])] = name
        index_lines.append(
            f"| {i} | `{name}` | {job['girl']} | `public/gen/{name}/DROP/image.png` |"
        )

    (GEN / "manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )
    (GEN / "INDEX.md").write_text("\n".join(index_lines) + "\n", encoding="utf-8")

    # Pointer from tools/ so old links still make sense
    if TOOLS_EASY.exists():
        for p in TOOLS_EASY.rglob("*"):
            if p.is_file():
                p.unlink()
        for p in sorted(TOOLS_EASY.rglob("*"), reverse=True):
            if p.is_dir():
                p.rmdir()
    TOOLS_EASY.mkdir(parents=True, exist_ok=True)
    (TOOLS_EASY / "README.md").write_text(
        "\n".join(
            [
                "# Moved",
                "",
                "Gen packs now live where the game can load them:",
                "",
                "**[`public/gen/INDEX.md`](../../../public/gen/INDEX.md)**",
                "",
                "Each folder has a `DROP/` directory — put `image.png` there.",
                "",
            ]
        ),
        encoding="utf-8",
    )

    print(f"Wrote {len(jobs)} gen folders → {GEN}")
    print(f"Start at {GEN / 'INDEX.md'}")
    print("Put each PNG in that folder's DROP/image.png")
    if saved:
        print(f"Restored {len(saved)} existing DROP/image.png file(s)")


if __name__ == "__main__":
    main()
