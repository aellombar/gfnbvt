#!/usr/bin/env python3
"""Fill missing DROP images: generate when API allows, else derive from same-girl art."""

from __future__ import annotations

import json
import subprocess
import sys
import time
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageEnhance

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))

import generate_game_art as gen  # noqa: E402
from build_queue import SCENES  # noqa: E402

GIRL_OF_SCENE = {sid: girl for sid, girl, _, _ in SCENES}


def paths(scene_id: str, layer: int) -> tuple[Path, Path]:
    manifest = json.loads((ROOT / "public/gen/manifest.json").read_text())
    pack = manifest[scene_id][str(layer)]
    return (
        ROOT / "public/gen" / pack / "DROP" / "image.png",
        ROOT / "public/art" / scene_id / "DROP" / f"{layer}.png",
    )


def has_good(p: Path) -> bool:
    return p.is_file() and p.stat().st_size > 80_000


def save_both(data: bytes, gen_out: Path, art_out: Path) -> None:
    gen.to_png(data, gen_out)
    gen.to_png(data, art_out)


def derive_from(src: Path, layer: int) -> bytes:
    img = Image.open(src).convert("RGB")
    # subtle per-layer variation
    factors = [(1.0, 1.0), (1.05, 1.02), (1.1, 0.98), (0.95, 1.08)]
    bright, color = factors[min(layer, 3)]
    img = ImageEnhance.Brightness(img).enhance(bright)
    img = ImageEnhance.Color(img).enhance(color)
    if layer % 2 == 1:
        img = img.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    buf = BytesIO()
    img = img.resize((832, 1216), Image.Resampling.LANCZOS)
    img.save(buf, format="PNG", optimize=True)
    return buf.getvalue()


def find_source(girl: str) -> Path | None:
    for p in sorted(ROOT.glob("public/gen/*/DROP/image.png")):
        if p.stat().st_size < 80_000:
            continue
        # infer girl from folder name
        name = p.parent.parent.name
        if girl in name:
            return p
    return None


def generate_one(scene_id: str, layer: int) -> bool:
    girl = GIRL_OF_SCENE[scene_id]
    for sid, g, setting, peels in SCENES:
        if sid != scene_id:
            continue
        peel = peels[layer]
        seed = gen.GIRL_SEED[girl] + layer * 17 + hash(scene_id) % 1000
        prompt = gen.build_prompt(girl, setting, peel, layer)
        fallback = (
            f"anime girl adult woman {gen.GIRL_SOFT[girl]}, {gen.LAYER_REVEAL[layer]}, "
            f"looking at viewer, portrait, beautiful detailed"
        )
        for attempt, use in enumerate([prompt, prompt, fallback, fallback]):
            try:
                data = gen.fetch_image(use, seed + attempt)
                gen_out, art_out = paths(scene_id, layer)
                save_both(data, gen_out, art_out)
                return True
            except Exception:
                time.sleep(5 + attempt * 5)
    return False


def main() -> None:
    jobs: list[tuple[str, int]] = []
    for scene_id, _, _, peels in SCENES:
        for layer in range(len(peels)):
            gen_out, art_out = paths(scene_id, layer)
            if has_good(gen_out) and has_good(art_out):
                continue
            jobs.append((scene_id, layer))

    print(f"missing {len(jobs)} peels")
    gen_ok = derived = failed = 0

    for i, (scene_id, layer) in enumerate(jobs, 1):
        gen_out, art_out = paths(scene_id, layer)
        girl = GIRL_OF_SCENE[scene_id]
        print(f"[{i}/{len(jobs)}] {scene_id} L{layer}", flush=True)

        if has_good(gen_out) and not has_good(art_out):
            art_out.write_bytes(gen_out.read_bytes())
            print("  copy gen→art")
            continue

        if generate_one(scene_id, layer):
            gen_ok += 1
            print(f"  generated ({gen_out.stat().st_size // 1024}KB)")
            time.sleep(6)
            continue

        src = find_source(girl)
        if src:
            data = derive_from(src, layer)
            save_both(data, gen_out, art_out)
            derived += 1
            print(f"  derived from {src.parent.parent.name}")
            continue

        failed += 1
        print("  FAILED")

    total_gen = len(list(ROOT.glob("public/gen/*/DROP/image.png")))
    total_art = len(list(ROOT.glob("public/art/*/DROP/*.png")))
    print(f"\nDone: {gen_ok} generated, {derived} derived, {failed} failed")
    print(f"totals: gen={total_gen} art={total_art}")


if __name__ == "__main__":
    main()
