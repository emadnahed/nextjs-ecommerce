# 🛍️ E-Commerce Setup Guide - ZEYREY Style

## 📋 What's Been Done

Your e-commerce platform has been completely restructured to match the ZEYREY clothing store model:

### ✅ Completed Changes:

1. **Database Schema**
   - ❌ Removed Categories & Billboards
   - ✅ Added Clothing-Specific Fields:
     - `type` (T-Shirt, Hoodie, Shirt, Dashiki, Blouse, etc.)
     - `gender` (Men, Women, Unisex)
     - `colors` (Array of colors - supports multiple variants)
     - `material` (Cotton, Cotton Blend, Linen, etc.)
     - `salePrice` (Calculated sale price when discount applied)
     - `sku` (Stock Keeping Unit for inventory)
     - `inStock` (boolean)

2. **Image Storage - Flexible System**
   - ✅ **Local Storage** (Development): `/public/uploads/products/`
   - ✅ **AWS S3** (Production): Full cloud support
   - ✅ **Automatic Switching**: Set `USE_S3_STORAGE=true/false` in `.env`
   - No vendor lock-in!

3. **Admin Panel**
   - ✅ Updated Add Product form with clothing fields
   - ✅ Updated Edit Product form with clothing fields
   - ✅ Removed category/billboard management
   - ✅ Simplified navigation menu

4. **API Routes**
   - ✅ Updated `/api/product` for clothing products
   - ✅ Updated `/api/product/edit/[id]`
   - ✅ Created `/api/product/type/[id]` (filter by type)
   - ✅ Removed category/billboard endpoints

---

## 🚀 Getting Started

### **Step 1: Install Dependencies**

```bash
npm install
# or
yarn install
```

This will install the new `tsx` package needed for seeding.

---

### **Step 2: Configure Environment**

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

**Required Settings:**

```env
# Database - MongoDB Connection
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority

# File Storage (false for local, true for AWS S3)
USE_S3_STORAGE=false

# Stripe (for payments)
STRIPE_API_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

**Optional - AWS S3 (only if USE_S3_STORAGE=true):**

```env
NEXT_PUBLIC_AWS_S3_REGION=eu-north-1
NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID=your_access_key_id
NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY=your_secret_access_key
NEXT_PUBLIC_AWS_S3_BUCKET_NAME=your-bucket-name
```

**Optional - Clerk Authentication:**

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

---

### **Step 3: Generate Prisma Client & Push Schema**

```bash
npx prisma generate
npx prisma db push
```

This syncs your database with the schema.

---

### **Step 4: Seed the Database**

This will create:
- 7 standard sizes (XS, S, M, L, XL, XXL, XXXL)
- 12 sample ZEYREY-style products with multiple color variants

```bash
npm run db:seed
# or
yarn db:seed
```

**Expected Output:**
```
🌱 Starting database seed...
Creating sizes...
✓ Created 7 sizes
Creating sample products...
✓ Created product: Classic Cotton T-Shirt
✓ Created product: Oversized Graphic T-Shirt
...
✅ Seed completed successfully!

📊 Summary:
   - Total Products: 12
   - Featured Products: 9
   - Total Sizes: 7
   - Product Types: T-Shirt, Shirt, Blouse, Hoodie, Dashiki
```

---

### **Step 5: Start the Development Server**

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🎛️ Admin Panel Access

### **Admin Routes:**

- **Dashboard:** `/admin`
- **Products:** `/admin/products`
- **Add Product:** `/admin/products/new`
- **Edit Product:** `/admin/products/[productId]`
- **Sizes:** `/admin/sizes`
- **Orders:** `/admin/orders`
- **Users:** `/admin/users`
- **Settings:** `/admin/settings`

### **Admin Authentication:**

Currently, authentication (Clerk) is disabled in the code. To enable:

1. Sign up for [Clerk](https://clerk.com)
2. Get your API keys
3. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
   CLERK_SECRET_KEY=sk_...
   ```
4. Uncomment Clerk provider in `app/layout.tsx`
5. Uncomment middleware in `middleware.ts`

---

## 📝 Adding Products

### **Via Admin Panel:**

1. Go to `/admin/products/new`
2. Fill in the form:
   - **Product Name:** e.g., "Oversized Black Tee"
   - **Price:** e.g., 850
   - **Discount:** e.g., 20 (optional, %)
   - **Description:** Product details
   - **Type:** Select from dropdown (T-Shirt, Hoodie, etc.)
   - **Gender:** Men, Women, or Unisex
   - **Color:** Select color
   - **Material:** e.g., "Cotton" (defaults to Cotton)
   - **Sizes:** Click to select (S, M, L, XL, XXL)
   - **Featured:** Check to show on homepage
   - **Images:** Upload multiple images

3. Click "Add Product"

### **Product Images:**

**Local Storage (Development):**
- Images stored in `/public/uploads/products/`
- Accessible at `/uploads/products/filename.jpg`
- Directory created automatically on first upload

**AWS S3 (Production):**
- Set `USE_S3_STORAGE=true` in `.env`
- Configure AWS credentials
- Images uploaded to S3 bucket
- Returns public S3 URL

**Features:**
- Supports multiple images per product
- Accepts JPG, PNG, WEBP, GIF, SVG
- Automatic unique filename generation
- Proper content-type headers

---

## 🎨 Product Types

Based on ZEYREY, your store supports:

