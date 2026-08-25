import { Plugin } from "@/lib/types";

export const pragmaPlugin: Plugin = {
  slug: "pragma",
  title: "Pragma",
  description:
    "The complete iOS development scaffold for the agentic era. 15 slash commands (/spec, /plan, /feature, /gates, /review, /test, /bugfix, /release, and more) take a feature from idea to merged PR with two human approvals, everything else runs autonomously. CI-enforced gates (not just agent-enforced) re-run the same checks independently in GitHub Actions, and a persistent memory layer (decisions, invariants, rejections) carries context across every session boundary instead of resetting at the conversation edge. Proven on a real, actively-developed, gitflow-integrated codebase — 70+ merged PRs, specs and plans predating every feature, going back to the first commit.",
  tags: [
    "ios",
    "swift",
    "swiftui",
    "swiftdata",
    "xcode",
    "sdlc",
    "tdd",
    "ci-cd",
    "agentic",
  ],
  author: {
    name: "Akshay Pimprikar",
    url: "https://github.com/akshaypimprikar",
  },
  installCommand:
    "/plugin marketplace add akshaypimprikar/pragma && /plugin install pragma@pragma",
  repoUrl: "https://github.com/akshaypimprikar/pragma",
  commands: [
    { name: "/spec", description: "Turn a feature idea into an approved design spec — proposes 2-3 approaches, you choose" },
    { name: "/plan", description: "Turn an approved spec into a task-by-task implementation plan" },
    { name: "/feature", description: "Execute an approved plan — TDD, one commit per task" },
    { name: "/gates", description: "Verify build, full test suite, and architecture compliance before opening a PR" },
    { name: "/review", description: "Review a PR for design compliance and code quality, posts its verdict as a real GitHub review" },
    { name: "/test", description: "Write comprehensive tests for a feature branch" },
    { name: "/bugfix", description: "Regression test first, then fix — test-first always" },
    { name: "/release", description: "Version bump, changelog, PR to main, git tag" },
    { name: "/pragma:init", description: "Interactive setup — configures CLAUDE.md and invariants.md for your project instead of leaving them as templates" },
  ],
};
