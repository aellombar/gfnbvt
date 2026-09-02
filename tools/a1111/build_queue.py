#!/usr/bin/env python3
"""
Build / queue every Baddie Casino scene PNG for Automatic1111.

WHAT THIS SOLVES
----------------
1) Queue: dumps a prompts-from-file list A1111 can run overnight.
2) Same girl: uses one locked seed + identical character tags per girl,
   and optionally hits the A1111 API with those fixed seeds.

IT DOES NOT MAGICALLY KNOW THE FACE
-----------------------------------
Stable Diffusion does not "remember" Raven between scenes by name alone.
Consistency comes from YOU locking:
  - the same character tag block every time
  - the same seed per girl (peels of one scene)
  - and ideally a face reference (IP-Adapter / FaceID) or a character LoRA

See docs/CHARACTER_CONSISTENCY.md

USAGE
-----
  # Just write the queue file (no WebUI needed):
  python3 tools/a1111/build_queue.py

  # After you pick good face seeds, put them in SEEDS below and rebuild.

  # Optional: push the whole queue to a running A1111 / Forge API:
  python3 tools/a1111/build_queue.py --api http://127.0.0.1:7860
"""

from __future__ import annotations

import argparse
import json
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = Path(__file__).resolve().parent
QUEUE_TXT = OUT_DIR / "queue_prompts_from_file.txt"
QUEUE_JSON = OUT_DIR / "queue_jobs.json"
MANIFEST = OUT_DIR / "rename_map.txt"

# ── Fill these AFTER you generate a good face for each girl ──────────────
# Generate one portrait you love, copy the seed from A1111 info, paste here.
SEEDS = {
    "raven": -1,   # e.g. 2847193551
    "miko": -1,
    "blaze": -1,
    "seraph": -1,
}

STYLE = """score_9, score_8_up, score_7_up, source_anime, rating_explicit,
1girl, solo, adult woman, 20s, looking at viewer, eye contact, seductive smile,
3d, blender, cycles, raytracing, subsurface scattering, soft specular,
anime 3d render, smooth skin, detailed face, beautiful detailed eyes,
intimate portrait, vertical composition, centered, from thighs up,
soft volumetric lighting, shallow depth of field, erotic atmosphere,
highly detailed, clean background"""

NEGATIVE = """score_6, score_5, score_4, text, watermark, logo, signature, username,
speech bubble, ui, border, frame, comic, monochrome, sketch, lineart,
flat color, cel shading, 2d, painting, western cartoon,
realistic photo, raw photo, pore skin, freckles overload, ugly, deformed,
bad anatomy, bad hands, extra fingers, fused fingers, extra limbs,
child, loli, underage, young, teen, flat chest, lowres, blurry"""

CHARS = {
    "raven": """raven, long straight black hair, blunt bangs, deep red eyes, pale skin,
slim waist, medium breasts, calm confident expression, soft half-lidded eyes,
smoky beauty mark under left eye""",
    "miko": """miko, long dark brown almost-black hair with soft side bangs, warm amber-brown eyes,
fair warm skin, gentle smile, soft blush, medium breasts, devoted expression,
shrine maiden beauty""",
    "blaze": """blaze, short messy bright orange-red hair, cyan-teal eyes, tanned warm skin,
athletic toned body, medium-large breasts, sharp playful grin, hyped expression,
racing girlfriend energy""",
    "seraph": """seraph, long wavy pale platinum-blonde hair, soft lavender-blue eyes, porcelain skin,
serene expression, large soft breasts, gentle smile, fallen angel beauty,
faint cracked golden halo behind head""",
}

