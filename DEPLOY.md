# 🚀 Deployment Guide

## Quick Deploy to Vercel

### Option 1: Vercel Dashboard (Easiest)
1. Go to https://vercel.com/new
2. Import from GitHub: https://github.com/potable-anarchy/Foreman-PDD
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `cd ../.. && pnpm install && cd apps/web && pnpm build`
   - **Output Directory**: `.next`
4. Add Environment Variable:
   - `NEXT_PUBLIC_CONVEX_URL` = `https://quixotic-meadowlark-394.convex.cloud`
5. Click **Deploy**

### Option 2: Vercel CLI
```bash
cd /Users/brad/code/tries/2025-10-10-new-foreman-pdd

# Login to Vercel
npx vercel login

# Deploy
npx vercel --prod

# Follow the prompts:
# - Link to existing project? No
# - Project name: foreman-pdd
# - Directory: apps/web
```

Then set the environment variable:
```bash
npx vercel env add NEXT_PUBLIC_CONVEX_URL production
# Enter: https://quixotic-meadowlark-394.convex.cloud
```

## Convex Backend (Already Deployed)

✅ Convex is already deployed at:
- **Dev**: https://quixotic-meadowlark-394.convex.cloud
- **Dashboard**: Run `cd apps/api && npx convex dashboard`

## Test Locally First

```bash
# Terminal 1 - Start dashboard
cd apps/web
pnpm dev
# Opens at http://localhost:3000

# Terminal 2 - Run a build
cd packages/foreman  
export PDD_PATH="/Users/brad/code/tries/2025-10-10-new-foreman-pdd"
node dist/cli.js build demo_todo
```

## After Deployment

Your live URLs will be:
- **Dashboard**: https://foreman-pdd.vercel.app (or your custom domain)
- **Convex**: https://quixotic-meadowlark-394.convex.cloud
- **GitHub**: https://github.com/potable-anarchy/Foreman-PDD

## Troubleshooting

**Build fails on Vercel:**
- Ensure Root Directory is set to `apps/web`
- Check that `NEXT_PUBLIC_CONVEX_URL` environment variable is set
- Verify pnpm workspace setup

**Dashboard shows no data:**
- Check Convex deployment is running
- Verify environment variable is correct
- Open browser console for errors

**PDD commands fail:**
- This is expected in demo mode (see TEST_RESULTS.md)
- Show the infrastructure and generated code instead
- Use pre-generated files for demo
