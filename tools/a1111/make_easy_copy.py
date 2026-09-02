#!/usr/bin/env python3
"""
Build drag-and-drop art packs the game can load directly.

EASIEST PATH (one DROP folder per scene):

  public/art/blaze-pit-lane/
    0_POSITIVE.txt      ← copy into A1111 for peel 0
    1_POSITIVE.txt
    NEGATIVE.txt
    SETTINGS.txt
    DROP/
      0.png             ← drag A1111 output here (rename to 0.png)
      1.png
      2.png
      3.png

Also writes numbered packs under public/gen/…/DROP/image.png (same prompts).
"""

from __future__ import annotations

import json
from pathlib import Path

import build_queue as bq

REPO = Path(__file__).resolve().parents[2]
GEN = REPO / "public" / "gen"
ART = REPO / "public" / "art"
TOOLS_EASY = Path(__file__).resolve().parent / "easy_copy"


def settings_text(seed: int, save_hint: str) -> str:
    seed_line = (
        f"Seed: {seed}   (keep this locked for this girl)"
        if seed >= 0
        else "Seed: -1  (random). After you like a face, copy the seed from the image info and reuse it for her other images."
    )
    return "\n".join(
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
            f"Save / drag the PNG to:  {save_hint}",
            "",
        ]
    )


