import { Plugin } from "@/lib/types";

export const brothersbePlugin: Plugin = {
  slug: "brothersbe",
  title: "BrotherSBE",
  description:
    "A senior backend and data engineering colleague for Claude Code. Designs systems in order (purpose, process, architecture, data, expression, verification) and holds the result to gates that actually run, reporting absent evidence as NO-DATA rather than a pass.",
  tags: ["backend", "data-engineering", "verification", "migrations", "code-review"],
  featured: false,
  dateAdded: "2026-08-07",
  author: {
    name: "Khalil Maaouni",
    url: "https://github.com/khalilmaaouni",
  },
  repoUrl: "https://github.com/khalilmaaouni/BrotherSBE",
  installCommand:
    "claude plugin marketplace add khalilmaaouni/BrotherSBE && claude plugin install brothersbe@brothersbe",
  commands: [
    { name: "/brothersbe:start", description: "Looks at where you are, a new project or one in progress, and takes it from there" },
    { name: "/brothersbe:next", description: "Recommends exactly one next action" },
    { name: "/brothersbe:status", description: "Explains where the work stands in plain language" },
    { name: "/brothersbe:help", description: "Lays out the whole map on request" },
  ],
};
