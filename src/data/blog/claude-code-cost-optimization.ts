import { BlogPost } from "@/lib/types";

export const claudeCodeCostOptimization: BlogPost = {
  slug: "claude-code-cost-optimization",
  title: "Claude Code Costs: Where Your Tokens Actually Go",
  description:
    "Most people try to cut their Claude Code bill by switching to a cheaper model. That's the wrong first move. Here's what actually drives token spend in an agentic session — and seven levers that cut it without making the agent worse.",
  publishedDate: "2026-07-30",
  seoTitle: "Claude Code Cost Optimization: Cut Your Token Spend",
  seoDescription:
    "A practical guide to Claude Code token costs: what drives spend, how prompt caching really works, and seven levers to cut the bill without hurting output quality.",
  tags: [
    "claude-code",
    "cost-optimization",
    "claude-models",
    "context-engineering",
    "subagents",
    "best-practices",
    "productivity",
    "2026",
  ],
  featured: true,
  author: {
    name: "Claude Directory",
    url: "https://github.com/tmcpa/claudedirectory",
  },
  relatedItems: [
    {
      type: "blog",
      slug: "which-claude-model-to-use",
      relationship: "recommends",
    },
    {
      type: "blog",
      slug: "context-engineering-claude-code",
      relationship: "recommends",
    },
    {
      type: "blog",
      slug: "claude-code-subagents-guide",
      relationship: "recommends",
    },
    {
      type: "blog",
      slug: "claude-md-guide",
      relationship: "recommends",
    },
  ],
  content: `# Claude Code Costs: Where Your Tokens Actually Go

The first time a Claude Code bill surprises you, the instinct is to reach for a cheaper model. That is almost always the wrong first move — and often it makes the bill *worse*, because the cheap model needs three attempts at something the expensive one would have finished in one.

The bill is not mostly about which model you picked. It is about how many times you resend the same tokens.

This is a map of where the money actually goes in an agentic session, and seven levers that cut it. Some of them are worth real money. A couple of the popular ones are worth almost nothing. Whether you pay per token on the API or work against a plan's limits, the same mechanics decide how far your budget stretches.

---

## Where the Money Actually Goes

A chat is cheap because it is short. An agentic session is expensive because of a detail that is easy to miss:

> **Every turn resends the entire conversation.**

The model is stateless. Turn 40 does not send "the next message" — it sends the system prompt, your \`CLAUDE.md\`, every tool definition, all 39 prior turns, and every file the agent read along the way. Then turn 41 sends all of that again, plus turn 40.

So the output you read is the small number. The input you resend, over and over, is the big one. In a long session, **input tokens routinely outweigh output tokens by an order of magnitude or more.**

That single fact reorders the whole optimization list. Three things drive spend, roughly in this order:

1. **Repeated input** — the conversation prefix, re-sent every turn. Dominant in long sessions, and the thing prompt caching exists to fix.
2. **Model tier** — a 10x price spread from bottom to top of the lineup.
3. **Output and thinking tokens** — real, but usually the smallest of the three.

Most cost advice targets #3. The money is in #1.

---

## The Price Ladder

Current per-million-token rates, cheapest to most expensive:

| Model | Input / Output (per MTok) | Context |
|---|---|---|
| **Haiku 4.5** | $1 / $5 | 200K |
| **Sonnet 5** | $3 / $15 | 1M |
| **Opus 5** | $5 / $25 | 1M |
| **Fable 5** | $10 / $50 | 1M |

Two things worth noting. Sonnet 5 is running an introductory $2 / $10 through August 31, 2026 — cheap enough that routing routine work there is close to free money. And the 1M context window on the upper tiers is priced at standard rates; there is no long-context premium waiting to ambush you at 500K tokens.

The spread from Haiku to Fable is 10x. That sounds like the headline. It isn't — because a cached token costs about a tenth of an uncached one, which is the *same* order of magnitude as the entire model ladder. You can pay Opus prices on a well-cached session and spend less than Sonnet prices on a session that thrashes its cache.

---

## Read the Meter Before You Optimize

Run \`/cost\` in any session. It shows token usage and cost for that session — and it is the only honest input to this whole exercise. Guessing at where your tokens go is how people end up optimizing the 5% and ignoring the 80%.

If you are working through the API, the equivalent lives on the usage object of each response, and there is one field that trips almost everyone:

- \`input_tokens\` — the **uncached remainder only**
- \`cache_read_input_tokens\` — served from cache, ~0.1x price
- \`cache_creation_input_tokens\` — written to cache this turn

Total prompt size is all three added together. If you look at \`input_tokens\` alone after a long agentic run, see 4K, and conclude your context is small, you have misread the meter — the rest was served from cache.

The number to watch is the ratio. **In a healthy long session, cache reads should dwarf uncached input.** If \`cache_read_input_tokens\` is sitting at zero across repeated turns, something is invalidating your cache every single request, and that is the most expensive bug on this page.

---

## Lever 1: Stop Breaking the Prompt Cache

This is the big one, so it goes first.

Prompt caching is a **prefix match**. The cache key is the exact bytes of the prompt up to a breakpoint. Change one byte anywhere in the prefix and everything after it is invalidated and re-billed at full price.

The economics are strong enough to reorder your priorities:

- **Cache reads cost ~0.1x** the base input price.
- **Cache writes cost 1.25x** with the default 5-minute TTL, or 2x with a 1-hour TTL.

So a 5-minute cache pays for itself on the *second* request: 1.25x + 0.1x = 1.35x, against 2x for sending it twice uncached. The 1-hour TTL costs more to write and needs a third request to break even, but it survives the gaps in bursty work.

What silently breaks a prefix:

- **A timestamp or session ID interpolated near the top of the prompt.** "Current date: ..." at the head of a system prompt invalidates *everything* after it, every request. This is the single most common cache bug.
- **Switching models mid-session.** Caches are model-scoped. Flipping from Sonnet to Opus and back re-pays the full prompt each way. Pick the model for the *session*, not the message.
- **Adding or removing tools mid-session.** Tool definitions render at the very front of the prompt. Connecting a new MCP server halfway through a session invalidates the entire cache behind it.
- **Non-deterministic serialization** — unsorted JSON keys, iterating a set. Same data, different bytes, no match.

There is also a floor. The minimum cacheable prefix is model-dependent, and shorter prefixes **silently** fail to cache — no error, just a bill:

| Model | Minimum cacheable prefix |
|---|---|
| Opus 5, Fable 5 | 512 tokens |
| Opus 4.8, Sonnet 5 | 1,024 tokens |
| Haiku 4.5 | 4,096 tokens |

Note that it is not monotonic across generations. A 3K-token prompt caches on Opus 5 and silently does not on Haiku 4.5 — which is a genuinely counterintuitive way for the cheap model to cost you more.

---

## Lever 2: Treat Context as a Budget

A 1M-token context window is not an invitation to fill it. Every token you put in the window gets re-sent on every subsequent turn for the rest of the session. **Context is a recurring cost, not a one-time one.**

That reframes a few habits:

- **\`/clear\` between unrelated tasks.** Carrying a finished task's context into the next one means paying for it on every remaining turn. Starting fresh is cheaper *and* produces better output, because the agent is not reasoning around stale detail.
- **\`/compact\` before the window forces it.** Compaction summarizes the conversation so far. Doing it deliberately at a natural boundary gives you a cleaner summary than doing it automatically mid-task.
- **Audit your MCP servers.** Every connected server's tool schemas sit at the front of the prompt on every request. A server you connected once and never use is a permanent tax on the session — and it also invalidates the cache the moment you add it.
- **Keep \`CLAUDE.md\` tight.** It is prefix content, which is the good news (it caches well and stays cached) and the bad news (bloat there is paid on literally every request of every session). Aim for the conventions the agent actually needs, not an exhaustive project encyclopedia.

The deeper treatment of this is in [context engineering](/blog/context-engineering-claude-code); the cost angle is simply that context you do not need is a subscription you keep paying.

---

## Lever 3: Route Work Down the Ladder

Now the model choice — third, not first, but still worth real money.

The routing question is not "how smart do I need?" It is **"what does failure cost, and how long does this run unattended?"** A cheap model that fumbles a task you then redo on a stronger model cost you both runs plus your context-switch. It was the expensive choice.

The practical version:

- **Haiku 4.5** — high-volume, mechanical, low-stakes. Classification, extraction, routing.
- **Sonnet 5** — the workhorse. Most interactive coding, most pipelines. Standardize here and route the exceptions.
- **Opus 5** — genuinely hard work, and long autonomous runs where coherence is what you are buying.
- **Fable 5** — the hardest few percent, where being wrong is expensive and the run is long.

The mistake that costs the most is not picking a bad model. It is picking *one* model and running everything through it. [Which Claude model to use](/blog/which-claude-model-to-use) goes deeper on the routing rules.

---

## Lever 4: Push Grunt Work to Subagents

This is where model routing becomes genuinely powerful, because it lets you use two tiers at once without paying the cache penalty for switching.

In a fan-out, the parent agent makes judgment calls and the subagents mostly read files and report back. Those are different jobs with different price requirements. **Strong brain at the top, cheap muscle below.**

Subagent definitions in \`.claude/agents/*.md\` carry their own model and reasoning effort in frontmatter, so this is a configuration change, not a discipline you have to remember:

\`\`\`markdown
---
name: explore
description: Read-only search agent for broad fan-out
model: haiku
effort: low
tools: Read, Grep, Glob
---
\`\`\`

Two things are happening here. The obvious one: search legwork runs at $1/MTok instead of $5. The less obvious one, and the reason this beats manually switching models: **the subagent gets its own context window.** Twenty files read inside a subagent never enter the parent's conversation, so you do not pay to re-send them on every remaining parent turn. The parent gets the summary.

That second effect is usually bigger than the price-per-token saving. A single-tier setup either overpays for grunt work or underpowers the judgment; the mixed setup does neither. See the [subagents guide](/blog/claude-code-subagents-guide) for the fan-out patterns.

---

## Lever 5: Tune Effort to the Task

Effort controls how deeply the model reasons before and while it acts — \`low\`, \`medium\`, \`high\`, \`xhigh\`, \`max\`. Claude Code runs at \`xhigh\` by default, which is the right default for hard coding work and the wrong one for everything simple.

Lower effort means fewer and more consolidated tool calls, less preamble, and terser output. On routine work that is not a quality tradeoff — it is removing deliberation the task never needed.

The counterintuitive part: **effort is not a reliable verbosity control, and it is not always monotonic on cost.** Higher effort on a genuinely hard agentic task often *reduces* total spend, because better planning up front means fewer turns, fewer wrong paths, and fewer retries. The expensive pattern is a low-effort model flailing across fifteen turns at something a high-effort model resolves in four.

So: turn effort down on subagents and mechanical tasks, where you know the work is simple. Leave it up where the task is hard. Do not turn it down globally to save money — that is the same mistake as reaching for the cheap model first.

---

## Lever 6: Spend on Planning to Save on Execution

Plan mode looks like it costs extra. It usually pays for itself several times over.

The most expensive thing in an agentic session is not an expensive model — it is **work you throw away.** An agent that misunderstands the task and writes for twenty minutes has burned twenty minutes of input *and* output tokens, and you still have to pay again for the correct version. Planning first is cheap insurance against exactly that.

The same logic covers a few adjacent habits:

- **Give the full task specification up front.** A well-specified first turn beats the same information dribbled out over six turns — and each of those turns re-sent the whole conversation to deliver one sentence of clarification.
- **Use [worktrees](/blog/claude-code-worktrees-guide) for parallel work** rather than one session context-switching between three tasks and carrying all three contexts forward.
- **Check in at boundaries, not constantly.** Every interjection is another full-context round trip.

[Plan mode](/blog/claude-code-plan-mode-guide) covers the mechanics. The cost case for it is just that rework is the most expensive token you will ever buy.

---

## Lever 7: Don't Pay the Fast-Mode Premium by Default

Fast mode — toggled with \`/fast\` — runs Claude Opus with substantially higher output speed. It does **not** downgrade you to a smaller model; it is the same model, generating faster, at premium pricing.

That is a genuinely good trade when you are sitting there watching the cursor and latency is the thing you actually want to buy. It is a bad trade for anything running unattended, where nobody is waiting and you are simply paying more per token for speed no one experiences.

Leave it off by default. Turn it on for interactive work when you feel the wait. Turn it back off before you kick off an overnight run.

---

## What Not to Bother Optimizing

Some popular advice is noise, and chasing it costs attention you could spend on the levers above:

- **Micro-editing prompts to save tokens.** Shaving 200 tokens off a well-cached system prompt saves you about 20 tokens' worth of money per request. Meanwhile it may have changed the prefix bytes and invalidated the entire cache. Net loss.
- **Avoiding the big context window on principle.** 1M context is priced at standard rates. Long context is not penalized — *re-sending* it is, which is what caching and \`/clear\` address.
- **Blanket-downgrading the model.** Covered above, and worth repeating because it is the single most common reaction to a surprising bill. Measure cost per *kept result*, not cost per token.
- **Disabling thinking to save output tokens.** It saves a little and costs a lot in quality. Lowering effort is the better-behaved version of this instinct.

---

## The Checklist

If you do nothing else, do these in order:

1. **Run \`/cost\`.** Find out where the money goes before deciding what to change.
2. **Fix cache invalidation.** No timestamps in the prefix, no mid-session model switches, no drive-by MCP connections. Confirm cache reads are non-zero.
3. **\`/clear\` between unrelated tasks.** The cheapest habit on this list.
4. **Move fan-out to cheap subagents** with their own context windows.
5. **Standardize on Sonnet**, route the hard exceptions up and the mechanical ones down.
6. **Lower effort on subagents and routine work.** Leave it high where the task is hard.
7. **Plan before long autonomous runs.** Rework is the most expensive token there is.

---

## The Bottom Line

Claude Code's cost model rewards a specific discipline: **send fewer tokens, and send the same ones the same way every time.**

Almost everything follows from that. Caching is cheap because the bytes match. \`/clear\` is cheap because the conversation stays short. Subagents are cheap because the files they read never enter the parent's window. Planning is cheap because thrown-away work is the one thing you pay for twice.

Model choice matters, and it is worth getting right — but it belongs third on the list, not first. The teams with surprising bills are rarely running the wrong model. They are running one long session that re-sends a bloated, cache-missing prefix a few hundred times.

Fix that, and the model you picked stops being the interesting question.

---

## Further Reading

- [Which Claude Model Should You Use?](/blog/which-claude-model-to-use) — The routing rules behind Lever 3, in depth
- [Context Engineering for Claude Code](/blog/context-engineering-claude-code) — Treating the context window as a budget you spend deliberately
- [The Complete Guide to Claude Code Subagents](/blog/claude-code-subagents-guide) — Fan-out patterns that let you mix model tiers
- [The Complete CLAUDE.md Guide](/blog/claude-md-guide) — Keeping your most-cached file tight
- [Claude Code Plan Mode](/blog/claude-code-plan-mode-guide) — Spending a little up front to avoid paying twice
- [Managing Your Context Window](/how-to/context-window) — Practical context-management tactics
- [Claude Code Cheat Sheet](/blog/claude-code-cheat-sheet) — Every slash command in one place
`,
};