def write_art_scene_packs(jobs: list[dict], manifest: dict[str, dict[str, str]]) -> None:
    """One scene folder + one DROP/ for drag-and-drop peels."""
    by_scene: dict[str, list[dict]] = {}
    for job in jobs:
        by_scene.setdefault(job["scene_id"], []).append(job)

    ART.mkdir(parents=True, exist_ok=True)

    # Preserve existing peels wherever they already live
    saved_pngs: dict[str, bytes] = {}
    if ART.exists():
        for png in ART.glob("*/*.png"):
            saved_pngs[f"{png.parent.name}/{png.name}"] = png.read_bytes()
        for png in ART.glob("*/DROP/*.png"):
            saved_pngs[f"{png.parent.parent.name}/DROP/{png.name}"] = png.read_bytes()

    index_rows: list[str] = [
        "# Drag & drop scene art",
        "",
        "Open a scene folder → open **`DROP/`** → drag your A1111 PNGs in as:",
        "`0.png` `1.png` `2.png` `3.png`",
        "",
        "Copy that layer's `N_POSITIVE.txt` into A1111 first. Same NEGATIVE + SETTINGS for all layers.",
        "",
        "| Scene | Girl | DROP folder |",
        "| --- | --- | --- |",
    ]

    for scene_id, scene_jobs in by_scene.items():
        scene_jobs = sorted(scene_jobs, key=lambda j: j["layer"])
        folder = ART / scene_id
        drop = folder / "DROP"
        drop.mkdir(parents=True, exist_ok=True)

        # Clear stale text helpers (keep DROP pngs / folder pngs)
        for p in folder.iterdir():
            if p.is_file() and p.suffix.lower() != ".png":
                p.unlink()
        for p in drop.iterdir():
            if p.is_file() and p.suffix.lower() != ".png":
                p.unlink()

        girl = scene_jobs[0]["girl"]
        neg = scene_jobs[0]["negative"]
        (folder / "NEGATIVE.txt").write_text(neg + "\n", encoding="utf-8")
        (folder / "SETTINGS.txt").write_text(
            settings_text(
                scene_jobs[0]["seed"],
                f"public/art/{scene_id}/DROP/0.png  (then 1.png, 2.png…)",
            ),
            encoding="utf-8",
        )

        slot_lines: list[str] = []
        for job in scene_jobs:
            layer = job["layer"]
            (folder / f"{layer}_POSITIVE.txt").write_text(job["prompt"] + "\n", encoding="utf-8")
            slot_lines.append(f"  {layer}.png  ← from {layer}_POSITIVE.txt")

            # Restore into DROP/ (preferred)
            for key in (
                f"{scene_id}/DROP/{layer}.png",
                f"{scene_id}/{layer}.png",
            ):
                if key in saved_pngs:
                    (drop / f"{layer}.png").write_bytes(saved_pngs[key])
                    break

        (drop / ">>> DRAG 0.png 1.png 2.png 3.png HERE <<<.txt").write_text(
            "\n".join(
                [
                    "DRAG AND DROP YOUR GENERATED PNGs INTO THIS FOLDER",
                    "",
                    "Rename each file exactly:",
                    "",
                    *slot_lines,
                    "",
                    "Then refresh the game. Done.",
                    "",
                    f"Scene: {scene_id}   Girl: {girl}",
                    "",
                ]
            ),
            encoding="utf-8",
        )

        # Empty placeholder names so the folder looks like drop slots in file UIs
        for job in scene_jobs:
            layer = job["layer"]
            slot = drop / f"{layer}.png.txt"
            if not (drop / f"{layer}.png").exists():
                slot.write_text(
                    f"Delete this file and drag your generation here as {layer}.png\n",
                    encoding="utf-8",
                )

        readme = "\n".join(
            [
                f"SCENE: {scene_id}",
                f"GIRL: {girl}",
                "",
                "=== EASY DRAG & DROP ===",
                "",
                f"1. Open:  public/art/{scene_id}/DROP/",
                "2. Generate each peel in A1111 (copy N_POSITIVE.txt)",
                "3. Drag the PNG into DROP/ and name it 0.png / 1.png / 2.png / 3.png",
                "4. Refresh the game",
                "",
                "Slots:",
                *slot_lines,
                "",
                "Prompts live next to DROP/ (0_POSITIVE.txt, NEGATIVE.txt, SETTINGS.txt).",
                "Poses change per layer. Same face/seed. Thick bold outlines.",
                "",
            ]
        )
        (folder / "README.txt").write_text(readme, encoding="utf-8")
        index_rows.append(
            f"| `{scene_id}` | {girl} | `public/art/{scene_id}/DROP/` |"
        )

    (ART / "README.md").write_text(
        "\n".join(
            [
                "# Drag & drop your generations here",
                "",
                "Every scene has a **`DROP/`** folder. Example — Blaze Pit Lane:",
                "",
                "```",
                "public/art/blaze-pit-lane/DROP/0.png   ← drag peel 0 here",
                "public/art/blaze-pit-lane/DROP/1.png",
                "public/art/blaze-pit-lane/DROP/2.png",
                "public/art/blaze-pit-lane/DROP/3.png",
                "```",
                "",
                "1. Copy `0_POSITIVE.txt` → A1111 → Generate",
                "2. Drag the result into that scene’s `DROP/` as `0.png`",
                "3. Repeat for 1 / 2 / 3",
                "4. Refresh the game",
                "",
                "Full list: [`INDEX.md`](./INDEX.md)",
                "",
                "Also still works: `public/gen/NN_scene__layer/DROP/image.png`",
                "",
            ]
        ),
        encoding="utf-8",
    )
    (ART / "INDEX.md").write_text("\n".join(index_rows) + "\n", encoding="utf-8")
    print(f"Synced {len(by_scene)} art DROP folders → {ART}")


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

    manifest: dict[str, dict[str, str]] = {}
    index_lines = [
        "# Numbered gen packs (optional)",
        "",
        "**Easier path:** use [`public/art/INDEX.md`](../art/INDEX.md) — one `DROP/` folder per scene.",
        "",
        "These numbered packs also work: drag into each `DROP/` as `image.png`.",
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
        (folder / "SETTINGS.txt").write_text(
            settings_text(
                job["seed"],
                f"public/art/{job['scene_id']}/DROP/{job['layer']}.png  (easiest)  OR  public/gen/{name}/DROP/image.png",
            ),
            encoding="utf-8",
        )

        (drop / ">>> DRAG image.png HERE <<<.txt").write_text(
            "\n".join(
                [
                    "DRAG YOUR GENERATED PNG INTO THIS FOLDER",
                    "",
                    "Exact filename:",
                    "    image.png",
                    "",
                    "EASIER: use the scene DROP instead:",
                    f"    public/art/{job['scene_id']}/DROP/{job['layer']}.png",
                    "",
                    f"Scene: {job['scene_id']}   layer: {job['layer']}   girl: {job['girl']}",
                    "",
                ]
            ),
            encoding="utf-8",
        )
        (drop / ".gitkeep").write_text("", encoding="utf-8")

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

    write_art_scene_packs(jobs, manifest)

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
                "# Drag & drop",
                "",
                "Easiest: **[`public/art/`](../../../public/art/README.md)**",
                "",
                "```",
                "public/art/blaze-pit-lane/DROP/0.png",
                "public/art/blaze-pit-lane/DROP/1.png",
                "…",
                "```",
                "",
                "Open `DROP/`, drag PNGs in, refresh the game.",
                "",
            ]
        ),
        encoding="utf-8",
    )

    print(f"Wrote {len(jobs)} gen folders → {GEN}")
    print(f"Art DROP hubs → {ART} (see INDEX.md)")
    if saved:
        print(f"Restored {len(saved)} existing DROP/image.png file(s)")


if __name__ == "__main__":
    main()
