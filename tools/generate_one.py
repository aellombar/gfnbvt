#!/usr/bin/env python3
"""Generate one peel image. Used by batch_generate.sh."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))

import generate_game_art as gen  # noqa: E402
from build_queue import SCENES  # noqa: E402


def main() -> None:
    if len(sys.argv) != 3:
        print("usage: generate_one.py <scene_id> <layer>", file=sys.stderr)
        sys.exit(2)
    scene_id, layer_s = sys.argv[1], sys.argv[2]
    layer = int(layer_s)

    manifest = json.loads((ROOT / "public/gen/manifest.json").read_text())
    pack = manifest[scene_id][str(layer)]
    gen_out = ROOT / "public/gen" / pack / "DROP" / "image.png"
    art_out = ROOT / "public/art" / scene_id / "DROP" / f"{layer}.png"

    if gen.should_skip(gen_out) and gen.should_skip(art_out, min_bytes=300_000):
        print("skip")
        return
    if gen.should_skip(gen_out):
        gen.copy_if_needed(gen_out, art_out)
        print("copy-gen")
        return

    for sid, girl, setting, peels in SCENES:
        if sid == scene_id:
            peel = peels[layer]
            seed = gen.GIRL_SEED[girl] + layer * 17 + hash(scene_id) % 1000
            prompt = gen.build_prompt(girl, setting, peel, layer)
            fallback = (
                f"anime girl adult woman {gen.GIRL_SOFT[girl]}, {gen.LAYER_REVEAL[layer]}, "
                f"looking at viewer, portrait, beautiful detailed"
            )
            last_err = None
            for attempt in range(5):
                try:
                    data = gen.fetch_image(
                        prompt if attempt < 3 else fallback,
                        seed + attempt,
                    )
                    gen.to_png(data, gen_out)
                    gen.to_png(data, art_out)
                    print("ok", gen_out.stat().st_size)
                    return
                except Exception as e:
                    last_err = e
            print("fail", last_err, file=sys.stderr)
            sys.exit(1)
    print("scene not found", file=sys.stderr)
    sys.exit(1)


if __name__ == "__main__":
    main()
