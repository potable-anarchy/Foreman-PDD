# 🏗️ Foreman PDD Agent

**A meta-builder that orchestrates Prompt-Driven Development (PDD) to generate working software from specifications.**

Built for the SF Tech Week Agent Builders Hackathon. This agent was built **using PDD itself** - the ultimate meta achievement! 🎯

## 🎪 The Meta-Builder Concept

Foreman reads `.prompt` files and orchestrates PDD to:
1. Generate code from specifications
2. Run tests automatically
3. Fix failures with retry logic
4. Track costs and progress
5. Provide real-time observability

**The twist**: Foreman itself was generated using PDD from the spec in `prompts/foreman_agent.prompt`!

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm
- [PDD CLI](https://github.com/promptdriven-ai/pdd-cli): `uv tool install pdd-cli`

### Installation

```bash
pnpm install
```

### Run the Dashboard

```bash
cd apps/web
pnpm dev
# Open http://localhost:3000
```

### Run a Build

```bash
cd packages/foreman
node dist/cli.js build <spec-name>

# Example:
node dist/cli.js build demo_todo --budget 10 --attempts 3
```

## 🏆 Features

### Core Capabilities
- ✅ **Orchestration Loop** - Coordinates PDD execution with retry logic
- ✅ **Real-time Dashboard** - Next.js UI with live Convex updates
- ✅ **Voice Announcements** - ElevenLabs TTS for milestone narration
- ✅ **Task Tracking** - Vibe Kanban integration (or local stub)
- ✅ **Architecture Diagrams** - Fireworks AI visualization
- ✅ **Cost Tracking** - Per-attempt and total cost monitoring
- ✅ **Graceful Degradation** - Works without API keys

### Tech Stack
- **Runtime**: Dedalus Agent Framework
- **Backend**: Convex (real-time state & persistence)
- **Frontend**: Next.js 14 + React
- **LLM**: OpenAI (via PDD)
- **Voice**: ElevenLabs
- **Diagrams**: Fireworks AI
- **Tasks**: Vibe Kanban

## 📁 Project Structure

```
.
├── packages/foreman/          # Core orchestration package
│   ├── src/
│   │   ├── cli.ts            # CLI entrypoint
│   │   ├── loop.ts           # Main orchestration loop
│   │   └── tools/            # Integration tools (PDD, voice, etc.)
│   └── dist/                 # Compiled TypeScript
├── apps/
│   ├── api/                  # Convex backend
│   │   └── convex/
│   │       ├── schema.ts     # Database schema
│   │       └── runs.ts       # Mutations/queries
│   └── web/                  # Next.js dashboard
│       └── src/
│           ├── pages/
│           └── components/
├── prompts/                   # PDD specification files
│   ├── foreman_agent.prompt  # Meta! The agent's own spec
│   └── *.prompt              # Component specs
└── dedalus/
    └── agent.yaml            # Dedalus agent configuration
```

## 💰 Generation Cost

All 11 components were generated with PDD for **~$0.40 total**:
- foreman_cli: $0.027
- foreman_loop: $0.119
- pdd_tool: $0.030
- voice_tool: $0.011
- kanban_tool: $0.020
- diagram_tool: $0.013
- convex_schema: $0.010
- convex_functions: $0.010
- nextjs_dashboard: $0.055
- nextjs_app: $0.011
- runlist_component: $0.054

## 🔧 Configuration

### Environment Variables

```bash
# Required for Convex
CONVEX_DEPLOYMENT=your-deployment
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Optional integrations
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
FIREWORKS_API_KEY=...
VIBE_KANBAN_BASE_URL=...
VIBE_KANBAN_TOKEN=...

# PDD
PDD_PATH=/path/to/project
```

### PDD Setup

```bash
# Install PDD
uv tool install pdd-cli

# Configure models and API keys
pdd setup
```

## 📊 How It Works

1. **Input**: Create a `.prompt` file with your spec
2. **Orchestration**: Foreman reads the spec and calls PDD
3. **Generation**: PDD generates code + tests
4. **Validation**: Tests run automatically
5. **Retry**: If tests fail, PDD fixes and retries (up to max attempts)
6. **Observability**: All state logged to Convex, displayed in dashboard
7. **Output**: Working code with full history

### Retry Logic

```typescript
for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  const command = attempt === 1 ? 'sync' : 'fix';
  const result = await executePDD({ command, specName, budget, targetCoverage });
  
  if (result.testsPass) {
    await generateDiagram(specName);
    return { success: true, ... };
  }
  
  if (attempt < maxAttempts) {
    await delay(exponentialBackoff(attempt));
  }
}
```

## 🎯 Sponsor Integrations

- **Dedalus Labs** - Agent runtime & orchestration
- **Convex** - Real-time backend & state
- **OpenAI** - LLM inference (via PDD)
- **ElevenLabs** - Voice milestone announcements
- **Fireworks AI** - System architecture diagrams
- **Vibe Kanban** - Task board visualization
- **Windsurf** - Development environment

## 📖 Documentation

- [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md) - Full deployment guide
- [TEST_RESULTS.md](./TEST_RESULTS.md) - Test results and demo strategies
- [CLAUDE.md](./CLAUDE.md) - Claude Code assistant instructions

## 🐛 Known Issues

1. **PDD Sync**: `pdd sync` fails in some environments (missing CSV files)
   - **Workaround**: Use `pdd generate` directly
2. **Convex Init**: Requires interactive setup once
3. **API Keys**: Voice/diagram features need API keys (graceful degradation)

## 🚧 Roadmap

- [ ] Mock PDD mode for demos
- [ ] Streaming build logs to dashboard  
- [ ] CLI progress bars
- [ ] Test coverage visualization
- [ ] Deploy to Vercel/Railway
- [ ] Plugin architecture for PDD alternatives

## 🏅 Hackathon Achievement

**Meta-Builder Award**: Successfully used PDD to build a PDD orchestration agent!

- **Lines of Code Generated**: ~1,000+
- **Build Time**: ~2 hours
- **Total Cost**: $0.40
- **TypeScript Errors**: 0
- **Components Built**: 11

## 📄 License

MIT

## 🙏 Acknowledgments

Built for the SF Tech Week $33K Agent Builders Hackathon. Special thanks to all sponsor companies for their amazing tools and APIs!

---

**Built with ❤️ using PDD to build PDD orchestration** 🚀
