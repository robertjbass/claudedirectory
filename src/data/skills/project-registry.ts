import { Skill } from "@/lib/types";

export const projectRegistrySkill: Skill = {
  slug: "project-registry",
  title: "Project Registry",
  description:
    "Manage a personal project registry (PROJECTS.json) with per-project AI-readable dev logs: CRUD, session resume, decision attribution, health check, and version rollback from one menu",
  tags: ["project-management", "productivity", "workflow", "registry", "context"],
  featured: false,
  author: {
    name: "SUNQSHENG",
    url: "https://github.com/SUNQSHENG",
  },
  content: `# Project Registry

Manage a personal project registry at \`~/projects/PROJECTS.json\` with per-project AI-readable development logs (CLAUDE.md). Works for both business and code projects.

## Features

- **Registry**: list / create / delete / search / stats over PROJECTS.json, auto sequence management
- **Session resume**: entering a project recalls last progress and prioritized next actions
- **Save discipline**: save/exit forces CLAUDE.md update (progress, decisions, prioritized next actions) + git commit + backup rotation (10 per type)
- **Decision attribution**: every decision records its reason (mandatory) and expected effect (optional); ask "why X" to get a decision timeline with status and impact
- **Health check**: content-level checks (status consistency, stale projects, todo backlog, unimplemented decisions, missing next-actions) with attribution hints
- **Rollback**: three flows (CLAUDE.md / project files / registry) with diff confirmation, backup-first, new commits only
- **Safety**: backup rotation with timestamp-based sorting, delete confirmations, privacy lines, card-based confirmations

## Install

\`\`\`bash
npx skills add SUNQSHENG/project-registry
# or in Claude Code:
/plugin marketplace add SUNQSHENG/project-registry
/plugin install project-registry@project-registry
\`\`\`

## Usage

Trigger with "查看项目" / "list projects" / "project registry". Type a project number to open it (session resume kicks in); N = new, D = delete, C = health check; "why X" = decision attribution; "rollback" = version restore.

## Language

UI is Chinese-first; all triggers work in both Chinese and English, and every feature is fully functional regardless of language.

## Repo

https://github.com/SUNQSHENG/project-registry (MIT)`,
};
