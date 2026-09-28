#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
PART_DIR="public/client/gabby/.bundle-parts"
OUT="public/client/gabby/Gabby-Final-Gallery.zip"
cat "$PART_DIR"/Gabby-Final-Gallery.zip.part* > "$OUT"
echo "Restored $OUT"
