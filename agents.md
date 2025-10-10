Here’s a clean, hand-offable agents.md you can drop in the repo and share.

⸻

PDD Foreman Agent — Hackathon Hand-Off

A sponsor-stack demo agent that reads a PDD (Product Design Doc) and builds a working project via pdd sync, while logging state to Convex, showing progress on Vibe Kanban, and narrating milestones with ElevenLabs. Orchestrate it with Dedalus, iterate inside Windsurf/Devin, reason with OpenAI, and render an architecture diagram via Fireworks AI.

⸻

What This Does (TL;DR)
	•	Input: a .prompt (or .md) design spec
	•	Orchestration: Dedalus agent calls pdd generate → pdd sync → (optional) pdd fix
	•	Persistence: Convex stores runs/tasks/logs
	•	Visualization: Vibe Kanban board updates during the build
	•	Voice: ElevenLabs announces milestones
	•	Diagram: Fireworks AI produces a simple system diagram
	•	UI: Minimal Next.js dashboard (optional) to display status/logs

⸻

Repo Structure

.
├─ prompts/
│  ├─ foreman_agent.prompt        # main design spec for the foreman agent itself
│  └─ demo_todo.prompt            # tiny demo app for on-stage build
├─ packages/
│  └─ foreman/
│     ├─ cli.ts                   # CLI wrapper to run a build
│     ├─ loop.ts                  # orchestration loop (pdd + integrations)
│     └─ tools/
│        ├─ pdd.ts                # spawn/collect output from pdd
│        ├─ kanban.ts             # Vibe Kanban integration
│        ├─ voice.ts              # ElevenLabs speech
│        └─ diagram.ts            # Fireworks AI diagram render
├─ apps/
│  ├─ api/convex/
│  │  ├─ schema.ts                # Convex schema: runs/tasks/specs
│  │  └─ runs.ts                  # mutations/queries for logs
│  └─ web/
│     ├─ pages/index.tsx          # tiny dashboard (optional)
│     └─ components/RunList.tsx
├─ dedalus/agent.yaml             # Dedalus agent manifest (tools, model, triggers)
├─ .env.example                   # key names used by integrations
└─ agents.md                      # this file


⸻

Prereqs
	•	macOS/Linux, Node 18+, git
	•	uv (recommended) or Python+pip
	•	pdd-cli installed
	•	Accounts/API keys (set in .env or provider vault):
	•	OPENAI_API_KEY
	•	ELEVENLABS_API_KEY
	•	FIREWORKS_API_KEY (optional)
	•	CONVEX_DEPLOYMENT / Convex env vars
	•	Any Vibe Kanban token/URL (or use the local stub)
	•	Dedalus project creds (if deploying the agent)

⸻

Install & Setup (copy/paste)

# tooling
xcode-select --install 2>/dev/null || true
curl -LsSf https://astral.sh/uv/install.sh | sh

# PDD CLI
uv tool install pdd-cli
pdd --version
pdd setup   # walk through model/keys setup as needed

# Node deps
pnpm i --prefer-offline

# Optional: Convex init (if not pre-initialized)
# npx convex dev --once

# Silence PDD root warning
export PDD_PATH="$PWD"


⸻

Environment Variables (.env.example)

OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
FIREWORKS_API_KEY=...

VIBE_KANBAN_BASE_URL=https://vibe-kanban.example/api
VIBE_KANBAN_TOKEN=...

CONVEX_DEPLOYMENT= # e.g., prod, dev
CONVEX_URL=        # if needed by your client

Tip (zsh/bash): add a tiny wrapper so your runs are consistent:

# ~/.zshrc
foreman() {
  export PDD_PATH="${PDD_PATH:-$PWD}"
  local base="${1:-foreman_agent}"
  shift || true
  pdd --local --force sync "$base" --target-coverage 80 "$@"
}


⸻

How to Run

1) Build the Foreman Agent (itself)

# Uses prompts/foreman_agent.prompt
foreman
# or, without alias:
# export PDD_PATH="$PWD"
# pdd --local --force sync foreman_agent --target-coverage 80

2) Run a Demo Build (tiny app)

# Uses prompts/demo_todo.prompt (include a minimal todo app spec)
foreman demo_todo

The CLI prints logs. If the build fails tests, re-run:

# Try a fix loop, then sync again
pdd --local fix demo_todo
pdd --local --force sync demo_todo --target-coverage 80


⸻

Dedalus Integration
	•	dedalus/agent.yaml defines:
	•	tools: pdd.run, kanban.update, convex.log, voice.say, diagram.render
	•	model: OpenAI (configurable)
	•	triggers: HTTP webhook or manual button
	•	Deploying on Dedalus makes the agent callable via a stable endpoint and manages MCP/tool wiring.

