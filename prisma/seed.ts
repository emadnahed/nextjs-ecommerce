import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Sizes
  console.log('Creating sizes...');
  const sizes = await Promise.all([
    prisma.size.upsert({
      where: { name: 'XS' },
      update: {},
      create: { name: 'XS' },
    }),
    prisma.size.upsert({
      where: { name: 'S' },
      update: {},
      create: { name: 'S' },
    }),
    prisma.size.upsert({
      where: { name: 'M' },
      update: {},
      create: { name: 'M' },
    }),
    prisma.size.upsert({
      where: { name: 'L' },
      update: {},
      create: { name: 'L' },
    }),
    prisma.size.upsert({
      where: { name: 'XL' },
      update: {},
      create: { name: 'XL' },
    }),
    prisma.size.upsert({
      where: { name: 'XXL' },
      update: {},
      create: { name: 'XXL' },
    }),
    prisma.size.upsert({
      where: { name: 'XXXL' },
      update: {},
      create: { name: 'XXXL' },
    }),
  ]);

  console.log(`✓ Created ${sizes.length} sizes`);

  // Create Sample Products (Foticket-style)
  console.log('Creating sample products...');

  const products = [
    {
      title: 'Classic Cotton T-Shirt',
      description: 'Premium quality cotton t-shirt with a comfortable fit. Perfect for everyday wear with breathable fabric and durable construction.',
      price: 499,
      salePrice: 399,
      discount: 20,
      type: 'T-Shirt',
      gender: 'Unisex',
      colors: ['Black', 'White', 'Navy', 'Gray'],
      material: 'Cotton',
      featured: true,
      inStock: true,
      imageURLs: ['/uploads/products/placeholder-tshirt.jpg'],
    },
    {
      title: 'Oversized Graphic T-Shirt',
      description: 'Trendy oversized fit with unique graphic print. Made from soft cotton blend for maximum comfort and style.',
      price: 699,
      salePrice: 549,
      discount: 21,
      type: 'T-Shirt',
      gender: 'Unisex',
      colors: ['Black', 'White', 'Olive Green'],
      material: 'Cotton Blend',
      featured: true,
      inStock: true,
      imageURLs: ['/uploads/products/placeholder-graphic-tee.jpg'],
    },
    {
      title: 'Coffee Lover Graphic Tee',
      description: 'Fun and casual coffee-themed graphic t-shirt. Perfect for coffee enthusiasts with a relaxed fit and soft fabric.',
      price: 549,
      type: 'T-Shirt',
      gender: 'Unisex',
      colors: ['Brown', 'Cream', 'Black'],
      material: 'Cotton',
      featured: false,
      inStock: true,
      imageURLs: ['/uploads/products/placeholder-coffee-tee.jpg'],
    },
    {
      title: 'Meme Print Cotton Tee',
      description: 'Express yourself with this funny meme-inspired t-shirt. Comfortable cotton fabric with vibrant prints that last.',
      price: 599,
      salePrice: 479,
      discount: 20,
      type: 'T-Shirt',
      gender: 'Unisex',
      colors: ['White', 'Black', 'Red'],
      material: 'Cotton',
      featured: true,
      inStock: true,
      imageURLs: ['/uploads/products/placeholder-meme-tee.jpg'],
    },
    {
      title: "Men's Casual Linen Shirt",
      description: 'Breathable linen shirt perfect for summer. Lightweight and comfortable with a modern fit and classic collar design.',
      price: 1299,
      salePrice: 999,
      discount: 23,
      type: 'Shirt',
      gender: 'Men',
      colors: ['White', 'Light Blue', 'Beige', 'Sage Green'],
      material: 'Linen',
      featured: true,
      inStock: true,
      imageURLs: ['/uploads/products/placeholder-linen-shirt.jpg'],
    },
    {
      title: "Women's Hooded Plaid Shirt",
      description: 'Stylish plaid pattern with comfortable hood. Perfect blend of casual and trendy with soft cotton fabric.',
      price: 1199,
      type: 'Blouse',
      gender: 'Women',
      colors: ['Red Plaid', 'Blue Plaid', 'Green Plaid'],
      material: 'Cotton',
      featured: true,
      inStock: true,
      imageURLs: ['/uploads/products/placeholder-plaid-shirt.jpg'],
    },
    {
      title: "Men's Classic Button-Down Shirt",
      description: 'Timeless button-down shirt for work or casual outings. Wrinkle-resistant fabric with a tailored fit.',
      price: 999,
      salePrice: 799,
      discount: 20,
      type: 'Shirt',
      gender: 'Men',
      colors: ['White', 'Black', 'Light Pink', 'Sky Blue'],
      material: 'Cotton Blend',
      featured: false,
      inStock: true,
      imageURLs: ['/uploads/products/placeholder-button-down.jpg'],
    },
    {
      title: 'Traditional Dashiki Shirt',
      description: 'Authentic African Dashiki with vibrant traditional patterns. Comfortable loose fit perfect for cultural events and casual wear.',
      price: 1499,
      salePrice: 1199,
      discount: 20,
      type: 'Dashiki',
      gender: 'Unisex',
      colors: ['Red Pattern', 'Blue Pattern', 'Yellow Pattern', 'Green Pattern'],
      material: 'Cotton',
      featured: true,
      inStock: true,
      imageURLs: ['/uploads/products/placeholder-dashiki.jpg'],
    },
    {
      title: 'Candy Color Basic Tee',
      description: 'Available in 14 vibrant candy colors. Premium cotton construction with a comfortable regular fit.',
      price: 449,
      type: 'T-Shirt',
      gender: 'Unisex',
      colors: ['Pink', 'Lavender', 'Mint', 'Peach', 'Yellow', 'Sky Blue', 'Coral', 'Lime', 'Rose', 'Aqua', 'Violet', 'Orange', 'Teal', 'Cream'],
      material: 'Cotton',
      featured: true,
      inStock: true,
      imageURLs: ['/uploads/products/placeholder-candy-tee.jpg'],
    },
    {
      title: 'Premium Hoodie',
      description: 'Cozy fleece-lined hoodie with adjustable drawstring. Perfect for layering with kangaroo pocket and ribbed cuffs.',
      price: 1799,
      salePrice: 1399,
      discount: 22,
      type: 'Hoodie',
      gender: 'Unisex',
      colors: ['Black', 'Gray', 'Navy', 'Burgundy'],
      material: 'Cotton Blend',
      featured: true,
      inStock: true,
      imageURLs: ['/uploads/products/placeholder-hoodie.jpg'],
    },
    {
      title: 'Vintage Wash T-Shirt',
      description: 'Pre-washed vintage look t-shirt with distressed finish. Soft and comfortable with a lived-in feel.',
      price: 799,
      salePrice: 639,
      discount: 20,
      type: 'T-Shirt',
      gender: 'Unisex',
      colors: ['Washed Black', 'Washed Gray', 'Washed Blue'],
      material: 'Cotton',
      featured: false,
      inStock: true,
      imageURLs: ['/uploads/products/placeholder-vintage-tee.jpg'],
    },
    {
      title: "Women's Casual Blouse",
      description: 'Elegant and comfortable blouse perfect for work or casual outings. Flowy fabric with modern cut.',
      price: 1099,
      type: 'Blouse',
      gender: 'Women',
      colors: ['White', 'Blush Pink', 'Light Blue', 'Mint Green'],
      material: 'Cotton Blend',
      featured: false,
      inStock: true,
      imageURLs: ['/uploads/products/placeholder-blouse.jpg'],
    },
  ];

  // Create products with sizes
  for (const productData of products) {
    const product = await prisma.product.create({
      data: {
        ...productData,
        productSizes: {
          create: [
            { size: { connect: { name: 'S' } }, name: 'S' },
            { size: { connect: { name: 'M' } }, name: 'M' },
            { size: { connect: { name: 'L' } }, name: 'L' },
            { size: { connect: { name: 'XL' } }, name: 'XL' },
          ],
        },
      },
    });
    console.log(`✓ Created product: ${product.title}`);
  }

  console.log('\n✅ Seed completed successfully!');
  console.log(`\n📊 Summary:`);
  console.log(`   - ${sizes.length} sizes created`);
  console.log(`   - ${products.length} products created`);
  console.log(`\n🚀 You can now:`);
  console.log(`   1. Access admin panel at /admin/products`);
  console.log(`   2. View products at /shop`);
  console.log(`   3. Add more products through the admin interface`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
