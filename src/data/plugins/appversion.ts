import { Plugin } from "@/lib/types";

export const appversionPlugin: Plugin = {
  slug: "appversion",
  title: "AppVersion",
  description:
    "Stop forgetting to bump package.json and stop guessing the SemVer level. Analyzes commits since the last version, recommends major/minor/patch with per-change reasoning, applies it to appversion.json + package.json, updates the changelog, and cuts a tagged GitHub Release. Optional read-only ticket enrichment from Jira, Plane, Shortcut, ClickUp, and Linear.",
  tags: ["semver", "versioning", "changelog", "release", "git", "github"],
  featured: false,
  dateAdded: "2026-07-25",
  author: {
    name: "Amirreza Jolani",
    url: "https://github.com/AmirrezaJolani",
  },
  repoUrl: "https://github.com/AmirrezaJolani/appversion-skill",
  installCommand:
    "/plugin marketplace add AmirrezaJolani/appversion-skill && /plugin install appversion@appversion-skill",
  config: `{
  "enabledPlugins": {
    "appversion@appversion-skill": true
  }
}`,
  commands: [
    { name: "/appversion:package", description: "The version files — appversion.json, package.json, configured JSON and badges. Covers bump, --auto, check, sync, and install-hook" },
    { name: "/appversion:github", description: "Create the annotated tag and cut the GitHub Release" },
    { name: "/appversion:release", description: "The whole guided flow: analyze, recommend, bump, changelog, tag, Release" },
    { name: "/appversion:jira", description: "Read-only Jira enrichment — config, JIRA_EMAIL / JIRA_API_TOKEN, PROJ-123 IDs" },
    { name: "/appversion:linear", description: "Read-only Linear enrichment — LINEAR_API_KEY, team-key IDs" },
    { name: "/appversion:plane", description: "Read-only Plane enrichment — PLANE_API_TOKEN, host and workspace" },
    { name: "/appversion:shortcut", description: "Read-only Shortcut enrichment — SHORTCUT_API_TOKEN, sc-1234 IDs" },
    { name: "/appversion:clickup", description: "Read-only ClickUp enrichment — CLICKUP_API_TOKEN, CU-… or custom prefixes" },
  ],
  relatedItems: [
    { type: "how-to", slug: "appversion-release", relationship: "documented-by" },
    { type: "hook", slug: "appversion-drift-check", relationship: "contains" },
    { type: "plugin", slug: "changelog-generator", relationship: "works-with" },
    { type: "skill", slug: "changelog", relationship: "works-with" },
  ],
};
