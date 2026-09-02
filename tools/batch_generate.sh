#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

jobs=(
  "raven-first-timer:0" "raven-first-timer:1" "raven-first-timer:2"
  "raven-private-booth:0" "raven-private-booth:1" "raven-private-booth:2" "raven-private-booth:3"
  "raven-velvet-room:0" "raven-velvet-room:1" "raven-velvet-room:2" "raven-velvet-room:3"
  "raven-off-the-clock:0" "raven-off-the-clock:1" "raven-off-the-clock:2" "raven-off-the-clock:3"
  "raven-house-rules:0" "raven-house-rules:1" "raven-house-rules:2" "raven-house-rules:3"
  "miko-for-luck:0" "miko-for-luck:1" "miko-for-luck:2"
  "miko-closing-blessing:0" "miko-closing-blessing:1" "miko-closing-blessing:2" "miko-closing-blessing:3"
  "miko-private-offering:0" "miko-private-offering:1" "miko-private-offering:2" "miko-private-offering:3"
  "miko-only-you:0" "miko-only-you:1" "miko-only-you:2" "miko-only-you:3"
  "blaze-rematch:0" "blaze-rematch:1" "blaze-rematch:2"
  "blaze-pit-lane:0" "blaze-pit-lane:1" "blaze-pit-lane:2" "blaze-pit-lane:3"
  "blaze-redline:0" "blaze-redline:1" "blaze-redline:2" "blaze-redline:3"
  "blaze-pole-position:0" "blaze-pole-position:1" "blaze-pole-position:2" "blaze-pole-position:3"
  "seraph-descent:0" "seraph-descent:1" "seraph-descent:2"
  "seraph-halo-slip:0" "seraph-halo-slip:1" "seraph-halo-slip:2" "seraph-halo-slip:3"
  "seraph-soft-blasphemy:0" "seraph-soft-blasphemy:1" "seraph-soft-blasphemy:2" "seraph-soft-blasphemy:3"
  "seraph-fallen-for-you:0" "seraph-fallen-for-you:1" "seraph-fallen-for-you:2" "seraph-fallen-for-you:3"
)

total=${#jobs[@]}
i=0
for job in "${jobs[@]}"; do
  i=$((i+1))
  scene=${job%%:*}
  layer=${job##*:}
  echo "[$i/$total] $scene L$layer"
  if python3 tools/generate_one.py "$scene" "$layer"; then
    :
  else
    echo "  retry in 10s..."
    sleep 10
    python3 tools/generate_one.py "$scene" "$layer" || echo "  STILL FAILED"
  fi
  sleep 4
done

echo "DONE gen=$(find public/gen -name image.png | wc -l) art=$(find public/art -path '*/DROP/*.png' | wc -l)"
