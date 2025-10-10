# Quick Start Guide

## What Was Built

The PDD Foreman Agent project has been fully scaffolded! Here's what you have:

### Project Structure

```
.
├── packages/foreman/          # Core orchestration package
│   ├── src/
│   │   ├── cli.ts            # CLI entrypoint
│   │   ├── loop.ts           # Main orchestration loop
│   │   └── tools/
│   │       ├── pdd.ts        # PDD CLI wrapper
│   │       ├── voice.ts      # ElevenLabs TTS
│   │       ├── kanban.ts     # Vibe Kanban API
│   │       └── diagram.ts    # Fireworks AI diagrams
│   └── tests/
│       └── pdd_loop.test.ts  # Core tests
│
├── apps/api/                  # Convex backend
│   └── convex/
│       ├── schema.ts         # Database schema
│       └── runs.ts           # Run mutations/queries
│
├── apps/web/                  # Next.js dashboard
│   ├── pages/
│   │   ├── _app.tsx          # Convex provider
│   │   └── index.tsx         # Main dashboard
│   └── components/
│       └── RunList.tsx       # Run history display
│
├── dedalus/
│   └── agent.yaml            # Agent manifest
│
└── prompts/
    ├── foreman_agent_typescript.prompt  # Main spec
    └── demo_todo_typescript.prompt      # Demo app spec
```

## Next Steps

### 1. Set Up Environment Variables

Copy the example file and fill in your API keys:

```bash
cp .env.example .env
```

Edit `.env` with your actual keys:
- `OPENAI_API_KEY` (required)
- `CONVEX_URL` (required - get from Convex dashboard)
- `ELEVENLABS_API_KEY` (optional)
- `FIREWORKS_API_KEY` (optional)
- `VIBE_KANBAN_BASE_URL` and `VIBE_KANBAN_TOKEN` (optional)

### 2. Initialize Convex

```bash
cd apps/api
npx convex dev
```

This will:
- Set up your Convex deployment
- Deploy the schema
- Give you a `CONVEX_URL` to add to your `.env`

### 3. Build the Foreman Package

```bash
cd packages/foreman
pnpm build
```

This compiles the TypeScript code to `dist/`.

### 4. Run Your First Build

```bash
# From the root directory
export PDD_PATH="$PWD"
node packages/foreman/dist/cli.js build demo_todo
```

Or create a symlink for easier access:

```bash
# Make foreman CLI globally accessible
npm link packages/foreman
foreman build demo_todo
```

### 5. Start the Dashboard

```bash
cd apps/web
pnpm dev
```

Open http://localhost:3000 to see the dashboard.

## Common Commands

```bash
# Build all packages
pnpm build

# Run all tests
pnpm test

# Type check everything
pnpm typecheck

# Start all dev servers in parallel
pnpm dev

# Clean everything
pnpm clean
```

## How It Works

1. **Foreman CLI** (`packages/foreman/cli.ts`) parses your command
2. **Orchestration Loop** (`packages/foreman/loop.ts`) executes the workflow:
   - Announces "Build started" via ElevenLabs
   - Updates Kanban board to "planning"
   - Runs `pdd sync` to generate code
   - Retries with `pdd fix` if tests fail (up to 3 times)
   - Logs everything to Convex
   - Generates architecture diagram
   - Announces completion
3. **Dashboard** displays real-time build status from Convex

## Testing the Demo

```bash
# Build the demo todo app
foreman build demo_todo --budget 10 --attempts 3 --coverage 80

# Check the dashboard
open http://localhost:3000

# View Convex logs
open https://dashboard.convex.dev
```

## Troubleshooting

**"foreman: command not found"**
→ Run `npm link packages/foreman` or use the full path to the CLI

**"Module not found" errors**
→ Run `pnpm build` in `packages/foreman`

**Convex errors**
→ Make sure `npx convex dev` is running and `CONVEX_URL` is set

**PDD fails**
→ Ensure `PDD_PATH` is exported and PDD CLI is installed (`pdd --version`)

## Demo Script for Judges

1. Show `prompts/demo_todo_typescript.prompt`
2. Run `foreman build demo_todo`
3. Watch dashboard update in real-time
4. Listen for ElevenLabs voice announcements
5. Show generated app structure
6. Show Convex run logs
7. Show architecture diagram

## What's Next?

- Implement remaining test files
- Add Convex integration to the foreman loop
- Enhance error handling and retry logic
- Add more integrations (Slack webhooks, etc.)
- Deploy to production with Dedalus

## Resources

- [PDD CLI Docs](https://promptdriven.ai)
- [Convex Docs](https://docs.convex.dev)
- [Dedalus Labs](https://dedalus.dev)
- [Project README](./README.md)

---

**Built for SF Tech Week Agent Builders Hackathon 2024**
