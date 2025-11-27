# Deployment Configuration Fix

## Issues Found & Fixed

### 1. ✅ SprintNxt Partner Key - **CRITICAL**
**Problem:** Trailing backslash in `SPRINTNXT_PARTNER_KEY`

**In CapRover, change:**
```bash
SPRINTNXT_PARTNER_KEY=NXTU4583807D5918\
```

**To:**
```bash
SPRINTNXT_PARTNER_KEY=NXTU4583807D5918
```

### 2. ✅ Docker Build Configuration - **UPDATED**
**Problem:** `NEXT_PUBLIC_*` environment variables weren't available during Docker build

**Fix Applied:** Updated `Dockerfile` to accept build arguments for all Next.js public environment variables.

### 3. ⚠️ GitHub Secrets Required
You need to add these secrets to your GitHub repository for the workflow to work:

**Go to:** `https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions`

**Add these secrets:**
- `NEXT_PUBLIC_API_URL` = `https://www.zeyrey.online`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = `pk_live_Y2xlcmsuemV5cmV5Lm9ubGluZSQ`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` = `/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL` = `/sign-up`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` = `/`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` = `/`

## Summary of Environment Variables Status

| Variable | CapRover | GitHub Secret | Status |
|----------|----------|---------------|--------|
| `NEXT_PUBLIC_API_URL` | ✅ | ❓ Need to add | Set to: `https://www.zeyrey.online` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ | ❓ Need to add | Set to: `pk_live_Y2xlcmsuemV5cmV5Lm9ubGluZSQ` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | ✅ | ❓ Need to add | Set to: `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | ✅ | ❓ Need to add | Set to: `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | ✅ | ❓ Need to add | Set to: `/` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | ✅ | ❓ Need to add | Set to: `/` |
| `CLERK_SECRET_KEY` | ✅ | ✅ Already set | Runtime only |
| `DATABASE_URL` | ✅ | ✅ Already set | Runtime only |
| `DO_SPACES_*` | ✅ | ✅ Already set | Runtime only |
| `SPRINTNXT_*` | ⚠️ Fix backslash | N/A | Runtime only |

## Deployment Steps

### Step 1: **CRITICAL** - Fix CapRover Environment Variables
**THIS MUST BE DONE BEFORE DEPLOYING**

1. Go to: https://captain.rupeestack.com/#/apps/details/zeyrey
2. Click on "App Configs" tab
3. Scroll to "Environmental Variables" section
4. Find `SPRINTNXT_PARTNER_KEY`
5. **Remove the trailing backslash `\` from the end**
   - Current: `NXTU4583807D5918\`
   - Should be: `NXTU4583807D5918`
6. Click "Save & Update"
7. **Wait for the app to restart** before deploying new code

### Step 2: Add GitHub Secrets
1. Go to your GitHub repository settings
2. Navigate to Settings → Secrets and variables → Actions
3. Add each of the `NEXT_PUBLIC_*` secrets listed above
4. Use the values from your CapRover environment variables

### Step 3: Deploy
After making these changes, commit and push the updated files:

```bash
git add Dockerfile .github/workflows/deploy.yml
git commit -m "fix: configure build-time environment variables for Next.js"
git push origin main
```

The GitHub Action will automatically:
1. Build Docker image with the correct environment variables
2. Push to GitHub Container Registry
3. Deploy to CapRover

## Why These Changes Are Needed

### Build-time vs Runtime Environment Variables

**Build-time (Docker build):**
- `NEXT_PUBLIC_*` variables are baked into the JavaScript bundle
- Required during `npm run build`
- Passed as Docker build arguments

**Runtime (Container execution):**
- All other secrets (database, API keys, etc.)
- Set in CapRover environment variables
- Available when container runs

### The localhost:3000 in Logs is NORMAL
The logs showing `Local: http://localhost:3000` are expected. This is the Next.js server running **inside** the Docker container. CapRover's reverse proxy maps this to `https://www.zeyrey.online` for external access.

## What Was Fixed

### Issue #1: SprintNxt Authentication Failure
- **Problem:** Trailing backslash in `SPRINTNXT_PARTNER_KEY`
- **Impact:** All SprintNxt API calls were failing authentication
- **Fix:** Remove the `\` from the environment variable value

### Issue #2: Missing Application Logs
- **Problem:** Console.log statements not appearing in CapRover logs
- **Impact:** Can't debug payment issues or API errors
- **Fix:** Added custom entrypoint script (`docker-entrypoint.sh`) to force unbuffered output

### Issue #3: Build-Time Environment Variables
- **Problem:** `NEXT_PUBLIC_*` variables not available during Docker build
- **Impact:** API URLs might be wrong during server-side rendering
- **Fix:** Pass build args via GitHub Actions workflow

## Verification

After deployment, check:

1. **Application logs are visible:**
   ```
   [SprintNxt] ========== CREATE PAYMENT ==========
   [getAllProducts] NEXT_PUBLIC_API_URL: https://www.zeyrey.online
   ```

2. **SprintNxt works:**
   - No "SprintNxt is not configured" errors
   - QR codes generate successfully
   - Payment verification works

3. **Application loads:**
   - Visit https://www.zeyrey.online
   - No console errors about API URLs
   - Images and data load correctly

## Troubleshooting Logs

If you still don't see application logs after deployment:

1. **Check that the deployment completed successfully**
   - Go to GitHub Actions and verify the workflow passed
   - Check CapRover shows "Ready" status

2. **Trigger an API call to generate logs**
   - Visit https://www.zeyrey.online
   - Add a product to cart
   - Go to checkout
   - You should now see `[SprintNxt]` logs in CapRover

3. **Refresh the CapRover logs view**
   - Click "Logs" tab in CapRover
   - Scroll to the bottom for latest logs
   - Look for timestamps matching your API calls
