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

# Flat Mosbles/Fappy cel look, but thicker outlines + a bit more face/outfit detail.
# Keep composition tags stable across peels (no global pose tags — poses live in peels).
STYLE = """score_9, score_8_up, score_7_up, source_anime, rating_explicit,
1girl, solo, adult woman, 20s, looking at viewer, eye contact,
2d, anime, flat color, flat colors, cel shading, hard cel shadow,
(thick lineart:1.3), (bold outlines:1.2), heavy black outlines, crisp clean lineart,
outlined, comic linework, indie hentai illustration, comic style,
detailed face, detailed eyes, detailed hair, slightly detailed clothing,
expressive face, large expressive eyes, clear facial features,
same character, consistent face, consistent anatomy, stable identity,
lewd, erotic, NSFW, aroused, flushed, bedroom eyes,
vertical composition, centered, simple background, erotic atmosphere"""

NEGATIVE = """score_6, score_5, score_4, text, watermark, logo, signature, username,
speech bubble, ui, border, frame, monochrome, sketch, rough, unfinished,
thin lineart, thin outlines, sketchy lines, broken lineart, faded lines, soft outlines,
3d, blender, cycles, raytracing, unreal engine, octane, cgi, plastic skin,
soft shading, soft gradients, painterly, oil painting, watercolor, photorealistic,
realistic photo, raw photo, subsurface scattering, ambient occlusion,
busy background, cluttered, overdetailed background, glossy skin, shiny plastic,
inconsistent face, different person, face morph, style drift, mutated face,
ugly, deformed, bad anatomy, bad hands, extra fingers, fused fingers, extra limbs,
child, loli, underage, young, teen, flat chest, lowres, blurry"""

CHARS = {
    "raven": """raven, long straight black hair, blunt bangs, deep red eyes, pale skin,
slim waist, medium breasts, calm confident expression, soft half-lidded eyes,
smoky beauty mark under left eye, sharp jaw, same raven face every image""",
    "miko": """miko, long dark brown almost-black hair with soft side bangs, warm amber-brown eyes,
fair warm skin, gentle smile, soft blush, medium breasts, devoted expression,
shrine maiden beauty, small mole near collarbone, same miko face every image""",
    "blaze": """blaze, short messy bright orange-red hair, cyan-teal eyes, tanned warm skin,
athletic toned body, medium-large breasts, sharp playful grin, hyped expression,
racing girlfriend energy, freckles across nose, same blaze face every image""",
    "seraph": """seraph, long wavy pale platinum-blonde hair, soft lavender-blue eyes, porcelain skin,
serene expression, large soft breasts, gentle smile, fallen angel beauty,
faint cracked golden halo behind head, soft gold iris flecks, same seraph face every image""",
}

