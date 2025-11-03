import { Product } from "@/types";

// Automatically detect the correct API URL based on environment
const getApiUrl = () => {
  // If explicitly set, use that
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // In browser, use the current origin
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // On Vercel, use VERCEL_URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Default to localhost for development
  return 'http://localhost:3000';
};

const API_URL = getApiUrl();

/**
 * Converts imageIds to imageURLs for display
 * Supports both:
 * - Direct URLs (from DigitalOcean Spaces or external sources)
 * - Legacy IDs (converted to /api/images/{id} format)
 */
function enrichProductWithImageURLs(product: Product): Product {
  if (product.imageIds && Array.isArray(product.imageIds)) {
    product.imageURLs = product.imageIds.map(id => {
      // If it's already a full URL, use it as-is
      if (id.startsWith('http://') || id.startsWith('https://')) {
        return id;
      }
      // Otherwise, treat it as a legacy ID
      return `${API_URL}/api/images/${id}`;
    });
  } else {
    product.imageURLs = [];
  }
  return product;
}

/**
 * Enriches multiple products with imageURLs
 */
function enrichProductsWithImageURLs(products: Product[]): Product[] {
  return products.map(enrichProductWithImageURLs);
}

export const getProduct = async (productId: string): Promise<Product> => {
  try {
    const response = await fetch(`${API_URL}/api/product/${productId}`, {
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Product not found');
    const product = await response.json();
    return enrichProductWithImageURLs(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const getProductsByType = async (type: string): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/api/product/type/${type}`, {
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Products not found');
    const products = await response.json();
    return enrichProductsWithImageURLs(products);
  } catch (error) {
    console.error('Error fetching products by type:', error);
    return [];
  }
};

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    console.log('[getAllProducts] API_URL:', API_URL);
    console.log('[getAllProducts] Environment:', {
      isServer: typeof window === 'undefined',
      VERCEL_URL: process.env.VERCEL_URL,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    });

    const response = await fetch(`${API_URL}/api/product`, {
      cache: 'no-store'
    });

    console.log('[getAllProducts] Response status:', response.status);

    if (!response.ok) {
      console.error('[getAllProducts] Response not OK:', {
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[getAllProducts] Fetched products count:', Array.isArray(data) ? data.length : 'not an array');

    // Check if data is an array
    if (!Array.isArray(data)) {
      console.error('[getAllProducts] API did not return an array:', data);
      return [];
    }

    const enrichedData = enrichProductsWithImageURLs(data);
    console.log('[getAllProducts] Enriched products count:', enrichedData.length);
    return enrichedData;
  } catch (error) {
    console.error('[getAllProducts] Error fetching all products:', error);
    if (error instanceof Error) {
      console.error('[getAllProducts] Error message:', error.message);
      console.error('[getAllProducts] Error stack:', error.stack);
    }
    return [];
  }
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const products = await getAllProducts();
    return products.filter(product => product.featured);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
};

// Get unique product types from all products
export const getProductTypes = async (): Promise<string[]> => {
  try {
    const products = await getAllProducts();
    const types = Array.from(new Set(products.map(p => p.type)));
    return types.sort();
  } catch (error) {
    console.error('Error fetching product types:', error);
    return [];
  }
};

// Get unique genders from all products
export const getGenders = async (): Promise<string[]> => {
  try {
    const products = await getAllProducts();
    const genders = Array.from(new Set(products.map(p => p.gender)));
    return genders.sort();
  } catch (error) {
    console.error('Error fetching genders:', error);
    return [];
  }
};

// Get unique colors from all products
export const getColors = async (): Promise<string[]> => {
  try {
    const products = await getAllProducts();
    // Flatten the colors array since each product can have multiple colors
    const allColors = products.flatMap(p => p.colors || []);
    const uniqueColors = Array.from(new Set(allColors));
    return uniqueColors.sort();
  } catch (error) {
    console.error('Error fetching colors:', error);
    return [];
  }
};

// Get products by category (type)
export const getCategoryProducts = async (category: string): Promise<Product[]> => {
  try {
    const products = await getAllProducts();
    return products.filter(p => p.type.toLowerCase() === category.toLowerCase());
  } catch (error) {
    console.error('Error fetching category products:', error);
    return [];
  }
};
