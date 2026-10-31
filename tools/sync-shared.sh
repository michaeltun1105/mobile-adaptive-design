#!/usr/bin/env bash
# Copies the single source of truth in shared/ into each skill that needs it.
# Run after editing anything in shared/, before committing / packaging. Never edit the copies inside skills/.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"; S="$ROOT/shared/scripts"; K="$ROOT/skills"
copy(){ local skill=$1; shift; mkdir -p "$K/$skill/scripts" "$K/$skill/references"; for f in "$@"; do cp "$S/$f" "$K/$skill/scripts/"; done; [ "$skill" != iphone-duo-design ] && cp "$ROOT/shared/sources.md" "$K/$skill/references/sources.md"; true; }
copy design-system-setup     system/load-system.js system/save-system.js theme/theme-generate.mjs theme/apply-theme.js theme/type-scale.js icons/svg-to-24.py figma/helpers.js
copy android-adaptive-design system/load-system.js figma/helpers.js figma/android-helpers.js theme/apply-theme.js icons/svg-to-24.py a11y/contrast-audit.js a11y/text-scale-check.js
copy iphone-duo-design       system/load-system.js figma/helpers.js figma/ios-helpers.js a11y/contrast-audit.js a11y/text-scale-check.js
copy ios-to-android          system/load-system.js figma/helpers.js figma/android-helpers.js icons/svg-to-24.py
copy accessibility-check     system/load-system.js a11y/contrast-audit.js a11y/text-scale-check.js a11y/touch-target-check.js a11y/hardcode-check.js
echo "synced"