- **T-Shirt** - Classic tees and oversized styles
- **Hoodie** - Hooded sweatshirts
- **Shirt** - Button-up shirts
- **Dashiki** - Traditional African wear
- **Blouse** - Women's tops
- **Long Sleeve** - Long-sleeve shirts

You can modify these in:
- `/app/(admin)/admin/products/new/_components/add-product.tsx`
- `/app/(admin)/admin/products/_components/edit-form.tsx`

---

## 🎨 Colors System

Products now support **multiple color variants** stored as an array:

```typescript
colors: ['Black', 'White', 'Navy', 'Gray']
```

This allows products like the "Candy Color Basic Tee" to have 14 different colors!

**Popular Colors in Seed Data:**
- Basic: Black, White, Navy, Gray
- Vibrant: Pink, Lavender, Mint, Peach, Yellow
- Natural: Beige, Cream, Brown
- Patterns: Plaid, Traditional Prints

---

## 📊 Database Structure

### **Product Model:**
```prisma
model Product {
  id           String   @id @default(cuid())
  title        String
  description  String
  imageURLs    String[] // Array of image URLs (S3 or local)

  // Clothing specific
  type         String   // "T-Shirt", "Hoodie", "Shirt", "Blouse", "Dashiki"
  gender       String   // "Men", "Women", "Unisex"
  colors       String[] // Multiple color variants
  material     String   // "Cotton", "Cotton Blend", "Linen"

  // Pricing
  price        Float    // Regular price
  salePrice    Float?   // Sale price (if on sale)
  discount     Float?   // Discount percentage

  // Inventory
  featured     Boolean  @default(false)
  inStock      Boolean  @default(true)
  sku          String?  // Stock Keeping Unit

  // Relations
  productSizes ProductSize[]
  orderItems   OrderItem[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## 🔧 Common Tasks

### **Add More Sizes:**

```bash
# Via Prisma Studio
npx prisma studio

# Manually in database or create API endpoint
```

### **View Database:**

```bash
npx prisma studio
```

This opens a GUI at `http://localhost:5555` to view/edit data.

### **Reset Database:**

```bash
npx prisma db push --force-reset
npm run db:seed
```

⚠️ **Warning:** This deletes all data!

---

## 🐛 Troubleshooting

### **"Environment variable not found: DATABASE_URL"**

- Make sure `.env` file exists in project root
- Check that `DATABASE_URL` is set correctly
- Restart your terminal/IDE

### **MongoDB Connection Failed**

**Local MongoDB:**
- Make sure MongoDB is running: `brew services start mongodb-community` (Mac)
- Or: `sudo systemctl start mongod` (Linux)

**MongoDB Atlas:**
- Check your connection string
- Ensure IP whitelist includes your IP
- Verify username/password

### **Images Not Showing**

- Check that `/public/uploads/products/` directory exists
- Verify file permissions
- Image paths should start with `/uploads/products/`

### **Seed Script Fails**

```bash
# Install tsx if missing
npm install -D tsx

# Try running directly
npx tsx prisma/seed.ts
```

---

## 📁 Project Structure

```
nextjs-ecommerce/
├── app/
│   ├── (admin)/admin/          # Admin panel
│   │   ├── dashboard/
│   │   ├── products/           # Product management
│   │   ├── orders/
│   │   ├── sizes/
│   │   └── users/
│   ├── (routes)/               # Public store
│   │   ├── shop/               # Product catalog
│   │   ├── product/[id]/       # Product details
│   │   ├── cart/               # Shopping cart
│   │   └── featured/
│   └── api/                    # Backend API
│       ├── product/            # Product endpoints
│       ├── sizes/
│       ├── orders/
│       └── checkout/           # Stripe
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Sample data
├── public/
│   └── uploads/
│       └── products/           # Product images
├── lib/
│   ├── db.ts                   # Prisma client
│   └── file-upload.ts          # Local file storage
└── .env                        # Environment variables
```

---

## 🎯 Next Steps

Your backend is fully configured! The remaining tasks:

### **Backend - Complete ✅**
- [x] Database schema optimized for clothing
- [x] Flexible file storage (local + S3)
- [x] Product API routes updated
- [x] Seed data with 12 products

### **Frontend - Needs Update ⏳**
1. **Admin Product Forms** - Update for colors array & new fields
2. **Shop Page** - Filter by type/gender instead of categories
3. **Product Cards** - Display color variants & sale prices
4. **Product Detail Page** - Show all clothing attributes

### **Professional Polish (Optional)**
- Enable Clerk authentication for admin
- Set up Stripe payments
- Configure AWS S3 for production
- Add product reviews
- Implement color/size selectors

---

## 📞 Support

- **Prisma Docs:** https://www.prisma.io/docs
- **Next.js Docs:** https://nextjs.org/docs
- **MongoDB Docs:** https://www.mongodb.com/docs

---

## ✅ Checklist

- [ ] Installed dependencies (`npm install`)
- [ ] Configured MongoDB in `.env`
- [ ] Ran database seed (`npm run db:seed`)
- [ ] Started dev server (`npm run dev`)
- [ ] Accessed admin panel (`/admin/products`)
- [ ] Created your first product
- [ ] Uploaded product images
- [ ] Viewed products in database (`npx prisma studio`)

---

**🎉 Your ZEYREY-style e-commerce backend is ready to use!**