# scene_id, girl, setting, peels[0..n]
SCENES: list[tuple[str, str, str, list[str]]] = [
    (
        "raven-first-timer",
        "raven",
        "dark velvet casino booth, magenta rim light, violet ambient, low table cards soft bokeh",
        [
            "black lace dealer outfit, sleeveless lace bodice, short black skirt, choker, standing behind booth, composed",
            "unbuttoned lace bodice, black lace bra, skirt hiked, choker, same pose, more flushed",
            "black lace lingerie only, sheer bra, panties, choker, same pose, heavy blush, inviting",
        ],
    ),
    (
        "raven-private-booth",
        "raven",
        "dark velvet casino booth after close, magenta rim light, private booth bench",
        [
            "black lace lounge wear, sheer robe half open over lingerie, sitting on booth bench",
            "robe slipped off one shoulder, black lace bra and panties, same pose",
            "bra unhooked hanging, panties, robe pooled, same pose, nipples soft light",
            "nude except choker and thigh highs, same pose, soft afterglow lighting",
        ],
    ),
    (
        "raven-velvet-room",
        "raven",
        "private velvet room, deep red curtains, no cameras, intimate lamp light",
        [
            "velvet private dress, deep wine slip dress, thin straps, elegant",
            "slip dress straps down, lace bra showing, same pose",
            "dress around waist, lingerie only",
            "nude, dress discarded beside her, soft lustful calm",
        ],
    ),
    (
        "raven-off-the-clock",
        "raven",
        "dim apartment bedroom, warm lamp, rumpled sheets soft bokeh",
        [
            "silk apartment slip, champagne silk nightgown, barefoot",
            "nightgown half off, bare breasts, silk pooled at hips",
            "nude from waist up, silk around thighs",
            "fully nude on bed edge, sheets, soft aftercare lighting",
        ],
    ),
    (
        "raven-house-rules",
        "raven",
        "velvet private suite, house lights off, only signal-pink rim light",
        [
            "private black lingerie set, garter, stockings, commanding calm",
            "bra removed, garter and stockings",
            "panties pulled aside, stockings",
            "nude in stockings only, proud soft smile",
        ],
    ),
    (
        "miko-for-luck",
        "miko",
        "quiet shrine alcove on casino slot floor, paper lanterns, warm gold light, incense haze",
        [
            "white shrine maiden outfit, red accents, wide sleeves, polite kneeling pose",
            "hakama loosened, white top open, red ribbon bra, same pose, embarrassed smile",
            "shrine lingerie, white-and-red lace, sleeves off, eager blush",
        ],
    ),
    (
        "miko-closing-blessing",
        "miko",
        "closed shrine floor, lights down, ceremonial lantern glow",
        [
            "good kimono, ornate cream-and-crimson kimono, formal obi",
            "obi undone, kimono open on chest",
            "kimono slipped to waist, bare breasts",
            "nude wrapped in open kimono only, worshipful expression",
        ],
    ),
    (
        "miko-private-offering",
        "miko",
        "behind shrine curtain, private offering room, red lanterns",
        [
            "lantern red ceremonial robe, sheer red fabric",
            "robe open, red lace lingerie",
            "lingerie half off",
            "nude kneeling offering pose, hands on thighs, devoted eyes",
        ],
    ),
    (
        "miko-only-you",
        "miko",
        "empty shrine at night, moonlight through paper screens",
        [
            "devotion white silk kimono, pure white, red cord",
            "white kimono open, bare skin",
            "nude under open white silk",
            "fully nude, white silk under her, soft tears of joy optional",
        ],
    ),
    (
        "blaze-rematch",
        "blaze",
        "neon pit rail, cyan and orange neon signs, night asphalt bokeh, energetic lighting",
        [
            "race crew jacket, crop top, short shorts, gloves hanging, leaning on rail",
            "jacket open, sports bra, shorts unbuttoned",
            "sports bra and tiny shorts only, sweaty sheen, triumphant grin",
        ],
    ),
    (
        "blaze-pit-lane",
        "blaze",
        "empty pit lane, neon overhead",
        [
            "pit zip jacket, tight race pants",
            "jacket off, tank top, pants low",
            "sports lingerie",
            "nude with racing gloves only, hyped blush",
        ],
    ),
    (
        "blaze-redline",
        "blaze",
        "locked redline lounge, neon red wash, door locked mood",
        [
            "redline mesh top, micro skirt, fishnets",
            "mesh pulled up, bare breasts",
            "skirt off, thong",
            "nude, fishnets only, full throttle expression",
        ],
    ),
    (
        "blaze-pole-position",
        "blaze",
        "winner circle lights, gold spark accents, soft afterglow neon",
        [
            "winner circle sash over race lingerie",
            "sash only, lingerie half off",
            "nude with sash",
            "fully nude, soft proud smile after the win",
        ],
    ),
    (
        "seraph-descent",
        "seraph",
        "empty roulette chapel, pale stone, cool blue-gold godrays, sacred quiet",
        [
            "pale silk ceremonial robe, gold trim, modest but clinging",
            "robe open at chest, silk bra",
            "pale silk lingerie, halo dimmer, calm lust",
        ],
    ),
    (
        "seraph-halo-slip",
        "seraph",
        "chapel side chamber, halo light flickering",
        [
            "loose halo silk dress, slipping straps",
            "dress fallen to waist",
            "lingerie, broken halo shards floating",
            "nude, faint halo remnant, serene devotion",
        ],
    ),
    (
        "seraph-soft-blasphemy",
        "seraph",
        "desecrated chapel alcove, gold cloth on floor, warm blasphemous light",
        [
            "unwinged silk wrap, almost nothing underneath",
            "wrap open, bare breasts",
            "nude under open wrap",
            "fully nude kneeling, offering pose, sacred calm",
        ],
    ),
    (
        "seraph-fallen-for-you",
        "seraph",
        "night chapel, no halo left, moonlight and gold candles",
        [
            "chosen fall gown, sheer ivory",
            "gown open",
            "nude with open gown",
            "fully nude, no halo, soft loving smile, fallen on purpose",
        ],
    ),
]


