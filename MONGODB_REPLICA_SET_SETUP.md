# MongoDB Replica Set Setup Guide

## Current Issue
The product import is failing because MongoDB transactions require a replica set configuration, but your local MongoDB instance is running in standalone mode.

## Quick Solution (Recommended for Development)
**The import route has been modified to skip image uploads temporarily.** Products will be imported without images, and you can upload images manually through the admin panel later.

### What This Means:
- ✅ Products are imported with all data (title, description, price, etc.)
- ❌ Images are NOT uploaded to the database
- 📝 You'll need to manually add images through the admin panel

---

## Option 1: Import Without Images (CURRENT)

This is already configured and ready to use!

1. Upload your `products_export.json` file
2. Products will be created without images
3. Manually add images later through Admin Panel → Products → Edit

---

## Option 2: Configure MongoDB as Replica Set (For Production)

If you want automatic image uploads, you need to configure MongoDB as a replica set.

### For Local Development (macOS):

#### Step 1: Stop MongoDB
```bash
brew services stop mongodb-community
```

#### Step 2: Create Data Directory
```bash
mkdir -p ~/mongodb-replica-set
```

#### Step 3: Start MongoDB as Replica Set
```bash
mongod --replSet rs0 --port 27017 --dbpath ~/mongodb-replica-set --bind_ip localhost
```

#### Step 4: In Another Terminal, Initialize Replica Set
```bash
mongosh --eval "rs.initiate({
  _id: 'rs0',
  members: [{ _id: 0, host: 'localhost:27017' }]
})"
```

#### Step 5: Update Your .env
Your DATABASE_URL should already work, but ensure it's:
```
DATABASE_URL="mongodb://localhost:27017/yourdbname"
```

#### Step 6: Verify
```bash
mongosh --eval "rs.status()"
```

You should see `"ok" : 1` in the output.

#### Step 7: Restart Your App
```bash
npm run dev
```

Now image uploads will work!

---

### For Production (MongoDB Atlas)

MongoDB Atlas replica sets are automatically configured:

1. Use your existing MongoDB Atlas connection string
2. No additional configuration needed
3. Transactions and image uploads work out of the box

---

## Option 3: Use External Image Hosting (RECOMMENDED)

Instead of storing images in MongoDB, host them externally:

### Benefits:
- ✅ Faster loading times
- ✅ Better performance
- ✅ No replica set required
- ✅ Easier CDN integration

### Popular Image Hosts:
1. **Cloudinary** - Free tier available, CDN included
2. **ImgBB** - Simple free hosting
3. **Imgur** - Free image hosting
4. **AWS S3 + CloudFront** - Professional solution
5. **Vercel Blob Storage** - Integrated with Vercel deployment

### How to Use:
1. Upload images to your chosen service
2. Get the image URLs
3. Update the `imageURLs` in your product data
4. Import products with the external URLs

The scraped images are already hosted on zeyrey.net, so you could:
- Download them locally
- Re-upload to your own hosting service
- Update the product import file with new URLs

---

## Recommendation

For your e-commerce site, I recommend:

**Short Term (Development):**
- Use Option 1 (import without images)
- Manually add a few product images to test the site
- Focus on getting the shop functionality working

**Long Term (Production):**
- Use Option 3 (external image hosting like Cloudinary)
- Download all images from zeyrey.net
- Upload to Cloudinary/similar service
- Update product data with new URLs
- Benefit from CDN, image optimization, and transformations

---

## Current Setup Summary

Your import route is now configured to:
1. ✅ Import all product data (title, description, price, sizes, colors, etc.)
2. ✅ Skip image uploads
3. ✅ Work without MongoDB replica set
4. ✅ Log skipped images in console

**Next Steps:**
1. Try importing your products again
2. Verify products appear in the admin panel
3. Add images manually for a few products to test
4. Plan your image hosting strategy for production

---

## Troubleshooting

### Import still failing?
Check the console for specific errors and ensure:
- MongoDB is running: `brew services list`
- Database connection works: Check .env DATABASE_URL
- All required fields are present in your JSON

### Need help with images?
1. Check the admin panel: /admin/products
2. Use "Edit" on any product
3. Upload images through the form
4. Images will be stored in MongoDB GridFS or as base64

---

Last Updated: November 1, 2025
