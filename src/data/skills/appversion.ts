import { Skill } from "@/lib/types";

export const appversionSkill: Skill = {
  slug: "appversion",
  title: "AppVersion",
  description:
    "Turns cutting a release into a guided, reviewable flow — analyzes commits since the last version, recommends a SemVer bump with per-change reasoning, syncs appversion.json + package.json, writes the changelog, and tags a GitHub Release",
  tags: ["semver", "versioning", "changelog", "release", "git"],
  featured: false,
  dateAdded: "2026-07-25",
  author: {
    name: "Amirreza Jolani",
    url: "https://github.com/AmirrezaJolani",
  },
  repoUrl: "https://github.com/AmirrezaJolani/appversion-skill",
  content: `# AppVersion Skill

Solves two specific release mistakes: **forgetting to update \`package.json\`**, and
**guessing whether a change is major, minor, or patch**.

Version state lives in an \`appversion.json\` at the project root (SemVer version, plus
release stage, build counters, and the commit hash). \`package.json\` and any other
configured JSON files are kept in sync *from* it, so there is a single source of truth.

## Install

Plugin marketplace — gets the skill *and* the \`/appversion:*\` commands. These are slash commands:
run them inside an interactive \`claude\` session, not in your shell.

\`\`\`
/plugin marketplace add AmirrezaJolani/appversion-skill
/plugin install appversion@appversion-skill
\`\`\`

Skill only, no commands:

\`\`\`bash
npx skills add AmirrezaJolani/appversion-skill --skill appversion
\`\`\`

## Usage
\`\`\`
/appversion:package     # version files
/appversion:github      # tag + GitHub Release
/appversion:release     # the whole guided flow
\`\`\`

Or just ask to "bump the version" / "cut a release".

## The recommendation

Before changing anything, it itemizes every change, classifies each one, and explains the
aggregate — then waits for approval:

\`\`\`
Since v1.2.0 — 6 commits across 3 PRs/branches:

  feat/PROJ-142  CSV export            → minor   new capability, backward compatible
  feat/APP-88    Bulk user import      → minor   new capability, backward compatible
  fix/PROJ-151   Pagination off-by-one → patch   backward-compatible bug fix

  Tally: 2 minor-level features + 1 patch-level fix
  → Recommended bump: MINOR (highest level wins)   → v1.2.0 → v1.3.0
\`\`\`

Bump math is standard SemVer: the counts are rationale, the bump is a single step at the
highest level present. Breaking changes (\`feat!\`, a \`BREAKING CHANGE:\` footer) win over
any number of minors and patches.

## Three confirmation gates

1. **The bump** — the itemized recommendation above.
2. **The changelog** — a Keep a Changelog section you can edit before it lands.
3. **Push + Release** — outward-facing and effectively permanent, so it is confirmed
   separately. Nothing is ever pushed or released automatically.

## Never forget again

\`\`\`bash
appversion bump --auto      # infer the level from conventional commits and apply it
appversion check            # exit non-zero if package.json drifts (use in CI)
appversion install-hook     # pre-push hook: a forgotten sync fails the push
appversion sync             # repair drift
\`\`\`

\`--auto\` maps \`feat\`→minor, \`fix\`→patch, and \`feat!\` or a \`BREAKING CHANGE:\` *footer*→major —
the phrase in prose or a branch name does not force a major.

Enforcement is read-only and blocks nothing but a drifted push: a branch with no \`appversion.json\`
passes untouched, and it never bumps or pushes on its own.

## Optional ticket enrichment (read-only)

Configure one tracker or several at once — Jira, Plane, Shortcut, ClickUp, Linear. Ticket
IDs found in commits and branch names are resolved to real titles and links in both the
recommendation and the changelog. Each ID routes to the provider whose key prefixes match,
so a single release can pull from multiple trackers.

Tokens come from environment variables only, never from config files, and no local tracker
app is ever read. Enrichment is best-effort: a missing token or a failed request skips it
and the release proceeds on commit text.

## Notes

Zero third-party dependencies (Node ≥18 built-ins only), 67 tests, and every \`git\`/\`gh\`
call is shell-free. \`--dry-run\` on any command previews without writing. Works unchanged
under Claude Code, Gemini CLI, Codex, Cursor, opencode, and GitHub Copilot. MIT licensed.
`,
  relatedItems: [
    { type: "how-to", slug: "appversion-release", relationship: "documented-by" },
    { type: "hook", slug: "appversion-drift-check", relationship: "works-with" },
    { type: "skill", slug: "changelog", relationship: "works-with" },
    { type: "plugin", slug: "appversion", relationship: "works-with" },
  ],
};
