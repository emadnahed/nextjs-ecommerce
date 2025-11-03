# 🚀 Production Deployment Guide

Complete guide to deploying your Next.js e-commerce platform to production.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Admin Access Configuration](#admin-access-configuration)
6. [Payment Gateway Setup](#payment-gateway-setup)
7. [Image Storage](#image-storage)
8. [Deployment Options](#deployment-options)
9. [Post-Deployment](#post-deployment)
10. [Troubleshooting](#troubleshooting)

---

## Overview

Your e-commerce platform now includes:
- ✅ MongoDB image storage (no S3 required)
- ✅ Email-based admin whitelist
- ✅ COD (Cash on Delivery) support
- ✅ Cashfree payment gateway
- ✅ Bulk product import/export
- ✅ Clerk authentication
- ✅ Flexible payment architecture

---

## Pre-Deployment Checklist

### Required Services
- [ ] MongoDB database (Atlas recommended for production)
- [ ] Clerk account for authentication
- [ ] Cashfree account (if using online payments)
- [ ] Domain name (optional but recommended)

### Code Preparation
- [ ] All environment variables configured
- [ ] Database schema pushed (`npx prisma db push`)
- [ ] Admin emails configured
- [ ] Products imported/ready
- [ ] Payment methods tested

---

## Environment Configuration

### 1. Create Production `.env`

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://yourdomain.com

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_live_xxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# MongoDB Database
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority

# Admin Whitelist (comma-separated emails)
ADMIN_EMAILS=admin@yourdomain.com,owner@yourdomain.com

# Cashfree Payment Gateway
CASHFREE_APP_ID=your_production_app_id
CASHFREE_SECRET_KEY=your_production_secret_key
CASHFREE_ENV=PROD

# Environment
NODE_ENV=production
```

### 2. Environment Variables Explanation

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Your production domain | Yes |
| `CLERK_*` | Clerk authentication keys | Yes |
| `DATABASE_URL` | MongoDB connection string | Yes |
| `ADMIN_EMAILS` | Comma-separated admin emails | Yes |
| `CASHFREE_*` | Cashfree payment credentials | If using Cashfree |

---

## Database Setup

### 1. MongoDB Atlas Setup

1. **Create Account**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Create Cluster**: Choose your region (preferably close to users)
3. **Create Database User**: Set username and password
4. **Whitelist IP**: Add `0.0.0.0/0` for production (or specific IPs)
5. **Get Connection String**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/ecommerce
   ```

### 2. Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Optional: Seed with sample data
npm run db:seed
```

---

## Admin Access Configuration

### How Admin Access Works

The system uses an **email whitelist** stored in `ADMIN_EMAILS` environment variable.

### Setting Up Admins

1. Add admin emails to `.env`:
   ```bash
   ADMIN_EMAILS=admin@example.com,owner@example.com,manager@example.com
   ```

2. Users must:
   - Sign up/Sign in with Clerk
   - Have their email in the whitelist
   - Access `/admin` routes

### Access Flow
```
User visits /admin
→ Clerk auth check
→ Email whitelist check
→ Access granted/denied
```

---

## Payment Gateway Setup

### Supported Payment Methods

1. **COD (Cash on Delivery)** - Always available, no configuration needed
2. **Cashfree** - Requires account and credentials

### COD Configuration

COD is enabled by default. Orders are marked as "pending" and admins can verify payment manually in the admin panel.

### Cashfree Configuration

1. **Create Account**: [Cashfree Dashboard](https://www.cashfree.com/)
2. **Get Credentials**:
   - App ID
   - Secret Key
3. **Set Environment**:
   - `TEST` for sandbox
   - `PROD` for production
4. **Configure Webhooks**:
   - URL: `https://yourdomain.com/api/payment/webhook/cashfree`
   - Events: Payment success, Payment failed

### Testing Payments

```bash
# Test payment methods endpoint
curl https://yourdomain.com/api/payment/methods

# Should return:
{
  "methods": [
    { "method": "cod", "name": "Cash on Delivery", "available": true },
    { "method": "cashfree", "name": "Cashfree", "available": true }
  ]
}
```

---

## Image Storage

### MongoDB Image Storage

All images are stored in MongoDB as base64-encoded data:

**Advantages:**
- No external storage needed
- Simple deployment
- No S3 costs

**Limitations:**
- Best for < 16MB images
- Slightly slower than CDN

### Image Upload Limits

```javascript
// Recommended image sizes:
- Product images: < 2MB
- Thumbnails: < 500KB
- Max resolution: 2000x2000px
```

### Optimizing Images Before Upload

Use tools to compress images:
- [TinyPNG](https://tinypng.com/)
- [ImageOptim](https://imageoptim.com/)
- [Squoosh](https://squoosh.app/)

---

## Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel:**
- Zero configuration
- Automatic HTTPS
- Built for Next.js
- Free tier available

**Steps:**

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Add Environment Variables**:
   - Go to Vercel Dashboard
   - Project Settings → Environment Variables
   - Add all variables from `.env`

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### Option 2: Custom Server (VPS/AWS/DigitalOcean)

**Requirements:**
- Node.js 18+
- PM2 for process management
- Nginx for reverse proxy

**Steps:**

1. **Setup Server**:
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2
   sudo npm install -g pm2
   ```

2. **Deploy Application**:
   ```bash
   # Clone repository
   git clone your-repo-url
   cd nextjs-ecommerce

   # Install dependencies
   npm install

   # Build
   npm run build

   # Start with PM2
   pm2 start npm --name "ecommerce" -- start
   pm2 save
   pm2 startup
   ```

3. **Configure Nginx**:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **SSL Certificate** (using Let's Encrypt):
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

### Option 3: Docker

**Dockerfile** (create in root):
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**Deploy:**
```bash
docker build -t ecommerce-app .
docker run -p 3000:3000 --env-file .env ecommerce-app
```

---

## Post-Deployment

### 1. Import Products

Three ways to add products:

**A. Admin UI (Manual)**
- Go to `/admin/products`
- Click "Create Product"
- Add details and images

**B. Bulk Import (CSV)**
- Go to `/admin/products/import-export`
- Download template
- Fill with your products
- Upload CSV

**C. Bulk Import (JSON)**
- Create JSON file with product data
- Upload via import page

### 2. Configure Clerk

1. **Add Production Domain**:
   - Clerk Dashboard → Domains
   - Add your production URL

2. **Customize Auth Pages**:
   - Appearance → Customize
   - Match your brand colors

### 3. Test Critical Flows

- [ ] User signup/login
- [ ] Admin access
- [ ] Product browsing
- [ ] Add to cart
- [ ] COD checkout
- [ ] Cashfree checkout (if enabled)
- [ ] Order confirmation

### 4. Set Up Monitoring

**Recommended Tools:**
- [Sentry](https://sentry.io/) - Error tracking
- [Google Analytics](https://analytics.google.com/) - User analytics
- [Vercel Analytics](https://vercel.com/analytics) - Performance

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed

**Error**: `MongoServerError: Authentication failed`

**Solution**:
- Check `DATABASE_URL` is correct
- Verify MongoDB user credentials
- Whitelist IP addresses in MongoDB Atlas

#### 2. Admin Access Denied

**Error**: Redirected to `/access-denied`

**Solution**:
- Ensure your email is in `ADMIN_EMAILS`
- Check for typos/extra spaces
- Email must match Clerk account email exactly

#### 3. Images Not Loading

**Error**: 404 on `/api/images/[id]`

**Solution**:
- Run `npx prisma generate`
- Check Image model exists in database
- Verify images were uploaded correctly

#### 4. Cashfree Payments Failing

**Error**: `Cashfree is not configured`

**Solution**:
- Verify `CASHFREE_APP_ID` and `CASHFREE_SECRET_KEY`
- Check `CASHFREE_ENV` is set correctly
- Test credentials in Cashfree dashboard

#### 5. Build Errors

**Error**: `Module not found` or TypeScript errors

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Regenerate Prisma client
npx prisma generate

# Rebuild
npm run build
```

---

## Performance Optimization

### 1. Image Optimization

- Compress images before upload
- Use WebP format when possible
- Implement lazy loading on frontend

### 2. Database Indexing

Already configured in `schema.prisma`:
- Product searches by type, gender
- Order lookups by ID
- Size relationships

### 3. Caching Strategy

```javascript
// API Routes - Add cache headers
export async function GET(request) {
  const data = await fetchData();
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
    }
  });
}
```

---

## Security Checklist

- [ ] Environment variables not committed to Git
- [ ] MongoDB IP whitelist configured
- [ ] Clerk production keys used
- [ ] Cashfree webhook signature verification enabled
- [ ] HTTPS enabled (SSL certificate)
- [ ] Rate limiting on API routes (recommended)
- [ ] CORS configured for production domain only

---

## Maintenance

### Regular Tasks

**Weekly:**
- Review orders
- Check payment statuses
- Monitor error logs

**Monthly:**
- Database backup
- Update dependencies: `npm audit fix`
- Review analytics

**As Needed:**
- Add new products
- Update admin whitelist
- Scale database/server

---

## Support & Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Clerk Docs](https://clerk.com/docs)
- [Cashfree Docs](https://docs.cashfree.com/)

### Getting Help

1. Check troubleshooting section above
2. Review logs: `pm2 logs` or Vercel logs
3. Check GitHub issues
4. MongoDB Atlas support

---

## 🎉 You're Ready!

Your production-ready e-commerce platform includes:

- ✅ Secure admin access
- ✅ Multiple payment options
- ✅ MongoDB image storage
- ✅ Bulk product management
- ✅ Full authentication
- ✅ Scalable architecture

**Next Steps:**
1. Add your products
2. Test all features
3. Launch and start selling!

Good luck with your e-commerce business! 🛍️