Local test (without Dedalus): run packages/foreman/cli.ts which shells out to pdd and calls integrations directly.

⸻

Convex Schema (minimal)

// apps/api/convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
export default defineSchema({
  runs: defineTable({
    specName: "string",
    startedAt: "number",
    endedAt: "number",
    status: "string",  // planning|building|testing|done|error
    summary: "string",
  }),
  tasks: defineTable({
    runId: "string",
    title: "string",
    state: "string",   // backlog|doing|done|error
    diffSummary: "string",
  }),
  specs: defineTable({
    name: "string",
    raw: "string",
    normalized: "string",
  }),
});


⸻

Vibe Kanban
	•	Columns: Backlog → Doing → Done
	•	Cards mirror tasks rows
	•	If an API isn’t available on-site, ship the included local stub (packages/foreman/tools/kanban.ts) and render the board in the web UI.

⸻

ElevenLabs Voice
	•	We send short lines on milestones:
	•	“Scaffold complete.”
	•	“Tests failed; attempting repair.”
	•	“All tests green. Build complete.”
	•	If keys are missing, fallback to console logs only.

⸻

Fireworks AI Diagram
	•	Input: list of components + edges (Foreman ↔ PDD ↔ Convex ↔ Kanban/Voice/Diagram)
	•	Output: a small PNG/SVG placed under apps/web/public/diagram.png and shown on the dashboard

⸻

OpenAI Usage
	•	Reasoning for:
	•	Normalizing freeform .md into a strict build plan
	•	Explaining test failures back to pdd fix (optional)
	•	Keep contexts small; prefer deterministic prompts
	•	If rate-limited, the loop degrades to plain pdd without analysis

⸻

Demo Flow (3–4 minutes)
	1.	Show the spec (prompts/demo_todo.prompt), very short.
	2.	Hit “Run Foreman” (or run foreman demo_todo).
	3.	Console + UI:
	•	Planning → Building → Testing
	•	Vibe board updates
	•	Voice: “Build started… Tests green.”
	4.	Launch the generated app (Next.js page, CRUD working).
	5.	Show diagram & Convex run log.
	6.	Close with: “Spec → App, using sponsors: Dedalus, Convex, OpenAI, ElevenLabs, Fireworks, Windsurf/Devin, Vibe Kanban.”

⸻

Troubleshooting
	•	No such option: --budget/--max-cost
Your PDD version doesn’t expose budget flags. Omit them. Use:

pdd --local --force sync <basename> --target-coverage 80


	•	“Could not determine project root”
Set:

export PDD_PATH="$PWD"


	•	Sync can’t find the prompt
pdd sync wants the basename (e.g., foreman_agent), not the path.
	•	Tests keep failing
Run:

pdd --local fix <basename>
pdd --local --force sync <basename> --target-coverage 80


	•	No Vibe/ELEVEN/Fireworks at venue
Keep those modules optional; the demo still works with PDD+Convex+UI.
	•	Token usage spikes
Keep prompts tiny; prefer deterministic templates; cache normalized specs in Convex.

⸻

Security & Keys
	•	Never commit .env
	•	Prefer provider secret storage if deploying on Dedalus
	•	Redact logs before demo if they include secrets

⸻

Judge Talking Points
	•	Meta-builder: turns a text spec into running software
	•	Observability: Convex logs every run, Kanban shows state
	•	Multi-modal: Voice + Visuals (diagram) + Web UI
	•	Sponsor alignment: Dedalus (orchestration), Convex (state), OpenAI (reasoning), ElevenLabs (voice), Fireworks (diagram), Windsurf/Devin (workspace), Vibe Kanban (tasks)
	•	Time-to-value: From zero to app in minutes

⸻

Appendix: Minimal Demo Prompt (prompts/demo_todo.prompt)

# GOAL
Build a minimal Todo app with Convex backend and Next.js UI.
Provide CRUD for { title, status }, tests (Vitest), and a single page that lists and creates todos.

# ARTIFACTS
- apps/api/convex/schema.ts
- apps/api/convex/todos.ts       # list/create/setStatus
- apps/web/pages/index.tsx
- tests/todos.test.ts
- package.json scripts (dev, test, build)

# CONSTRAINTS
- Keep code small and dependency-light
- Use Convex for data
- Next.js basic components only
- Provide seed script to insert 2 todos

# VERIFICATION
- `pnpm -r test` passes (≥1 unit test)
- Starting dev server renders list + add form


⸻

License/Ownership
	•	All demo code created by PDD is MIT unless otherwise specified by templates.
	•	Verify any generated license headers before publishing.

⸻
