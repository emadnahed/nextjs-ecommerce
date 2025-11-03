import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parseCSV, validateProductData, prepareProductForDB } from "@/lib/product-import-export";

const prisma = new PrismaClient();

/**
 * POST /api/admin/products/import
 * Bulk import products from CSV or JSON
 *
 * Image URLs can be:
 * - External URLs (e.g., from web scraper) - stored directly
 * - DigitalOcean Spaces URLs - stored directly
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const format = formData.get("format") as string; // "csv" or "json"

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const fileContent = await file.text();
    let products;

    // Parse file based on format
    if (format === "json") {
      products = JSON.parse(fileContent);
    } else {
      products = parseCSV(fileContent);
    }

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: "No valid products found in file" },
        { status: 400 }
      );
    }

    // Validate all products first
    const validationErrors: { row: number; errors: string[] }[] = [];
    products.forEach((product, index) => {
      const errors = validateProductData(product);
      if (errors.length > 0) {
        validationErrors.push({ row: index + 1, errors });
      }
    });

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: "Validation failed",
          validationErrors,
        },
        { status: 400 }
      );
    }

    // Import products
    const importResults = {
      success: 0,
      failed: 0,
      errors: [] as { product: string; error: string }[],
    };

    for (const productData of products) {
      try {
        const preparedProduct = prepareProductForDB(productData);

        // Handle image URLs
        const imageIds: string[] = [];

        if (preparedProduct.imageURLs && Array.isArray(preparedProduct.imageURLs)) {
          // Store image URLs directly (they can be external URLs or DigitalOcean Spaces URLs)
          // Filter out any empty URLs
          imageIds.push(...preparedProduct.imageURLs.filter((url: string) => url && url.trim().length > 0));

          if (imageIds.length > 0) {
            console.log(`Stored ${imageIds.length} image URLs for: ${productData.title}`);
          }
        }

        // Handle sizes
        const sizeNames = productData.sizes?.split(',').map((s: string) => s.trim()).filter(Boolean) || [];

        // Find or create sizes
        const sizeRecords = await Promise.all(
          sizeNames.map(async (sizeName: string) => {
            return await prisma.size.upsert({
              where: { name: sizeName },
              update: {},
              create: { name: sizeName },
            });
          })
        );

        // Create product
        const product = await prisma.product.create({
          data: {
            title: preparedProduct.title,
            description: preparedProduct.description,
            type: preparedProduct.type,
            gender: preparedProduct.gender,
            colors: preparedProduct.colors,
            material: preparedProduct.material,
            price: preparedProduct.price,
            salePrice: preparedProduct.salePrice,
            discount: preparedProduct.discount,
            featured: preparedProduct.featured,
            inStock: preparedProduct.inStock,
            sku: preparedProduct.sku,
            imageIds: imageIds, // Store image URLs directly
            productSizes: {
              create: sizeRecords.map(size => ({
                sizeId: size.id,
                name: size.name,
              })),
            },
          },
        });

        importResults.success++;
      } catch (error: any) {
        importResults.failed++;
        importResults.errors.push({
          product: productData.title || "Unknown",
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      message: "Import completed",
      results: importResults,
    });
  } catch (error: any) {
    console.error("Error importing products:", error);
    return NextResponse.json(
      { error: `Import failed: ${error.message}` },
      { status: 500 }
    );
  }
}
