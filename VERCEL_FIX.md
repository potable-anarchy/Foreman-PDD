# 🔧 Vercel Configuration Fix

## Problem
Vercel can't find Next.js because it's looking in the wrong directory.

## Solution

### In Vercel Dashboard:
1. Go to: https://vercel.com/bradtacos-projects/2025-10-10-new-foreman-pdd/settings
2. Click **General** → **Root Directory**
3. Set to: `apps/web`
4. Click **Save**
5. Go to **Deployments** and click **Redeploy**

### Or via CLI:
```bash
cd /Users/brad/code/tries/2025-10-10-new-foreman-pdd

# Set root directory
npx vercel link
# When prompted:
# - Link to existing project? Yes  
# - Select project: 2025-10-10-new-foreman-pdd
# - Set root directory: apps/web

# Then deploy
npx vercel --prod
```

## Environment Variables (After Deploy)

Set in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_CONVEX_URL = https://quixotic-meadowlark-394.convex.cloud
```

## Expected URLs After Fix

- **Production**: https://2025-10-10-new-foreman-pdd.vercel.app
- **Convex**: https://quixotic-meadowlark-394.convex.cloud
- **GitHub**: https://github.com/potable-anarchy/Foreman-PDD