def clean(s: str) -> str:
    return " ".join(s.replace("\n", " ").split())


def build_jobs() -> list[dict]:
    jobs: list[dict] = []
    for scene_id, girl, setting, peels in SCENES:
        seed = SEEDS[girl]
        for layer, peel in enumerate(peels):
            prompt = clean(
                f"{STYLE}, {CHARS[girl]}, {setting}, {peel}, "
                f"same character identity, consistent face, character sheet lock"
            )
            filename = f"{scene_id}__{layer}.png"
            jobs.append(
                {
                    "scene_id": scene_id,
                    "girl": girl,
                    "layer": layer,
                    "seed": seed,
                    "prompt": prompt,
                    "negative": clean(NEGATIVE),
                    "save_as": filename,
                    "drop_to": f"public/art/{scene_id}/{layer}.png",
                }
            )
    return jobs


def write_files(jobs: list[dict]) -> None:
    # A1111 Script: "Prompts from file or textbox"
    # One job per line. Extra --flags are supported by that script.
    lines: list[str] = []
    rename: list[str] = []
    for job in jobs:
        seed = job["seed"]
        seed_flag = f" --seed {seed}" if seed >= 0 else ""
        # Keep prompt on one line; escape nothing special needed for the script.
        lines.append(
            f'{job["prompt"]} --negative_prompt "{job["negative"]}"'
            f"{seed_flag} --steps 30 --cfg_scale 6.5 --width 832 --height 1216 "
            f"--clip_skip 2  # => {job['save_as']}  DROP: {job['drop_to']}"
        )
        rename.append(f"{job['save_as']}  ->  {job['drop_to']}")

    QUEUE_TXT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    QUEUE_JSON.write_text(json.dumps(jobs, indent=2), encoding="utf-8")
    MANIFEST.write_text(
        "After A1111 finishes, rename/move outputs like this:\n\n"
        + "\n".join(rename)
        + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(jobs)} jobs → {QUEUE_TXT}")
    print(f"Wrote JSON     → {QUEUE_JSON}")
    print(f"Wrote rename map → {MANIFEST}")
    missing = [g for g, s in SEEDS.items() if s < 0]
    if missing:
        print(
            "\nWARNING: seeds still -1 for:",
            ", ".join(missing),
            "\nGenerate a good face for each girl, paste seeds into SEEDS in this script, rebuild.",
            "\nWithout locked seeds (or a LoRA / IP-Adapter face), faces WILL drift between scenes.",
        )


def queue_api(jobs: list[dict], base: str) -> None:
    url = base.rstrip("/") + "/sdapi/v1/txt2img"
    for i, job in enumerate(jobs, 1):
        payload = {
            "prompt": job["prompt"],
            "negative_prompt": job["negative"],
            "seed": job["seed"],
            "steps": 30,
            "cfg_scale": 6.5,
            "width": 832,
            "height": 1216,
            "sampler_name": "DPM++ 2M Karras",
            "batch_size": 1,
            "n_iter": 1,
        }
        # Override clip skip via override_settings when supported.
        payload["override_settings"] = {"CLIP_stop_at_last_layers": 2}
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            url, data=data, headers={"Content-Type": "application/json"}
        )
        print(f"[{i}/{len(jobs)}] {job['drop_to']} (seed={job['seed']})…")
        with urllib.request.urlopen(req, timeout=600) as resp:
            result = json.loads(resp.read().decode("utf-8"))
        # Save first image from response.
        import base64

        images = result.get("images") or []
        if not images:
            print("  ! no image returned")
            continue
        out = ROOT / job["drop_to"]
        out.parent.mkdir(parents=True, exist_ok=True)
        raw = images[0]
        if "," in raw:
            raw = raw.split(",", 1)[1]
        out.write_bytes(base64.b64decode(raw))
        print(f"  saved {out}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--api",
        help="A1111/Forge base URL, e.g. http://127.0.0.1:7860 (queues + saves PNGs)",
    )
    args = parser.parse_args()
    jobs = build_jobs()
    write_files(jobs)
    if args.api:
        if any(j["seed"] < 0 for j in jobs):
            raise SystemExit(
                "Refusing API queue with seed=-1. Lock SEEDS in this file first."
            )
        queue_api(jobs, args.api)


if __name__ == "__main__":
    main()
