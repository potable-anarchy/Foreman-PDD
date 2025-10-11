# 🎬 Foreman PDD Agent - Live Demo Script

## Quick Demo (3-4 minutes)

### 1. Show the Live Dashboard (30 seconds)
```bash
# Open the live dashboard
open https://foreman-pdd-web-bradtacos-projects.vercel.app
```
**Say**: "This is our live dashboard deployed on Vercel, connected to Convex for real-time state management."

---

### 2. Show the GitHub Repository (30 seconds)
```bash
# Open the GitHub repo
open https://github.com/potable-anarchy/Foreman-PDD
```
**Say**: "All code is open source. The entire project was generated using PDD - a meta-builder building itself!"

---

### 3. Show a Simple PDD Generation (2 minutes)
```bash
# Navigate to the project
cd /Users/brad/code/tries/2025-10-10-new-foreman-pdd

# Set PDD path (REQUIRED before any PDD command)
export PDD_PATH="$PWD"

# Show the spec we'll build from
cat prompts/hello_html.prompt

# Generate code from the spec
pdd --local --force sync hello --target-coverage 80

# Show the generated file
cat examples/hello.html

# Run it in the browser
open examples/hello.html
```
**Say**: "Watch PDD read this spec and generate a complete, working HTML page in seconds. From spec to working code - fully automated."

---

### 4. Show Integration Points (1 minute)
```bash
# Show Convex backend structure
ls -la apps/api/convex/

# Show voice narration code
cat packages/foreman/src/tools/voice.ts | head -30

# Show diagram generation code
cat packages/foreman/src/tools/diagram.ts | head -30

# Show the agent configuration
cat dedalus/agent.yaml
```
**Say**: "Every sponsor technology is integrated: OpenAI for generation, Convex for persistence, ElevenLabs for voice, Fireworks for diagrams, Dedalus for orchestration."

---

## Alternative: Quick Show-Only Demo (1 minute)

If you don't want to run commands, just show these URLs:

```bash
# Dashboard
open https://foreman-pdd-web-bradtacos-projects.vercel.app

# GitHub repo
open https://github.com/potable-anarchy/Foreman-PDD

# Working example
open examples/hello.html

# Show README with sponsor integrations
open https://github.com/potable-anarchy/Foreman-PDD#-for-hackathon-judges-sponsor-integration-showcase
```

---

## Pre-Demo Checklist

Before presenting, verify these work:

```bash
# 1. Check PDD is installed
which pdd

# 2. Verify browser opens files
open examples/hello.html

# 3. Test dashboard loads
curl -s https://foreman-pdd-web-bradtacos-projects.vercel.app | grep "PDD Foreman Agent"

# 4. Verify git repo is public
open https://github.com/potable-anarchy/Foreman-PDD
```

---

## Demo Talking Points

### The Meta Concept
"This is a meta-builder - an AI agent that builds software from specs. The twist? The agent itself was built using PDD. It's code generating code to generate code!"

### Sponsor Integration
- **OpenAI**: Powers all code generation (~$0.40 for 1,000+ lines)
- **Convex**: Real-time database with zero-config deployment
- **Vercel**: Instant deployment, auto-deploy on git push
- **ElevenLabs**: Voice announces milestones ("Scaffold complete", "Tests failed", "Build complete")
- **Fireworks AI**: Auto-generates system architecture diagrams
- **Dedalus Labs**: Structured agent orchestration framework
- **Vibe Kanban**: Visual task board (backlog → doing → done)
- **Windsurf**: Development environment

### Technical Highlights
- TypeScript throughout (type-safe)
- Monorepo with pnpm workspaces
- 80% test coverage target
- Real-time dashboard with live updates
- Retry logic with exponential backoff
- Cost tracking per build

### Business Value
"Turns specs into production code in minutes. What used to take hours of manual coding now happens automatically with testing, observability, and cost tracking built-in."

---

## Common Questions & Answers

**Q: Does it actually work?**
**A**: Yes! Watch me generate this hello world page right now. *[Run the demo]*

**Q: How much does it cost?**
**A**: Generated 1,000+ lines of production TypeScript for ~$0.40 total using OpenAI's API.

**Q: Can it fix its own errors?**
**A**: Yes - if tests fail, it automatically retries with the PDD fix command. Up to 3 attempts with exponential backoff.

**Q: How do you use [specific sponsor tech]?**
**A**: *[Point to the specific section in the README or show the code file]*

**Q: Is the code production-ready?**
**A**: The dashboard is live on Vercel right now. PDD generates working code with tests, but you'd still want human review for production.

---

## Backup Plan (If Live Demo Fails)

If PDD fails or network is down:

1. Show the pre-generated `examples/hello.html` file
2. Show the dashboard (should always work - it's deployed)
3. Walk through the code in GitHub
4. Show the sponsor integration section in README

---

## Post-Demo

After presenting, share:

- **GitHub**: https://github.com/potable-anarchy/Foreman-PDD
- **Live Dashboard**: https://foreman-pdd-web-bradtacos-projects.vercel.app
- **Contact**: [Your info here]

---

## Time Breakdown

| Section | Time | What to Show |
|---------|------|--------------|
| Dashboard | 30s | Live site on Vercel |
| GitHub Repo | 30s | Code structure, README |
| Live PDD Generation | 2m | Run `pdd sync hello`, show result |
| Integration Points | 1m | Show code files for each sponsor |
| **Total** | **4m** | Perfect for hackathon demos |

---

## Emergency Commands (If Things Break)

```bash
# If PDD_PATH error
export PDD_PATH="$PWD"

# If PDD not found
uv tool install pdd-cli

# If browser won't open
echo "Manual open: file:///Users/brad/code/tries/2025-10-10-new-foreman-pdd/examples/hello.html"

# If dashboard is down
echo "Show screenshot or GitHub README instead"
```

---

**Good luck with the demo! 🚀**
