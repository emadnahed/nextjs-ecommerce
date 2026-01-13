/**
 * Server-side data access functions
 * These functions query the database directly and should only be used in Server Components
 * DO NOT import these in client components - use lib/apiCalls.ts instead
 */

import { db } from "@/lib/db";
import { Product, Category, ProductDetails } from "@/types";

/**
 * Get all products from database (Server-side only)
 */
export async function getAllProductsFromDB(): Promise<Product[]> {
  try {
    console.log('[ServerDataAccess] Fetching products from database...');

    const products = await db.product.findMany({
      orderBy: {
        price: 'desc'
      }
    });

    console.log('[ServerDataAccess] Fetched products from DB:', products.length);
    return products as Product[];
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

    return product as Product;
  } catch (error) {
    console.error('[ServerDataAccess] Error fetching product from database:', error);
    return null;
  }
}

/**
 * Get products by category from database (Server-side only)
 */
export async function getProductsByCategoryFromDB(category: string): Promise<Product[]> {
  try {
    console.log('[ServerDataAccess] Fetching products by category from DB:', category);

    const products = await db.product.findMany({
      where: { category },
      orderBy: {
        price: 'desc'
      }
    });

    console.log('[ServerDataAccess] Fetched products by category:', products.length);
    return products as Product[];
  } catch (error) {
    console.error('[ServerDataAccess] Error fetching products by category:', error);
    return [];
  }
}

/**
 * Get products by top-level category from database (Server-side only)
 */
export async function getProductsByTopLevelCategoryFromDB(topLevelCategory: string): Promise<Product[]> {
  try {
    console.log('[ServerDataAccess] Fetching products by top-level category from DB:', topLevelCategory);

    const products = await db.product.findMany({
      where: { topLevelCategory },
      orderBy: {
        price: 'desc'
      }
    });

    console.log('[ServerDataAccess] Fetched products by top-level category:', products.length);
    return products as Product[];
  } catch (error) {
    console.error('[ServerDataAccess] Error fetching products by top-level category:', error);
    return [];
  }
}

/**
 * Get all categories from database (Server-side only)
 */
export async function getAllCategoriesFromDB(): Promise<Category[]> {
  try {
    console.log('[ServerDataAccess] Fetching categories from database...');

    const categories = await db.category.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    console.log('[ServerDataAccess] Fetched categories from DB:', categories.length);
    return categories as Category[];
  } catch (error) {
    console.error('[ServerDataAccess] Error fetching categories from database:', error);
    if (error instanceof Error) {
      console.error('[ServerDataAccess] Error message:', error.message);
    }
    return [];
  }
}

/**
 * Get categories by top-level category from database (Server-side only)
 */
export async function getCategoriesByTopLevelFromDB(topLevelCategory: string): Promise<Category[]> {
  try {
    console.log('[ServerDataAccess] Fetching categories by top-level from DB:', topLevelCategory);

    const categories = await db.category.findMany({
      where: { topLevelCategory },
      orderBy: {
        name: 'asc'
      }
    });

    console.log('[ServerDataAccess] Fetched categories by top-level:', categories.length);
    return categories as Category[];
  } catch (error) {
    console.error('[ServerDataAccess] Error fetching categories by top-level:', error);
    return [];
  }
}

/**
 * Check if a title is invalid (scraped junk data)
 */
function isInvalidTitle(title: string): boolean {
  if (!title || title.length < 5) return true;
  // Patterns for bad titles
  if (/^\+\d+\s*More/i.test(title)) return true;  // +1 More, +2 More
  if (/^\d+h\s*:\s*\d+m/i.test(title)) return true;  // Countdown timers
  if (/^[\d\s:hms]+$/i.test(title)) return true;  // Only numbers and time characters
  if (/More\d*h\s*:/i.test(title)) return true;  // Combined patterns like "+8 More00h : 12m"
  return false;
}

/**
 * Get featured products - ONLY products with complete detailed information (Server-side only)
 * Uses data.name from productDetails for accurate titles
 * Sorted by rating and review count
 */
