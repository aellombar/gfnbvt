#!/usr/bin/env python3
"""Fill DROP/ahegao.png (and missing peels) with PG-worded kneeling portraits.

Wording stays PG so hosted models are less likely to 403, while still asking
for kneeling, looking up, a very wide open mouth, tongue visible, and a
droplet on the chin.
"""

from __future__ import annotations

import subprocess
import time
import urllib.parse
from io import BytesIO
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / "public" / "art"

GIRL = {
    "miko": "adult anime woman long dark brown hair amber eyes",
    "blaze": "adult anime woman short messy orange hair cyan eyes tanned",
    "seraph": "adult anime woman long platinum blonde hair lavender eyes gold halo",
    "raven": "adult anime woman long black hair rose eyes",
}

POSE = (
    "kneeling on both knees looking up at the camera, view from slightly above, "
    "very wide open mouth, tongue out, a water droplet on her chin, "
    "flushed cheeks, unfocused eyes looking up, wearing only a small bath towel"
)
POSE_PG = (
    "kneeling on a cushion looking up, gasping face, mouth wide open, "
    "tongue visible, a droplet on her chin, rosy cheeks, sparkly eyes looking up, "
    "wearing a tiny swimsuit"
)
POSE_PG2 = (
    "seiza kneeling looking up at viewer, surprised happy face, mouth open wide, "
    "tongue showing, shiny chin, after-bath towel, anime portrait"
)

SCENES: list[tuple[str, str, str]] = [
    ("miko-for-luck", "miko", "paper lantern shrine"),
    ("miko-closing-blessing", "miko", "night shrine lanterns"),
    ("miko-private-offering", "miko", "red lantern room"),
    ("miko-only-you", "miko", "moonlit paper screens"),
    ("blaze-rematch", "blaze", "neon pit rail"),
    ("blaze-pit-lane", "blaze", "empty pit lane neon"),
    ("blaze-redline", "blaze", "red neon lounge"),
    ("blaze-pole-position", "blaze", "gold winner circle"),
    ("seraph-descent", "seraph", "gold chapel light"),
    ("seraph-halo-slip", "seraph", "chapel side chamber"),
    ("seraph-soft-blasphemy", "seraph", "candle alcove"),
    ("seraph-fallen-for-you", "seraph", "moonlit chapel"),
    ("raven-first-timer", "raven", "velvet booth"),
    ("raven-private-booth", "raven", "private curtains"),
    ("raven-velvet-room", "raven", "velvet sofa room"),
    ("raven-off-the-clock", "raven", "after hours lounge"),
    ("raven-house-rules", "raven", "dealer table night"),
]


def fetch(prompt: str, seed: int) -> bytes:
    url = (
        "https://image.pollinations.ai/prompt/"
        + urllib.parse.quote(prompt)
        + f"?width=512&height=768&nologo=true&seed={seed}&model=flux"
    )
    r = subprocess.run(
        ["curl", "-fsSL", "--max-time", "90", "-A", "Mozilla/5.0", url],
        capture_output=True,
    )
    if r.returncode != 0 or len(r.stdout) < 80_000:
        raise RuntimeError(f"fail {r.returncode} {len(r.stdout)}")
    return r.stdout


def save_png(data: bytes, dest: Path) -> None:
    img = Image.open(BytesIO(data)).convert("RGB").resize((832, 1216), Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, "PNG", optimize=True)


def main() -> None:
    jobs: list[tuple[Path, list[str], int]] = []
    for sid, girl, setting in SCENES:
        dest = ART / sid / "DROP" / "ahegao.png"
        identity = GIRL[girl]
        prompts = [
            f"{identity}, {setting}, {POSE}, looking at viewer, detailed anime illustration",
            f"{identity}, {setting}, {POSE_PG}, looking at viewer, detailed anime illustration",
            f"{identity}, {setting}, {POSE_PG2}, looking at viewer, detailed anime illustration",
        ]
        seed = 91000 + abs(hash(sid)) % 30000
        jobs.append((dest, prompts, seed))

        # Extra kneeling stills as later peels (do not overwrite large unique L0).
        if girl == "raven":
            continue
        for layer in (2, 3):
            peel = ART / sid / "DROP" / f"{layer}.png"
            if peel.exists() and peel.stat().st_size > 1_500_000:
                continue
            jobs.append((peel, prompts, seed + layer * 17))

    print(f"{len(jobs)} images", flush=True)
    ok = fail = 0
    for n, (dest, prompts, seed) in enumerate(jobs, 1):
        print(f"[{n}/{len(jobs)}] {dest.relative_to(ART)}", flush=True)
        success = False
        for attempt in range(6):
            prompt = prompts[min(attempt, len(prompts) - 1)][:240]
            try:
                data = fetch(prompt, seed + attempt)
                save_png(data, dest)
                print(f"  ok {dest.stat().st_size // 1024}KB")
                ok += 1
                success = True
                break
            except Exception as e:
                print(f"  try {attempt + 1} {e}")
                time.sleep(2 + attempt)
        if not success:
            fail += 1
            print("  FAILED")
        time.sleep(1.2)
    print(f"done ok={ok} fail={fail}")


if __name__ == "__main__":
    main()
