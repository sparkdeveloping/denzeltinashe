#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
PART_DIR="public/client/gabby/.bundle-parts"
OUT="public/client/gabby/Gabby-Final-Gallery.zip"
if ! compgen -G "$PART_DIR/Gabby-Final-Gallery.zip.part*" > /dev/null; then
  echo "Bundle parts not found in $PART_DIR" >&2
  exit 1
fi
cat "$PART_DIR"/Gabby-Final-Gallery.zip.part* > "$OUT"
unzip -tq "$OUT" >/dev/null
echo "Restored and verified $OUT"