export async function getFeaturedProductsFromDB(limit: number = 20): Promise<Product[]> {
  try {
    console.log('[ServerDataAccess] Fetching featured products with complete details...');

    // Get all productDetails to get proper names
    const allProductDetails = await db.productDetails.findMany();

    if (allProductDetails.length === 0) {
      console.log('[ServerDataAccess] No products with details found');
      return [];
    }

    // Create a map of productId -> proper name from data.name
    const productDetailsMap = new Map<string, { name: string; data: any }>();
    allProductDetails.forEach(pd => {
      const detailData = pd.data as any;
      const properName = detailData?.name || pd.title;
      if (properName && !isInvalidTitle(properName)) {
        productDetailsMap.set(pd.productId, { name: properName, data: detailData });
      }
    });

    // Get all products
    const products = await db.product.findMany();

    // Filter to only products with valid details and good names
    const featured = products
      .filter(p => productDetailsMap.has(p.productId))
      .map(p => {
        const details = productDetailsMap.get(p.productId)!;
        return {
          ...p,
          title: details.name, // Use the proper name from productDetails
          hasDetails: true
        };
      })
      .sort((a, b) => {
        const ratingA = parseFloat(a.rating) || 0;
        const ratingB = parseFloat(b.rating) || 0;
        if (ratingB !== ratingA) {
          return ratingB - ratingA;
        }
        return b.reviewCount - a.reviewCount;
      })
      .slice(0, limit);

    console.log('[ServerDataAccess] Fetched featured products with valid titles:', featured.length);
    return featured as Product[];
  } catch (error) {
    console.error('[ServerDataAccess] Error fetching featured products:', error);
    return [];
  }
}

/**
 * Get women products - products with topLevelCategory="Women" and complete details (Server-side only)
 * Uses data.name from productDetails for accurate titles
 * Sorted by rating and review count
 */
export async function getWomenProductsFromDB(limit: number = 20): Promise<Product[]> {
  try {
    console.log('[ServerDataAccess] Fetching women products with complete details...');

    // Get all productDetails to get proper names
    const allProductDetails = await db.productDetails.findMany();

    if (allProductDetails.length === 0) {
      console.log('[ServerDataAccess] No products with details found');
      return [];
    }

    // Create a map of productId -> proper name from data.name
    const productDetailsMap = new Map<string, { name: string; data: any }>();
    allProductDetails.forEach(pd => {
      const detailData = pd.data as any;
      const properName = detailData?.name || pd.title;
      if (properName && !isInvalidTitle(properName)) {
        productDetailsMap.set(pd.productId, { name: properName, data: detailData });
      }
    });

    // Get women products (Women Western in the database)
    const products = await db.product.findMany({
      where: {
        topLevelCategory: 'Women Western'
      }
    });

    // Filter to only products with valid details and good names
    const womenProducts = products
      .filter(p => productDetailsMap.has(p.productId))
      .map(p => {
        const details = productDetailsMap.get(p.productId)!;
        return {
          ...p,
          title: details.name, // Use the proper name from productDetails
          hasDetails: true
        };
      })
      .sort((a, b) => {
        const ratingA = parseFloat(a.rating) || 0;
        const ratingB = parseFloat(b.rating) || 0;
        if (ratingB !== ratingA) {
          return ratingB - ratingA;
        }
        return b.reviewCount - a.reviewCount;
      })
      .slice(0, limit);

    console.log('[ServerDataAccess] Fetched women products with valid titles:', womenProducts.length);
    return womenProducts as Product[];
  } catch (error) {
    console.error('[ServerDataAccess] Error fetching women products:', error);
    return [];
  }
}

/**
 * Get unique product categories from database (Server-side only)
 */
export async function getProductCategoriesFromDB(): Promise<string[]> {
  try {
    console.log('[ServerDataAccess] Fetching unique product categories from DB...');

    const products = await db.product.findMany({
      select: {
        category: true
      },
      distinct: ['category']
    });

    const categories = products
      .map(p => p.category)
      .filter(Boolean)
      .sort();

    console.log('[ServerDataAccess] Fetched unique categories:', categories.length);
    return categories;
  } catch (error) {
    console.error('[ServerDataAccess] Error fetching product categories:', error);
    return [];
  }
}

/**
 * Get unique top-level categories from database (Server-side only)
 */
export async function getTopLevelCategoriesFromDB(): Promise<string[]> {
  try {
    console.log('[ServerDataAccess] Fetching unique top-level categories from DB...');

    const products = await db.product.findMany({
      select: {
        topLevelCategory: true
      },
      distinct: ['topLevelCategory']
    });

    const topLevels = products
      .map(p => p.topLevelCategory)
      .filter(Boolean)
      .sort();

    console.log('[ServerDataAccess] Fetched unique top-level categories:', topLevels.length);
    return topLevels;
  } catch (error) {
    console.error('[ServerDataAccess] Error fetching top-level categories:', error);
    return [];
  }
}

/**
 * Get product details by productId from database (Server-side only)
 */
