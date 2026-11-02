#!/usr/bin/env bash
# Copies the single source of truth in shared/ into each skill that needs it.
# Run after editing anything in shared/, before committing / packaging. Never edit the copies inside skills/.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"; S="$ROOT/shared/scripts"; K="$ROOT/skills"
copy(){ local skill=$1; shift; mkdir -p "$K/$skill/scripts" "$K/$skill/references"; for f in "$@"; do cp "$S/$f" "$K/$skill/scripts/"; done; [ "$skill" != build-iphone-duo ] && cp "$ROOT/shared/sources.md" "$K/$skill/references/sources.md"; case $skill in setup-system|build-android|convert-ios-to-android) cp "$ROOT/shared/m3-styles.md" "$K/$skill/references/m3-styles.md";; esac; true; }
copy setup-system     system/load-system.js system/save-system.js theme/theme-generate.mjs theme/apply-theme.js theme/type-scale.js icons/svg-to-24.py figma/helpers.js
copy build-android system/load-system.js figma/helpers.js figma/android-helpers.js theme/apply-theme.js icons/svg-to-24.py a11y/contrast-audit.js a11y/text-scale-check.js
copy build-iphone-duo       system/load-system.js figma/helpers.js figma/ios-helpers.js a11y/contrast-audit.js a11y/text-scale-check.js
copy convert-ios-to-android  system/load-system.js figma/helpers.js figma/android-helpers.js icons/svg-to-24.py
copy check-accessibility     system/load-system.js a11y/contrast-audit.js a11y/text-scale-check.js a11y/touch-target-check.js a11y/hardcode-check.js
echo "synced"
