# Build Guide - Using PDD to Generate the Foreman Agent

## Overview

This project uses **PDD (Prompt-Driven Development)** to generate all source code from design specifications. Instead of manually writing code, we've created detailed `.prompt` files that PDD will use to generate the actual TypeScript implementations.

## Prompt Files Created

All prompt files are in `prompts/` with the `_typescript.prompt` suffix:

### Core Foreman Package
1. **foreman_cli_typescript.prompt** → `packages/foreman/src/cli.ts`
   - CLI entrypoint with Commander
   - Argument parsing
   - Main command handler

2. **foreman_loop_typescript.prompt** → `packages/foreman/src/loop.ts`
   - Main orchestration logic
   - Retry mechanism
   - Integration coordination

3. **pdd_tool_typescript.prompt** → `packages/foreman/src/tools/pdd.ts`
   - PDD CLI subprocess wrapper
   - Output streaming and parsing

4. **voice_tool_typescript.prompt** → `packages/foreman/src/tools/voice.ts`
   - ElevenLabs TTS integration
   - Graceful degradation

5. **kanban_tool_typescript.prompt** → `packages/foreman/src/tools/kanban.ts`
   - Vibe Kanban API integration
   - Local stub fallback

6. **diagram_tool_typescript.prompt** → `packages/foreman/src/tools/diagram.ts`
   - Fireworks AI diagram generation
   - ASCII art fallback

### Convex Backend
7. **convex_schema_typescript.prompt** → `apps/api/convex/schema.ts`
   - Database schema definition
   - runs, tasks, specs tables

8. **convex_functions_typescript.prompt** → `apps/api/convex/runs.ts`
   - Mutations and queries
   - CRUD operations

### Next.js Dashboard
9. **nextjs_dashboard_typescript.prompt** → `apps/web/pages/*.tsx` + `components/*.tsx`
   - Dashboard UI
   - RunList component
   - Convex integration

### Demo App
10. **demo_todo_typescript.prompt** → Complete demo todo app
    - For live demonstrations

## How to Generate Code with PDD

### Option 1: Generate All Components Individually

```bash
export PDD_PATH="$PWD"

# Generate Foreman CLI
cd packages/foreman/src
pdd --local --force sync foreman_cli --target-coverage 80

# Generate orchestration loop
pdd --local --force sync foreman_loop --target-coverage 80

# Generate PDD tool wrapper
cd tools
pdd --local --force sync pdd_tool --target-coverage 80

# Generate voice integration
pdd --local --force sync voice_tool --target-coverage 80

# Generate kanban integration
pdd --local --force sync kanban_tool --target-coverage 80

# Generate diagram generator
pdd --local --force sync diagram_tool --target-coverage 80

# Generate Convex schema
cd ../../../apps/api/convex
pdd --local --force sync convex_schema --target-coverage 80

# Generate Convex functions
pdd --local --force sync convex_functions --target-coverage 80

# Generate Next.js dashboard
cd ../../web
pdd --local --force sync nextjs_dashboard --target-coverage 80
```

### Option 2: Use a Build Script

Create a script that runs all PDD commands in sequence:

```bash
#!/bin/bash
# build-all.sh

set -e
export PDD_PATH="$PWD"

echo "🏗️  Building Foreman Agent with PDD..."

PROMPTS=(
  "foreman_cli"
  "foreman_loop"
  "pdd_tool"
  "voice_tool"
  "kanban_tool"
  "diagram_tool"
  "convex_schema"
  "convex_functions"
  "nextjs_dashboard"
)

for prompt in "${PROMPTS[@]}"; do
  echo ""
  echo "📋 Generating $prompt..."
  pdd --local --force sync "$prompt" --target-coverage 80
  
  if [ $? -eq 0 ]; then
    echo "✅ $prompt generated successfully"
  else
    echo "❌ $prompt failed"
    exit 1
  fi
done

echo ""
echo "🎉 All components generated successfully!"
```

### Option 3: Generate One at a Time (Recommended for Debugging)

Start with the simplest components first:

```bash
export PDD_PATH="$PWD"

# 1. Start with tools (no dependencies)
pdd --local --force sync pdd_tool --target-coverage 80
pdd --local --force sync voice_tool --target-coverage 80
pdd --local --force sync kanban_tool --target-coverage 80
pdd --local --force sync diagram_tool --target-coverage 80

# 2. Build the loop (depends on tools)
pdd --local --force sync foreman_loop --target-coverage 80

# 3. Build the CLI (depends on loop)
pdd --local --force sync foreman_cli --target-coverage 80

# 4. Build Convex backend
pdd --local --force sync convex_schema --target-coverage 80
pdd --local --force sync convex_functions --target-coverage 80

# 5. Build Next.js dashboard (depends on Convex)
pdd --local --force sync nextjs_dashboard --target-coverage 80
```

## Expected Output Locations

After PDD generates the code:

```
packages/foreman/src/
├── cli.ts                    # from foreman_cli_typescript.prompt
├── loop.ts                   # from foreman_loop_typescript.prompt
└── tools/
    ├── pdd.ts               # from pdd_tool_typescript.prompt
    ├── voice.ts             # from voice_tool_typescript.prompt
    ├── kanban.ts            # from kanban_tool_typescript.prompt
    └── diagram.ts           # from diagram_tool_typescript.prompt

apps/api/convex/
├── schema.ts                # from convex_schema_typescript.prompt
└── runs.ts                  # from convex_functions_typescript.prompt

apps/web/
├── pages/
│   ├── _app.tsx            # from nextjs_dashboard_typescript.prompt
│   └── index.tsx           # from nextjs_dashboard_typescript.prompt
└── components/
    └── RunList.tsx          # from nextjs_dashboard_typescript.prompt
```

## Troubleshooting PDD Generation

### "No prompt files found"
- Make sure you're in the right directory
- PDD looks for `prompts/<basename>_<language>.prompt`
- Check that `PDD_PATH` is set correctly

### "Tests failing"
- Run `pdd --local fix <basename>` to attempt auto-repair
- Then re-run `pdd --local --force sync <basename>`

### "Module not found" errors
- Some components depend on others being generated first
- Follow the dependency order in Option 3 above

### Cost concerns
- Each component should cost $1-5 to generate
- Total project: ~$20-50
- Use `--budget` flag to set limits

## After Generation

Once PDD has generated all the code:

1. **Build TypeScript:**
   ```bash
   cd packages/foreman
   pnpm build
   ```

2. **Initialize Convex:**
   ```bash
   cd apps/api
   npx convex dev
   ```

3. **Run tests:**
   ```bash
   pnpm -r test
   ```

4. **Start dashboard:**
   ```bash
   cd apps/web
   pnpm dev
   ```

5. **Try a build:**
   ```bash
   ./foreman.sh demo_todo
   ```

## Key Differences from Manual Coding

✅ **Advantages:**
- Consistent code style
- Automatic test generation
- Documentation included
- 80% test coverage enforced

⚠️ **Considerations:**
- Generation can take 5-15 minutes per component
- May need to iterate with `pdd fix` if tests fail
- AI-generated code may need manual review
- Cost accumulates across all components

## Next Steps

1. Generate all components using one of the options above
2. Review generated code for correctness
3. Run tests and fix any issues
4. Set up environment variables
5. Test the full workflow with demo_todo

## Questions?

- Check PDD docs: https://promptdriven.ai
- See QUICKSTART.md for setup details
- See README.md for project overview
