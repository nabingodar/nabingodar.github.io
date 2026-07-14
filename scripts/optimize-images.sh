#!/bin/sh
set -e

# Optimize images into images/optimized/
# Requires: imagemagick (convert), cwebp (libwebp), and optionally avifenc (libavif)

mkdir -p images/optimized

IMAGES="images/hero.jpg images/nabin.jpg"
SIZES="800 1200 1600"

for img in $IMAGES; do
  if [ ! -f "$img" ]; then
    echo "Warning: $img not found, skipping"
    continue
  fi
  base=$(basename "$img" .jpg)

  for w in $SIZES; do
    out_jpg="images/optimized/${base}-${w}.jpg"
    out_webp="images/optimized/${base}-${w}.webp"
    out_avif="images/optimized/${base}-${w}.avif"

    echo "Generating ${out_jpg}"
    # Resize, strip metadata, and save progressive JPEG
    convert "$img" -strip -interlace Plane -quality 85 -resize ${w}x "$out_jpg"

    echo "Generating ${out_webp} (WebP, q=75)"
    cwebp -q 75 "$out_jpg" -o "$out_webp"

    if command -v avifenc >/dev/null 2>&1; then
      echo "Generating ${out_avif} (AVIF, q=50)"
      avifenc --min 0 --max 63 -q 50 "$out_jpg" "$out_avif"
    fi
  done

done

echo "Optimization complete. Optimized images are in images/optimized/"
