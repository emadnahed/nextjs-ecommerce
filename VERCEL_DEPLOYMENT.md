# Vercel Deployment Guide

## Prerequisites
✅ Build test passed locally
✅ MongoDB Atlas configured
✅ DigitalOcean Spaces configured
✅ Clerk authentication set up

## Step 1: Push to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings

## Step 3: Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

### Required Environment Variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YWNjZXB0ZWQtY3Jhd2RhZC03LmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_hAfFXft5Vr50UxGoW7WvdnxyvshayNGkdxQGr2YYDy
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Database - MongoDB Atlas
DATABASE_URL=mongodb+srv://imad_db_user:CH4PiVrTeUovcrx4@zeyrey.zeicwbq.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=zeyrey

# DigitalOcean Spaces Configuration
DO_SPACES_ENDPOINT=https://blr1.digitaloceanspaces.com
DO_SPACES_REGION=blr1
DO_SPACES_BUCKET=paymadi-ecommerce
DO_SPACES_ACCESS_KEY_ID=DO801DL4DY9UTU49F7E4
DO_SPACES_SECRET_ACCESS_KEY=8z21mga0KV5MlBxPue0A/xcSMAt85UfUJKv7iDrHibw
DO_SPACES_CDN_URL=https://paymadi-ecommerce.blr1.cdn.digitaloceanspaces.com

# Admin Whitelist
ADMIN_EMAILS=imad@paymadi.com,emaadnahed@gmail.com

# Cashfree Payment (Optional)
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
CASHFREE_ENV=TEST

# Environment
NODE_ENV=production
```

## Step 4: Deploy

1. Click **"Deploy"** in Vercel
2. Wait for build to complete (2-3 minutes)
3. Once deployed, you'll get a URL like `your-app.vercel.app`

## Step 5: Update Clerk Redirect URLs

1. Go to Clerk Dashboard
2. Update allowed redirect URLs to include your Vercel domain:
   - `https://your-app.vercel.app/*`

## Step 6: Test Your Deployment

Visit your deployed site and test:
- ✅ Homepage loads with products
- ✅ Sign in/Sign up works
- ✅ Admin panel accessible (for whitelisted emails)
- ✅ Product images load from DigitalOcean Spaces
- ✅ Cart functionality works
- ✅ Payment flow works

## Troubleshooting

### Build Fails
- Check environment variables are set correctly
- Ensure MongoDB connection string is correct
- Check Vercel build logs for specific errors

### Images Not Loading
- Verify DigitalOcean Spaces credentials
- Check `next.config.js` has correct image domains
- Ensure images are public in DigitalOcean Spaces

### Authentication Issues
- Update Clerk redirect URLs to include Vercel domain
- Verify Clerk API keys are correct
- Check ADMIN_EMAILS includes your email

### Database Connection Issues
- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check DATABASE_URL is correct
- Ensure database user has proper permissions

## Post-Deployment

1. **Set Custom Domain** (Optional)
   - In Vercel Dashboard → Settings → Domains
   - Add your custom domain

2. **Monitor Performance**
   - Check Vercel Analytics
   - Monitor MongoDB Atlas metrics

3. **Enable Production Mode for Clerk**
   - Switch from test keys to production keys
   - Update Cashfree to PROD mode when ready

## Success Checklist

- [ ] Application deployed successfully
- [ ] All 128 products visible
- [ ] Images loading from DigitalOcean Spaces
- [ ] Authentication works
- [ ] Admin panel accessible
- [ ] Cart and checkout functional
- [ ] Custom domain configured (optional)

---

**Your E-commerce Store is Live! 🎉**

Deployment URL: `https://your-app.vercel.app`
