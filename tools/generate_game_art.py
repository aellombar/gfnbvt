#!/usr/bin/env python3
"""
Generate placeholder scene art via Pollinations (cloud-friendly).
Fills public/art/<scene>/DROP/N.png and public/gen/<pack>/DROP/image.png.

Skips existing high-quality PNGs (user A1111 drops > 300KB).
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
import time
import urllib.parse
import urllib.request
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageEnhance

ROOT = Path(__file__).resolve().parents[1]
GEN = ROOT / "public" / "gen"
ART = ROOT / "public" / "art"

sys.path.insert(0, str(ROOT / "tools" / "a1111"))
from build_queue import SCENES, CHARS  # noqa: E402

GIRL_SEED = {"raven": 2847193551, "miko": 1928374655, "blaze": 3141592653, "seraph": 2718281828}

GIRL_SOFT = {
    "raven": "black hair red eyes pale skin dealer",
    "miko": "brown hair amber eyes shrine maiden",
    "blaze": "orange hair cyan eyes athletic racer",
    "seraph": "blonde hair lavender eyes angel halo",
}

LAYER_REVEAL = ["clothed", "undressing", "lingerie", "sexy lingerie"]

REPLACEMENTS = [
    (r"\b(pussy|cock|cum|ahegao|fingering|spreading|nude|naked|oral|blowjob|penis|vagina|clit|thrust|mating press|reverse cowgirl|cowgirl|POV|stroking|JOI|masturbat\w*)\b", ""),
    (r"\b(dripping|wet stain|cum on|sacrament|blasphem\w*|offering bowl)\b", "glistening"),
    (r"\s+", " "),
]


def sanitize(text: str) -> str:
    t = text
    for pat, rep in REPLACEMENTS:
        t = re.sub(pat, rep, t, flags=re.I)
    return t.strip(" ,")


def build_prompt(girl: str, setting: str, peel: str, layer: int) -> str:
    reveal = LAYER_REVEAL[min(layer, len(LAYER_REVEAL) - 1)]
    peel_soft = " ".join(sanitize(peel).split()[:10])
    setting_soft = " ".join(setting.split()[:8])
    return (
        f"anime girl adult woman {GIRL_SOFT[girl]}, {setting_soft}, "
        f"{peel_soft}, {reveal}, looking at viewer, portrait, detailed"
    )[:280]


def fetch_image(prompt: str, seed: int) -> bytes:
    last_err: Exception | None = None
    for model in ("flux", "turbo"):
        url = (
            "https://image.pollinations.ai/prompt/"
            + urllib.parse.quote(prompt)
            + f"?width=512&height=768&nologo=true&seed={seed}&model={model}"
        )
        try:
            proc = subprocess.run(
                ["curl", "-fsSL", "--max-time", "120", "-A", "Mozilla/5.0", url],
                capture_output=True,
                check=False,
            )
            if proc.returncode == 0 and len(proc.stdout) >= 12_000:
                return proc.stdout
            last_err = RuntimeError(
                f"{model}: curl exit {proc.returncode}, {len(proc.stdout)} bytes"
            )
        except Exception as e:
            last_err = e
    raise RuntimeError(str(last_err or "all models failed"))


def to_png(data: bytes, out: Path) -> None:
    img = Image.open(BytesIO(data)).convert("RGB")
    img = img.resize((832, 1216), Image.Resampling.LANCZOS)
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, format="PNG", optimize=True)


def should_skip(path: Path, min_bytes: int = 300_000) -> bool:
    return path.is_file() and path.stat().st_size >= min_bytes


def copy_if_needed(src: Path, dst: Path) -> bool:
    if not src.is_file():
        return False
    if dst.is_file() and dst.stat().st_size >= src.stat().st_size * 0.9:
        return True
    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_bytes(src.read_bytes())
    return True


def main() -> None:
    manifest: dict[str, dict[str, str]] = json.loads(
        (GEN / "manifest.json").read_text(encoding="utf-8")
    )
    jobs: list[tuple[str, int, str, str, str, Path, Path]] = []
    for scene_id, girl, setting, peels in SCENES:
        for layer, peel in enumerate(peels):
            pack = manifest[scene_id][str(layer)]
            gen_out = GEN / pack / "DROP" / "image.png"
            art_out = ART / scene_id / "DROP" / f"{layer}.png"
            jobs.append((scene_id, layer, girl, setting, peel, gen_out, art_out))

    print(f"Total peels: {len(jobs)}")
    done = skipped = failed = 0

    for i, (scene_id, layer, girl, setting, peel, gen_out, art_out) in enumerate(jobs, 1):
        if should_skip(gen_out) and should_skip(art_out, min_bytes=300_000):
            skipped += 1
            print(f"[{i}/{len(jobs)}] skip {scene_id} L{layer} (existing)")
            continue

        if should_skip(gen_out):
            copy_if_needed(gen_out, art_out)
            skipped += 1
            print(f"[{i}/{len(jobs)}] copy {scene_id} L{layer} gen→art")
            continue

        if should_skip(art_out, min_bytes=300_000):
            copy_if_needed(art_out, gen_out)
            skipped += 1
            print(f"[{i}/{len(jobs)}] copy {scene_id} L{layer} art→gen")
            continue

        seed = GIRL_SEED[girl] + layer * 17 + hash(scene_id) % 1000
        prompt = build_prompt(girl, setting, peel, layer)
        fallback = (
            f"anime girl adult woman {GIRL_SOFT[girl]}, {LAYER_REVEAL[layer]}, "
            f"looking at viewer, portrait, beautiful detailed"
        )
        label = f"{scene_id}__{layer}"
        print(f"[{i}/{len(jobs)}] gen {label}…", flush=True)

        for attempt in range(4):
            try:
                use_prompt = prompt if attempt < 2 else fallback
                data = fetch_image(use_prompt, seed + attempt)
                to_png(data, gen_out)
                to_png(data, art_out)
                done += 1
                print(f"  ok → {gen_out.relative_to(ROOT)} ({gen_out.stat().st_size // 1024}KB)")
                break
            except Exception as e:
                print(f"  attempt {attempt + 1} failed: {e}")
                time.sleep(3 + attempt * 3)
        else:
            failed += 1
            print(f"  FAILED {label}")

        time.sleep(3)

    print(f"\nDone: {done} generated, {skipped} skipped, {failed} failed")


if __name__ == "__main__":
    main()
