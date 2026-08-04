import { Hook } from "@/lib/types";

export const appversionDriftCheckHook: Hook = {
  slug: "appversion-drift-check",
  title: "AppVersion Drift Check",
  description:
    "Warns when package.json has drifted from appversion.json once Claude finishes a turn. The Claude Code counterpart to AppVersion's git pre-push hook — it reports drift and tells you which command repairs it, but never writes, blocks, or bumps on its own.",
  event: "Stop",
  tags: ["semver", "versioning", "release", "git", "automation"],
  featured: false,
  dateAdded: "2026-07-25",
  author: {
    name: "Amirreza Jolani",
    url: "https://github.com/AmirrezaJolani",
  },
  repoUrl: "https://github.com/AmirrezaJolani/appversion-skill",
  script: `#!/bin/bash
# AppVersion Drift Check
#
# Stop hook: after Claude finishes a turn, verify that package.json (and any
# other configured JSON file) still matches the version in appversion.json.
#
# AppVersion ships its own enforcement as a git pre-push hook via
# "appversion install-hook". That one blocks a drifted push. This is the
# Claude Code counterpart: it surfaces drift much earlier, while you are still
# in the session, and only ever warns.

# Only relevant in a project that tracks its version this way. No appversion.json
# means there is nothing to compare against, so stay silent.
[ -f appversion.json ] || exit 0

# Locate the skill's helper script. Marketplace installs land under
# ~/.claude/plugins; "npx skills add" and manual symlinks land under
# ~/.claude/skills; a repo vendoring the skill has it in ./skills.
SCRIPT=""
for CANDIDATE in \\
  "./skills/appversion/scripts/appversion.js" \\
  "$HOME/.claude/skills/appversion/scripts/appversion.js" \\
  "$HOME/.claude/plugins/appversion-skill/skills/appversion/scripts/appversion.js"; do
  if [ -f "$CANDIDATE" ]; then
    SCRIPT="$CANDIDATE"
    break
  fi
done

# Marketplace layouts nest the plugin directory, so fall back to a bounded search
if [ -z "$SCRIPT" ] && [ -d "$HOME/.claude/plugins" ]; then
  SCRIPT=$(find "$HOME/.claude/plugins" -maxdepth 6 \\
    -path "*appversion/scripts/appversion.js" -print -quit 2>/dev/null)
fi

# Skill not installed here. Nothing to report, and nagging about a missing
# optional tool would be noise on every single turn.
if [ -z "$SCRIPT" ] || [ ! -f "$SCRIPT" ]; then
  exit 0
fi

# "check" is read-only. It exits 0 when in sync (or when appversion.json is
# absent) and non-zero only on genuine drift, naming each offending file.
if OUTPUT=$(node "$SCRIPT" check --path . 2>&1); then
  exit 0
fi

echo "AppVersion: version drift detected"
echo ""
echo "$OUTPUT"
echo ""
echo "Repair it with:   node $SCRIPT sync --path ."
echo "Or cut the next version:   node $SCRIPT bump --auto --path ."

# Warn, never block. A Stop hook that exits non-zero interrupts the session,
# and stale version metadata is not worth derailing the work in progress.
exit 0
`,
  relatedItems: [
    { type: "plugin", slug: "appversion", relationship: "part-of" },
    { type: "skill", slug: "appversion", relationship: "works-with" },
    { type: "how-to", slug: "appversion-release", relationship: "documented-by" },
  ],
};