# scene_id, girl, setting, peels[0..n]
# Poses track chapter + JOI dialogue beat-for-beat:
#   0 = clothed coach ("hands on yourself / eyes on me")
#   1 = peel while she watches you stroke
#   2 = wet / spreading / matching your pace with her body
#   3 = finish-freaky climax pose + praise afterglow
# Praise-freaky only — never mean. Hands-free JOI fantasy (she watches / coaches / rides the fantasy).
SCENES: list[tuple[str, str, str, list[str]]] = [
    (
        "raven-first-timer",
        "raven",
        "dark velvet casino booth after last call, magenta rim light, cards forgotten on table",
        [
            # r1: Hands on your lap. Eyes on me. Last customer.
            "black lace dealer outfit, short skirt, choker, leaning over booth toward viewer, finger to lips then pointing at viewer's lap, hungry half-lidded eyes, JOI command pose",
            # lace opens while you find the rhythm; she squeezes thighs
            "unbuttoned lace bodice, black lace bra, skirt hiked over hips, thighs pressed tightly together, hand sliding between her own thighs matching your stroke, flushed wet stain implication",
            # finish: don't stop — she begs you to cum while touching herself
            "black lace lingerie only, sitting on booth edge facing viewer, legs spread wide, spreading pussy with fingers, dripping, open mouth begging you to cum, heavy blush",
        ],
    ),
    (
        "raven-private-booth",
        "raven",
        "private booth after close, velvet rope shut, magenta glow, no dealers left",
        [
            # r2: Take it out. Slow. I want to watch you get hard.
            "sheer black robe half open over lace lingerie, reclining on booth bench, looking down at viewer's cock, licking lips, slow JOI tease",
            # toes curling, stroking-air — matching your fist
            "robe off one shoulder, black bra, panties, knees up soles toward viewer, toes curling, hand miming a stroke toward camera, bedroom eyes",
            # post dialogue: had to squeeze thighs / still wet — peel shows it
            "bra off, panties pulled aside, two fingers spreading pussy, shiny wet, breathy open mouth, watching you pump",
            # sprint/finish freak: on all fours watching you cum for her
            "nude except choker and thigh highs, on all fours on bench facing viewer, arched back, ass up, tongue out slightly, ahegao pleasure face, sweaty afterglow",
        ],
    ),
    (
        "raven-velvet-room",
        "raven",
        "off-floor velvet room, deep red curtains, intimate lamp, no cameras",
        [
            # r3: sits BESIDE you, twenty minutes, hand over yours
            "wine silk slip dress, thin straps, sitting beside viewer not across, hand on viewer's thigh near cock, whispering close, lustful calm",
            # greedy — grinding above your lap while you stroke
            "dress straps down, breasts half out, straddling above viewer's lap, grinding pose, wet eyes, guiding your stroke pace with her hips",
            # every throb she feels between her legs
            "dress bunched at waist, no lingerie, cowgirl facing viewer, one hand on breast, other hand on her clit, riding while coaching your fist",
            # came so hard — messy lap aftercare before her shift
            "fully nude, dress discarded, sitting in viewer's lap, forehead to forehead, messy hair, cum on stomach implication, soft proud smile",
        ],
    ),
    (
        "raven-off-the-clock",
        "raven",
        "her apartment bedroom, warm lamp, rumpled sheets, private and slow",
        [
            # r4: off the clock, missed your hands, not hiding how wet
            "champagne silk nightgown, barefoot on bed edge, legs parted inviting, looking at viewer like she waited all day to watch you stroke",
            # sinks on couch/bed, skirt up — presenting + touching herself
            "nightgown half off, bare breasts presented, kneeling on bed, hand deep between legs, moaning open mouth, desperate for your eyes",
            # stroke slow, hear you breathe — she's dripping open for you
            "nude from waist up, silk around thighs, lying back propped on elbows, legs spread toward viewer, pussy dripping, filthy praise expression",
            # post: she got off watching — aftercare with cum glow
            "fully nude on rumpled sheets, aftercare cuddle pulling viewer in, soft proud smile, cum on her stomach, sweaty satisfied glow",
        ],
    ),
    (
        "raven-house-rules",
        "raven",
        "velvet private suite, house lights off, pink signal rim light, her rules now",
        [
            # r5: Rule two — stroke when I say. Standing over you.
            "black lingerie, garter belt, stockings, standing over viewer looking down, finger pointing at viewer's cock, soft commanding praise smile",
            # prove it — on her knees, mouth open for praise-JOI
            "bra gone, stockings on, kneeling between viewer's legs POV from above, looking up, mouth open tongue ready, praise not mean",
            # wet and urgent — riding while pinning, house rules are hers
            "panties pulled aside, cowgirl riding facing viewer, hands pinning his wrists, dripping wet, urgent house-rules lust face",
            # I'm keeping you — lap claim aftercare, stockings still on
            "nude in stockings only, straddling viewer's lap aftercare pose, thighs framing him, forehead kiss, proud good-boy smirk, cum glow",
        ],
    ),
    (
        "miko-for-luck",
        "miko",
        "quiet shrine alcove on the slot floor, paper lanterns, warm gold, chips abandoned",
        [
            # m1: Hands on yourself. Let me watch you take it.
            "white shrine maiden outfit, kneeling polite, sleeves raised, palms showing then gesturing to viewer's lap, shy bold smile, luck-blessing JOI",
            # flushes at her own boldness — thighs pressed, watching strokes
            "hakama open, white top undone, red ribbon bra, kneeling, thighs pressed together hard, watching your fist, embarrassed eager blush",
            # good boy luck finish — prayer-mat present, cum for luck
            "shrine lingerie only, on all fours on prayer mat, ass up toward viewer, looking back over shoulder, dripping, 'cum for luck' needy face",
        ],
    ),
    (
        "miko-closing-blessing",
        "miko",
        "closed shrine floor, lights down, ceremonial lanterns, good kimono night",
        [
            # m2: good kimono, hands off everything but yourself
            "ornate cream-crimson kimono, formal obi, kneeling close enough breath hits viewer's lap, devoted hungry eyes",
            # everything I've got — kimono open, hovering near cock worship
            "obi undone, kimono open on chest, bare cleavage, hands hovering near viewer's cock without touching, worshipful flush",
            # watching every stroke — touching herself in seiza
            "kimono at waist, bare breasts, seiza with thighs open, fingering herself while staring at your strokes, soft moan face",
            # you deserve to cum — offering body under open kimono
            "nude wrapped in open kimono like offering cloth, on her back legs spread wrapped around waist pose, tears of joy, 'you deserve this' expression",
        ],
    ),
    (
        "miko-private-offering",
        "miko",
        "behind shrine curtain, private offering room, red lanterns, sacred and filthy",
        [
            # m3: sacred devotion — cock in hand, eyes on me
            "sheer red ceremonial robe, kneeling offering pose, palms up under viewer's cock height, looking at viewer like you are the blessing",
            # crawling closer — hungry devotion
            "robe open, red lace lingerie, crawling between viewer's knees, ass up, hungry devoted eyes, tongue slightly out",
            # stroke into her mouth coaching — POV oral tease
            "lingerie half off, POV between her knees, mouth open near cock, tongue out, not sucking yet, coaching you to stroke into her mouth",
            # post: forehead on thigh — cum-on-face ready worship
            "fully nude kneeling, forehead on viewer's thigh, both hands wrapping his cock with him, tongue out, cum-on-face ready worship expression",
        ],
    ),
    (
        "miko-only-you",
        "miko",
        "empty shrine at night, moonlight through paper screens, only you",
        [
            # m4: only you — lap claim
            "white devotion silk kimono, sitting in viewer's lap facing him, forehead together, soft claim my-only-offering smile",
            # grinding wet — desperate devoted
            "kimono open, bare skin pressed to viewer, slow grinding, wet thighs shiny, desperate devoted blush",
            # riding slow cowgirl while praising
            "nude under open white silk, slow cowgirl riding, hands on his chest, whispering praise, sacred slut blush",
            # owned-and-happy aftercare on shrine floor
            "fully nude, clinging aftercare embrace on shrine floor, silk under her, soft happy tears, owned-and-devoted smile",
        ],
    ),
    (
        "blaze-rematch",
        "blaze",
        "neon pit rail night, cyan orange signs, asphalt bokeh, rematch energy",
        [
            # b1: Hands off the table. Stroke when I say.
            "race crew jacket, crop top, short shorts, leaning on rail over viewer, pointing at his cock, grin like she already won watching you stroke",
            # pick up the pace — flashing, foot on rail
            "jacket open, sports bra, shorts unbuttoned tugged down, one foot up on rail, flashing pussy, hyped pick-up-the-pace face",
            # full throttle finish — straddling rail pumping air to your rhythm
            "tiny shorts and bra only, sweaty sheen, straddling rail facing viewer, hand pumping air in stroke rhythm, shouting encouragement ahegao-edge face",
        ],
    ),
    (
        "blaze-pit-lane",
        "blaze",
        "empty pit lane, neon overhead, no chips just her calling RPM",
        [
            # b2: I call the RPM. Eyes on me.
            "pit zip jacket half open, tight race pants, bouncing on heels, pointing at viewer's cock, I-call-the-RPM grin",
            # bent over tire looking back — stroke faster
            "jacket off, tank top sweat-soaked, pants shoved under ass, bent over racing tire, looking back, stroke-faster hand gesture, wet shine",
            # toolbox spread — fingering while staring at your strokes
            "sports lingerie, sitting on toolbox legs spread wide, fingering pussy, staring at your fist, loud moan face",
            # every drop — gloves on cock POV finish-line
            "nude with racing gloves only, on knees POV, gloved hands wrapping his cock with him, tongue out, finish-line ahegao",
        ],
    ),
    (
        "blaze-redline",
        "blaze",
        "locked redline lounge, neon red wash, door locked, full throttle",
        [
            # b3: door locked, full throttle — pinning you
            "red mesh top, micro skirt, fishnets, pinning viewer to couch, competitive lust grin, redline eyes",
            # breasts in face, grinding over clothes
            "mesh yanked up, bare breasts pressed to his face, grinding on lap over clothes, dripping through thong, redline eyes",
            # reverse cowgirl don't you dare slow down
            "skirt gone, thong aside, reverse cowgirl looking back over shoulder, bouncing hard, don't-you-dare-slow-down face",
            # both finish — sweaty winner glow on his chest
            "nude in fishnets, collapsed on his chest after both finish, sweaty proud laugh, cum glow, winner aftercare",
        ],
    ),
    (
        "blaze-pole-position",
        "blaze",
        "winner circle lights, gold sparks, soft neon afterglow, rivals to lovers",
        [
            # b4: no bet — dropping to knees for you
            "winner sash over race lingerie, starting trophy pose then dropping to knees for viewer, hungry grin",
            # sash only — presenting open on podium
            "winner sash only, lingerie off, presenting on podium floor, legs spread, fingers spreading pussy, make-me-cum-like-you-mean-it face",
            # mating press love+lust
            "nude with sash across breasts, mating press under viewer, legs up, looking up in love and lust, moaning",
            # soft for once — still holding your cock, pole position smile
            "fully nude aftercare, forehead kiss, soft for once, gently holding his cock, pole position proud smile",
        ],
    ),
    (
        "seraph-descent",
        "seraph",
        "empty roulette chapel, pale stone, cool blue-gold godrays, first fall",
        [
            # s1: Sit. Breathe with me. How obedient can you be.
            "pale silk ceremonial robe, sitting at empty roulette table watching viewer, halo steady, calm stroke-invitation pose",
            # between knees guiding breath — soft lust
            "robe open at chest, silk bra, standing between viewer's knees, hand on his chest guiding breathing, soft sacred lust",
            # prayer pose facing cock — cum as blessing
            "pale silk lingerie, halo dimming, kneeling prayer pose facing viewer's cock, half-lidded devotion, mouth parted ready for cum blessing",
        ],
    ),
    (
        "seraph-halo-slip",
        "seraph",
        "chapel side chamber, halo tilted and flickering from thinking of you",
        [
            # s2: Hands on yourself only when I say. Halo tilted.
            "loose halo silk dress slipping, sitting close, dress ridden up thighs, whispering stroke instructions, halo tilted",
            # straddling grind, serene dirty talk
            "dress at waist, bare breasts, halo cracked light, straddling lap grinding on clothed cock, serene filthy praise face",
            # clit in time with your strokes
            "lingerie, broken halo shards floating, on her back legs spread, fingering clit in time with your strokes, mouth open",
            # missionary forehead press — stroke for me
            "nude, faint halo remnant, missionary under viewer, forehead pressed to his, stroke-for-me whispered mid-thrust face",
        ],
    ),
    (
        "seraph-soft-blasphemy",
        "seraph",
        "desecrated chapel alcove, gold cloth on floor, she told them she was praying",
        [
            # s3: thinking about your hands — offering bowl for your cock
            "unwinged silk wrap barely closed, kneeling, half halo gone, hands clasped then opening under cock as offering bowl",
            # forehead to knee — want your cum as holy offering
            "wrap open, bare breasts, pressing forehead to viewer's knee, halo guttering, begging for cum as holy offering",
            # spreading on gold cloth — blasphemous calm
            "nude under open wrap, lying on gold cloth, legs open, fingers spreading pussy wide, blasphemous calm smile",
            # sacrament on tongue POV
            "fully nude kneeling, mouth open under viewer's cock POV, eyes wet with devotion, tongue out ready for cum sacrament",
        ],
    ),
    (
        "seraph-fallen-for-you",
        "seraph",
        "night chapel, no halo left, only moonlight and gold candles, chosen fall",
        [
            # s4: no halo — confession before she makes you stroke
            "sheer ivory gown, no halo, holding viewer's face, soft confession pose before JOI, chosen fall eyes",
            # grinding slow, tears of relief
            "gown open, bare body pressed to viewer, slow grinding, tears of relief, fallen on purpose smile",
            # sacred slut cowgirl praising every gasp
            "nude with open gown, slow deep cowgirl, praising every gasp, sacred slut for only you expression",
            # curled on chest — cum on stomach, chosen forever
            "fully nude aftercare, curled on his chest on chapel floor, no halo, loving smile, cum drying on stomach, chosen forever",
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
                f"character sheet, official character art, identity lock"
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
            f"{seed_flag} --steps 34 --cfg_scale 7 --width 832 --height 1216 "
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
            "steps": 34,
            "cfg_scale": 7,
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
