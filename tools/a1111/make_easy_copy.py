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
            f"Save the PNG as:  {save_hint}",
            "",
        ]
    )


def write_art_scene_packs(jobs: list[dict], manifest: dict[str, dict[str, str]]) -> None:
    """Keep legacy public/art/<sceneId>/ folders in sync with gen packs."""
    by_scene: dict[str, list[dict]] = {}
    for job in jobs:
        by_scene.setdefault(job["scene_id"], []).append(job)

    ART.mkdir(parents=True, exist_ok=True)

    # Preserve any existing PNGs under art/
    saved_pngs: dict[str, bytes] = {}
    if ART.exists():
        for png in ART.glob("*/*.png"):
            saved_pngs[f"{png.parent.name}/{png.name}"] = png.read_bytes()

    for scene_id, scene_jobs in by_scene.items():
        scene_jobs = sorted(scene_jobs, key=lambda j: j["layer"])
        folder = ART / scene_id
        folder.mkdir(parents=True, exist_ok=True)

        # Clear stale text helpers but keep folder
        for p in folder.iterdir():
            if p.is_file() and p.suffix.lower() != ".png":
                p.unlink()

        girl = scene_jobs[0]["girl"]
        neg = scene_jobs[0]["negative"]
        (folder / "NEGATIVE.txt").write_text(neg + "\n", encoding="utf-8")
        (folder / "SETTINGS.txt").write_text(
            settings_text(scene_jobs[0]["seed"], f"public/art/{scene_id}/0.png (then 1.png, 2.png…)"),
            encoding="utf-8",
        )

        peel_lines = []
        gen_lines = []
        for job in scene_jobs:
            layer = job["layer"]
            (folder / f"{layer}_POSITIVE.txt").write_text(job["prompt"] + "\n", encoding="utf-8")
            peel_lines.append(f"  {layer}.png  ←  {layer}_POSITIVE.txt")
            gen_name = manifest.get(scene_id, {}).get(str(layer), f"??_{scene_id}__{layer}")
            gen_lines.append(
                f"  layer {layer}: public/gen/{gen_name}/DROP/image.png"
            )

            # Restore PNG if present
            key = f"{scene_id}/{layer}.png"
            if key in saved_pngs:
                (folder / f"{layer}.png").write_bytes(saved_pngs[key])

        readme = "\n".join(
            [
                f"SCENE: {scene_id}",
                f"GIRL: {girl}",
                "",
                "Two ways to drop art (game accepts both):",
                "",
                "PREFERRED — numbered gen packs (prompts already split per layer):",
                *gen_lines,
                "",
                "OR legacy flat drop in THIS folder:",
                *peel_lines,
                "",
                "How to generate (legacy path):",
                "1. Copy NEGATIVE.txt → A1111 Negative",
                "2. Match SETTINGS.txt (34 steps / CFG 7)",
                "3. For each layer, copy N_POSITIVE.txt → Prompt, Generate",
                "4. Save as N.png in this folder (0.png, 1.png, 2.png…)",
                "5. Refresh the game",
                "",
                "Poses change per layer (coach → wet/spread → climax). Same face/seed.",
                "Style: thick bold outlines, flat cel, slightly detailed face/hair.",
                "",
                "Also see: public/gen/INDEX.md",
                "",
            ]
        )
        (folder / "README.txt").write_text(readme, encoding="utf-8")

    (ART / "README.md").write_text(
        "\n".join(
            [
                "# Scene art folders",
                "",
                "Every scene has a folder here, e.g. **`blaze-pit-lane/`**.",
                "",
                "## Preferred path",
                "Use the numbered packs in [`../gen/INDEX.md`](../gen/INDEX.md):",
                "",
                "```",
                "public/gen/38_blaze-pit-lane__0/DROP/image.png",
                "public/gen/39_blaze-pit-lane__1/DROP/image.png",
                "…",
                "```",
                "",
                "## Legacy flat drop (still works)",
                "Or put files straight in the scene folder:",
                "",
                "```",
                "public/art/blaze-pit-lane/0.png",
                "public/art/blaze-pit-lane/1.png",
                "public/art/blaze-pit-lane/2.png",
                "public/art/blaze-pit-lane/3.png",
                "```",
                "",
                "Each scene folder now includes:",
                "- `README.txt` — peels + both drop paths",
                "- `N_POSITIVE.txt` — prompt per layer",
                "- `NEGATIVE.txt` / `SETTINGS.txt`",
                "",
                "Game loads **gen DROP first**, then falls back to `art/<scene>/N.png`.",
                "",
                "Style: thick bold outlines, flat Mosbles cel, slightly detailed face/hair.",
                "",
            ]
        ),
        encoding="utf-8",
    )
    print(f"Synced {len(by_scene)} legacy art folders → {ART}")


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
        "Legacy scene folders (`public/art/blaze-pit-lane/` etc.) are also synced —",
        "you can drop `0.png`/`1.png` there instead if you prefer.",
        "",
        "For each folder, in order:",
        "1. Copy `POSITIVE.txt` → A1111 Prompt",
        "2. Copy `NEGATIVE.txt` → A1111 Negative prompt",
        "3. Match `SETTINGS.txt`",
        "4. Click **Generate**",
        "5. Save the PNG into that folder's **`DROP/image.png`** (exact name)",
        "6. Refresh the game — done.",
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
            settings_text(job["seed"], f"public/gen/{name}/DROP/image.png"),
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
                    f"Legacy alt: public/art/{job['scene_id']}/{job['layer']}.png",
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

    write_art_scene_packs(jobs, manifest)

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
                "Legacy scene folders still work too:",
                "**[`public/art/`](../../../public/art/README.md)** e.g. `blaze-pit-lane/0.png`",
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