export async function getProductDetailsFromDB(productId: string): Promise<ProductDetails | null> {
  try {
    console.log('[ServerDataAccess] Fetching product details from DB:', productId);

    const productDetails = await db.productDetails.findUnique({
      where: { productId }
    });

    if (!productDetails) {
      console.log('[ServerDataAccess] Product details not found:', productId);
      return null;
    }

    return productDetails as unknown as ProductDetails;
  } catch (error) {
    console.error('[ServerDataAccess] Error fetching product details:', error);
    return null;
  }
}

/**
 * Get all productIds that have details available (Server-side only)
 */
export async function getProductIdsWithDetailsFromDB(): Promise<string[]> {
  try {
    console.log('[ServerDataAccess] Fetching product IDs with details...');

    const productDetails = await db.productDetails.findMany({
      select: {
        productId: true
      }
    });

    const productIds = productDetails.map(p => p.productId);
    console.log('[ServerDataAccess] Found products with details:', productIds.length);
    return productIds;
  } catch (error) {
    console.error('[ServerDataAccess] Error fetching product IDs with details:', error);
    return [];
  }
}

/**
 * Get all products, prioritizing those with productDetails (Server-side only)
 * Products with details will have hasDetails: true flag and corrected titles
 */
export async function getAllProductsPrioritizedFromDB(): Promise<Product[]> {
  try {
    console.log('[ServerDataAccess] Fetching products with prioritization...');

    // Get all productDetails to get proper names
    const allProductDetails = await db.productDetails.findMany();

    // Create a map of productId -> proper name from data.name
    const productDetailsMap = new Map<string, { name: string; valid: boolean }>();
    allProductDetails.forEach(pd => {
      const detailData = pd.data as any;
      const properName = detailData?.name || pd.title;
      const isValid = properName && !isInvalidTitle(properName);
      productDetailsMap.set(pd.productId, {
        name: isValid ? properName : '',
        valid: isValid
      });
    });

    // Get all products
    const products = await db.product.findMany({
      orderBy: {
        price: 'desc'
      }
    });

    // Add hasDetails flag, fix titles, and sort
    const productsWithFlag = products
      .map(p => {
        const details = productDetailsMap.get(p.productId);
        const hasValidDetails = details?.valid || false;
        return {
          ...p,
          // Use proper name from productDetails if available and valid
          title: hasValidDetails && details?.name ? details.name : p.title,
          hasDetails: hasValidDetails
        };
      })
      // Filter out products with bad titles that don't have valid details
      .filter(p => !isInvalidTitle(p.title));

    const sortedProducts = productsWithFlag.sort((a, b) => {
      if (a.hasDetails && !b.hasDetails) return -1;
      if (!a.hasDetails && b.hasDetails) return 1;
      return b.price - a.price; // Secondary sort by price descending
    });

    console.log('[ServerDataAccess] Fetched prioritized products:', sortedProducts.length);
    console.log('[ServerDataAccess] Products with valid details:', allProductDetails.length);
    return sortedProducts as Product[];
  } catch (error) {
    console.error('[ServerDataAccess] Error fetching prioritized products:', error);
    return [];
  }
}

/**
 * Pagination result type
 */
export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

/**
 * Default items per page for pagination
 */
export const DEFAULT_ITEMS_PER_PAGE = 12;

/**
 * Get all products with pagination, prioritizing those with productDetails (Server-side only)
 */
export async function getAllProductsPaginatedFromDB(
  page: number = 1,
  itemsPerPage: number = DEFAULT_ITEMS_PER_PAGE
): Promise<PaginatedResult<Product>> {
  try {
    console.log('[ServerDataAccess] Fetching paginated products, page:', page);

    // Get all productDetails to get proper names
    const allProductDetails = await db.productDetails.findMany();

    // Create a map of productId -> proper name from data.name
    const productDetailsMap = new Map<string, { name: string; valid: boolean }>();
    allProductDetails.forEach(pd => {
      const detailData = pd.data as any;
      const properName = detailData?.name || pd.title;
      const isValid = properName && !isInvalidTitle(properName);
      productDetailsMap.set(pd.productId, {
        name: isValid ? properName : '',
        valid: isValid
      });
    });

    // Get all products
    const products = await db.product.findMany({
      orderBy: {
        price: 'desc'
      }
    });

    // Add hasDetails flag, fix titles, and sort
    const productsWithFlag = products
      .map(p => {
        const details = productDetailsMap.get(p.productId);
        const hasValidDetails = details?.valid || false;
        return {
          ...p,
          title: hasValidDetails && details?.name ? details.name : p.title,
          hasDetails: hasValidDetails
        };
      })
      .filter(p => !isInvalidTitle(p.title));

    const sortedProducts = productsWithFlag.sort((a, b) => {
      if (a.hasDetails && !b.hasDetails) return -1;
      if (!a.hasDetails && b.hasDetails) return 1;
      return b.price - a.price;
    });

    const totalCount = sortedProducts.length;
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const validPage = Math.max(1, Math.min(page, totalPages || 1));
    const offset = (validPage - 1) * itemsPerPage;
    const paginatedData = sortedProducts.slice(offset, offset + itemsPerPage);

    console.log('[ServerDataAccess] Paginated products:', paginatedData.length, 'of', totalCount);

    return {
      data: paginatedData as Product[],
      totalCount,
      totalPages,
      currentPage: validPage,
      itemsPerPage
    };
  } catch (error) {
    console.error('[ServerDataAccess] Error fetching paginated products:', error);
    return {
      data: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
      itemsPerPage
    };
  }
}

