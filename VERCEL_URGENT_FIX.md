# URGENT: Vercel Deployment Fix Required

## Problem Identified

Your Vercel builds are failing instantly (0ms build time) because **Vercel is looking in the wrong directory**.

The build logs show:
```
Builds: ╶ .  [0ms]
```

This means Vercel tried to build from the repository root, but your Next.js app is in `apps/web/`.

## Fix (2 minutes)

### Step 1: Go to Vercel Project Settings
1. Open: https://vercel.com/bradtacos-projects/foreman-pdd-web/settings
2. Click on **"General"** in the left sidebar

### Step 2: Configure Root Directory
1. Scroll to **"Root Directory"** section
2. Click **"Edit"**
3. Enter: `apps/web`
4. Click **"Save"**

### Step 3: Add Environment Variable
1. Click **"Environment Variables"** in left sidebar
2. Add new variable:
   - **Key**: `NEXT_PUBLIC_CONVEX_URL`
   - **Value**: `https://quixotic-meadowlark-394.convex.cloud`
   - **Environments**: Select all (Production, Preview, Development)
3. Click **"Save"**

### Step 4: Redeploy
1. Go to **"Deployments"** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**

## Alternative: Use This Vercel Configuration

If the above doesn't work, ensure your `apps/web/package.json` has:

```json
{
  "name": "@foreman/web",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

And your root `vercel.json` has:

```json
{
  "buildCommand": "cd apps/web && pnpm build",
  "outputDirectory": "apps/web/.next",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

## Expected Result

After fixing, you should see:
- ✅ Build completes in ~30-60 seconds
- ✅ Dashboard accessible at: https://foreman-pdd-web-bradtacos-projects.vercel.app
- ✅ Convex integration working
- ✅ No "Error" status

## What Went Wrong

The monorepo structure confused Vercel:
- Repository root: `/` (has package.json for workspace)
- Next.js app: `/apps/web/` (has the actual Next.js code)
- Vercel defaulted to root, found no Next.js → instant failure

The 0ms build time is the smoking gun - Vercel never even started building.
