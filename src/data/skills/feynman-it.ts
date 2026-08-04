import { Skill } from "@/lib/types";

export const feynmanItSkill: Skill = {
  slug: "feynman-it",
  title: "Feynman It",
  description: "Turns any topic into a hand-illustrated PDF using the Feynman technique — a plain-language sentence, an analogy that gets its own diagram, an explicit misconceptions section, and a one-breath recap",
  tags: ["pdf", "learning", "explainer", "teaching", "documentation", "onboarding"],
  dateAdded: "2026-08-03",
  author: {
    name: "TadTheFisherman",
    url: "https://github.com/TadTheFisherman",
  },
  repoUrl: "https://github.com/TadTheFisherman/feynman-it",
  content: `# Feynman It

Turns any topic — a confusing AI answer, a jargon-heavy article, an unfamiliar codebase, a whole book — into a short, hand-illustrated PDF, built the way Richard Feynman actually taught, instead of just prompting an AI to "explain it simpler".

## When It Triggers

- Any request to explain, teach, break down, or demystify a concept, system, or process
- "Make a PDF / one-pager / handout / explainer / cheat sheet / study guide / illustrated guide" about something
- "Explain like I'm 12" or "make this simpler" requests that want a visual artifact, not just shorter prose
- You don't need to say "Feynman" — any request for a clear, diagram-rich explainer PDF qualifies

## The Method It Enforces

Most "explain it simply" prompts just make the same wall of text shorter. Feynman It instead forces the explanation through five steps:

1. **One plain-language sentence** — no jargon allowed
2. **Explain it to a smart 12-year-old** — short, concrete, no hand-waving
3. **An analogy that earns its own diagram** — something familiar, mapped onto the unfamiliar thing
4. **The parts people get wrong, named explicitly** — the highest-value part of any explanation is usually the part that gets skipped
5. **A one-breath recap** the reader could repeat to a friend

It holds itself to a "pictures-only test": flip through just the diagrams and captions, skip every word of prose, and you should still get the gist. Every major idea gets a hand-authored SVG diagram — not a stock icon.

## How It Works

It's a normal HTML page (a shared print-tuned stylesheet plus hand-drawn inline SVG diagrams), rendered to PDF with headless Chrome or Edge. No image-generation model is involved — the diagrams are real vector shapes Claude draws directly, then the finished PDF lands on the user's Desktop.

## Installation

\`\`\`bash
git clone https://github.com/TadTheFisherman/feynman-it.git
cp -r feynman-it ~/.claude/skills/feynman-pdf
\`\`\`

Requires Claude Code, Python 3, and Google Chrome or Microsoft Edge installed locally (used headlessly — no extra Python packages needed).

## Example Prompts

- "Feynman this article for me: [paste link or text]"
- "Make me an illustrated explainer on how DNS works"
- "Explain the auth module in this codebase like I'm onboarding as a new hire"
- "Compress this book into a one-page PDF: [title/notes]"

## Does Not Trigger For

- Forms that need filling out
- Merging or splitting existing PDFs
- Reports of raw data with no explanatory intent

(Those belong to a generic PDF-handling skill instead.)

## Implementation

Nine example PDFs — built with the skill itself, spanning AI/dev concepts, an unfamiliar codebase, a whole book, physics, economics, blockchain, and math — are in the repo with full PDFs and page screenshots. MIT licensed.
`,
};