/**
 * Get products by category with pagination (Server-side only)
 */
export async function getProductsByCategoryPaginatedFromDB(
  category: string,
  page: number = 1,
  itemsPerPage: number = DEFAULT_ITEMS_PER_PAGE
): Promise<PaginatedResult<Product>> {
  try {
    console.log('[ServerDataAccess] Fetching paginated products by category:', category, 'page:', page);

    // Get total count
    const totalCount = await db.product.count({
      where: { category }
    });

    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const validPage = Math.max(1, Math.min(page, totalPages || 1));
    const offset = (validPage - 1) * itemsPerPage;

    // Get paginated products
    const products = await db.product.findMany({
      where: { category },
      orderBy: {
        price: 'desc'
      },
      skip: offset,
      take: itemsPerPage
    });

    console.log('[ServerDataAccess] Paginated category products:', products.length, 'of', totalCount);

    return {
      data: products as Product[],
      totalCount,
      totalPages,
      currentPage: validPage,
      itemsPerPage
    };
  } catch (error) {
    console.error('[ServerDataAccess] Error fetching paginated category products:', error);
    return {
      data: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
      itemsPerPage
    };
  }
}

/**
 * Get featured products with pagination (Server-side only)
 */
export async function getFeaturedProductsPaginatedFromDB(
  page: number = 1,
  itemsPerPage: number = DEFAULT_ITEMS_PER_PAGE
): Promise<PaginatedResult<Product>> {
  try {
    console.log('[ServerDataAccess] Fetching paginated featured products, page:', page);

    // Get all productDetails to get proper names
    const allProductDetails = await db.productDetails.findMany();

    if (allProductDetails.length === 0) {
      console.log('[ServerDataAccess] No products with details found');
      return {
        data: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage
      };
    }

    // Create a map of productId -> proper name from data.name
    const productDetailsMap = new Map<string, { name: string; data: any }>();
    allProductDetails.forEach(pd => {
      const detailData = pd.data as any;
      const properName = detailData?.name || pd.title;
      if (properName && !isInvalidTitle(properName)) {
        productDetailsMap.set(pd.productId, { name: properName, data: detailData });
      }
    });

    // Get all products
    const products = await db.product.findMany();

    // Filter to only products with valid details and good names
    const featured = products
      .filter(p => productDetailsMap.has(p.productId))
      .map(p => {
        const details = productDetailsMap.get(p.productId)!;
        return {
          ...p,
          title: details.name,
          hasDetails: true
        };
      })
      .sort((a, b) => {
        const ratingA = parseFloat(a.rating) || 0;
        const ratingB = parseFloat(b.rating) || 0;
        if (ratingB !== ratingA) {
          return ratingB - ratingA;
        }
        return b.reviewCount - a.reviewCount;
      });

    const totalCount = featured.length;
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const validPage = Math.max(1, Math.min(page, totalPages || 1));
    const offset = (validPage - 1) * itemsPerPage;
    const paginatedData = featured.slice(offset, offset + itemsPerPage);

    console.log('[ServerDataAccess] Paginated featured products:', paginatedData.length, 'of', totalCount);

    return {
      data: paginatedData as Product[],
      totalCount,
      totalPages,
      currentPage: validPage,
      itemsPerPage
    };
  } catch (error) {
    console.error('[ServerDataAccess] Error fetching paginated featured products:', error);
    return {
      data: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
      itemsPerPage
    };
  }
}
