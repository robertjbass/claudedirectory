import { HowTo } from "@/lib/types";

export const appversionReleaseHowTo: HowTo = {
  slug: "appversion-release",
  title: "How to Cut a Release with AppVersion",
  description:
    "Go from a pile of merged commits to a tagged GitHub Release without guessing the SemVer level or forgetting to bump package.json",
  difficulty: "beginner",
  timeToComplete: "15 min",
  tags: ["semver", "versioning", "changelog", "release", "git", "github"],
  featured: false,
  dateAdded: "2026-07-25",
  author: {
    name: "Amirreza Jolani",
    url: "https://github.com/AmirrezaJolani",
  },
  repoUrl: "https://github.com/AmirrezaJolani/appversion-skill",
  content: `# How to Cut a Release with AppVersion

Releases go wrong in two boring, repeatable ways: you forget to bump \`package.json\`, and you
guess whether the change was major, minor, or patch. AppVersion fixes both by making the version
a single source of truth and by *showing you its reasoning* before it changes anything.

## Prerequisites

- Node.js 18 or newer (the tool uses built-ins only — zero third-party dependencies)
- A git repository
- The \`gh\` CLI, authenticated — only needed for the final GitHub Release step

## Step 1 — Install

The marketplace install gets you the skill **and** the \`/appversion:*\` slash commands. Run these
inside an interactive \`claude\` session, not in your shell:

\`\`\`
/plugin marketplace add AmirrezaJolani/appversion-skill
/plugin install appversion@appversion-skill
\`\`\`

If you only want the skill and no slash commands:

\`\`\`bash
npx skills add AmirrezaJolani/appversion-skill --skill appversion
\`\`\`

## Step 2 — Know how to call the CLI

There is no global \`appversion\` binary. The deterministic mechanics live in a script inside the
skill directory, and you invoke it with \`node\`. Set a variable once so the rest of the commands
stay readable:

\`\`\`bash
S=skills/appversion/scripts/appversion.js
node $S show --path .
\`\`\`

\`--path .\` points the tool at the project you are versioning, which matters because the script
itself lives in the skill folder, not in your repo.

In practice you rarely type these by hand — you ask Claude to "bump the version" or "cut a
release" and it drives the same commands. Knowing the CLI is what lets you verify what it did.

## Step 3 — Create the version file

\`\`\`bash
node $S init --path .
\`\`\`

This writes an \`appversion.json\` at the project root holding the SemVer version, the release
stage, build counters, and the commit hash. From here on, \`package.json\` and any other
configured JSON files are synced **from** this file — one source of truth, one place to change.

## Step 4 — Let it recommend the bump

This is the step that removes the guessing. Ask Claude to cut a release, or run
\`/appversion:release\`. Before touching a file, it itemizes every change since the last version,
classifies each one, and explains the aggregate:

\`\`\`
Since v1.2.0 — 6 commits across 3 PRs/branches:

  feat/PROJ-142  CSV export            → minor   new capability, backward compatible
  feat/APP-88    Bulk user import      → minor   new capability, backward compatible
  fix/PROJ-151   Pagination off-by-one → patch   backward-compatible bug fix

  Tally: 2 minor-level features + 1 patch-level fix
  → Recommended bump: MINOR (highest level wins)   → v1.2.0 → v1.3.0
\`\`\`

The tally is *rationale*, not arithmetic: two minors do not add up to a major. The bump is a
single step at the highest level present. A breaking change — \`feat!\`, or a \`BREAKING CHANGE:\`
footer — outranks any number of minors and patches.

To skip the conversation and apply the inferred level directly:

\`\`\`bash
node $S bump --auto --path .
\`\`\`

\`--auto\` maps \`feat\` to minor, \`fix\` to patch, and \`feat!\` or a \`BREAKING CHANGE:\` **footer** to
major. The phrase "breaking change" sitting in prose or in a branch name does not force a major —
only the real Conventional Commits marker does.

You can also name the level yourself when you disagree with the recommendation:

\`\`\`bash
node $S bump minor --path .
\`\`\`

## Step 5 — Review the changelog

The next gate is a Keep a Changelog section, generated from the same analysis and editable before
it lands. Fix the wording now — this is the text your users actually read.

## Step 6 — Tag and release

Pushing is outward-facing and effectively permanent, so it is confirmed separately from
everything above. Nothing is ever pushed or released automatically.

\`\`\`bash
node $S tag --push --path .                                  # annotated v<version>, pushed
node $S release --notes-file NOTES.md --dry-run --path .     # preview the exact gh command
node $S release --notes-file NOTES.md --path .               # push tag + cut the Release
\`\`\`

\`--dry-run\` works on **every** command, and it is the habit worth forming: it prints exactly what
would happen and writes nothing. \`tag\` also refuses to clobber a tag that already exists.

## Step 7 — Make forgetting impossible

Three escalating options, from advisory to enforced:

\`\`\`bash
node $S check --path .          # exit non-zero if package.json drifts — use in CI
node $S install-hook --path .   # pre-push hook: a forgotten sync fails the push
node $S sync --path .           # repair drift after the fact
\`\`\`

\`check\` is deliberately forgiving in one specific way: a branch with **no** \`appversion.json\`
passes untouched rather than failing. That is what makes it safe as a pre-push hook on an older
branch that predates the file.

\`install-hook\` resolves the hooks directory through \`git rev-parse --git-path hooks\`, so it
honors \`core.hooksPath\`, linked worktrees, and submodules instead of assuming \`.git/hooks\`. If a
foreign \`pre-push\` hook is already there, it refuses and prints the line to add manually rather
than overwriting your hook.

For a warning that arrives earlier — while you are still in the session, before you even reach a
push — pair this with the **AppVersion Drift Check** hook, which runs the same \`check\` when
Claude finishes a turn.

## Optional — Ticket titles in your changelog

Configure \`config.tracker\` in \`appversion.json\` with one tracker or several at once: Jira, Plane,
Shortcut, ClickUp, or Linear. Ticket IDs found in commit messages and branch names are resolved
to real titles and links in both the recommendation and the changelog. Each ID routes to whichever
provider's key prefixes match, so one release can pull from several trackers.

Two deliberate constraints:

- **Tokens come from environment variables only**, never from config files, so nothing secret
  lands in a committed \`appversion.json\`.
- **Enrichment is best-effort.** A missing token or a failed request skips it and the release
  proceeds on commit text alone. A tracker outage cannot block your release.

## Verify it worked

\`\`\`bash
node $S show full --path .    # version, stage, build, commit
node $S check --path .        # should print: in sync at <version>
git tag --list 'v*'           # your new annotated tag
gh release list               # the published Release
\`\`\`

## Troubleshooting

**\`git hooks directory not found\`** — \`install-hook\` was run outside a git repository. Run
\`git init\` first, or point \`--path\` at the right directory.

**\`check\` says a file is out of sync after a manual edit** — you edited \`package.json\` directly.
Change \`appversion.json\` instead and run \`sync\`; editing the derived file is what drift *is*.

**Slash commands do nothing in your shell** — \`/appversion:release\` is a Claude Code slash
command, not a shell command. It only works inside an interactive \`claude\` session.

**A commit you expected to force a major only produced a minor** — the marker has to be a real
\`feat!\` or a \`BREAKING CHANGE:\` footer. Prose does not count. Name the level explicitly with
\`bump major\` if you want it anyway.
`,
  relatedItems: [
    { type: "plugin", slug: "appversion", relationship: "documented-by" },
    { type: "skill", slug: "appversion", relationship: "documented-by" },
    { type: "hook", slug: "appversion-drift-check", relationship: "works-with" },
    { type: "skill", slug: "changelog", relationship: "works-with" },
  ],
};
