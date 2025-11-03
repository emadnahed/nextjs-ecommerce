/**
 * Server-side data access functions
 * These functions query the database directly and should only be used in Server Components
 * DO NOT import these in client components - use lib/apiCalls.ts instead
 */

import { db } from "@/lib/db";
import { Product } from "@/types";

/**
 * Converts database product to Product type with imageURLs
 */
function enrichProductWithImageURLs(product: any): Product {
  const enriched = { ...product };

  // Convert imageIds to imageURLs
  if (product.imageIds && Array.isArray(product.imageIds)) {
    enriched.imageURLs = product.imageIds.map((id: string) => {
      // If it's already a full URL, use it as-is
      if (id.startsWith('http://') || id.startsWith('https://')) {
        return id;
      }
      // For non-URL ids, construct the API endpoint
      return `/api/images/${id}`;
    });
  } else {
    enriched.imageURLs = [];
  }

  return enriched as Product;
}

/**
 * Get all products from database (Server-side only)
 */
export async function getAllProductsFromDB(): Promise<Product[]> {
  try {
    console.log('[ServerDataAccess] Fetching products from database...');

    const products = await db.product.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('[ServerDataAccess] Fetched products from DB:', products.length);

    const enrichedProducts = products.map(enrichProductWithImageURLs);
    return enrichedProducts;
  } catch (error) {
    console.error('[ServerDataAccess] Error fetching products from database:', error);
    if (error instanceof Error) {
      console.error('[ServerDataAccess] Error message:', error.message);
    }
    return [];
  }
}

/**
 * Get a single product by ID from database (Server-side only)
 */
export async function getProductFromDB(productId: string): Promise<Product | null> {
  try {
    console.log('[ServerDataAccess] Fetching product from DB:', productId);

    const product = await db.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      console.log('[ServerDataAccess] Product not found:', productId);
      return null;
    }

    return enrichProductWithImageURLs(product);
  } catch (error) {
    console.error('[ServerDataAccess] Error fetching product from database:', error);
    return null;
  }
}

/**
 * Get products by type from database (Server-side only)
 */
export async function getProductsByTypeFromDB(type: string): Promise<Product[]> {
  try {
    console.log('[ServerDataAccess] Fetching products by type from DB:', type);

    const products = await db.product.findMany({
      where: { type },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('[ServerDataAccess] Fetched products by type:', products.length);

    return products.map(enrichProductWithImageURLs);
  } catch (error) {
    console.error('[ServerDataAccess] Error fetching products by type:', error);
    return [];
  }
}

/**
 * Get featured products from database (Server-side only)
 */
export async function getFeaturedProductsFromDB(): Promise<Product[]> {
  try {
    console.log('[ServerDataAccess] Fetching featured products from DB...');

    const products = await db.product.findMany({
      where: { featured: true },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('[ServerDataAccess] Fetched featured products:', products.length);

    return products.map(enrichProductWithImageURLs);
  } catch (error) {
    console.error('[ServerDataAccess] Error fetching featured products:', error);
    return [];
  }
}
