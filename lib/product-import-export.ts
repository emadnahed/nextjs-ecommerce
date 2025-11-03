/**
 * Product Import/Export Utilities
 * Supports CSV and JSON formats for bulk product management
 */

import { Product } from "@prisma/client";

export interface ProductImportData {
  title: string;
  description: string;
  type: string;
  gender: string;
  colors: string; // Comma-separated colors
  material: string;
  price: number;
  salePrice?: number;
  discount?: number;
  featured: boolean;
  inStock: boolean;
  sku?: string;
  sizes: string; // Comma-separated sizes (S,M,L,XL)
  imageURLs: string; // Comma-separated URLs or paths
}

export interface ProductExportData extends ProductImportData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Convert CSV string to array of products
 */
export function parseCSV(csvContent: string): ProductImportData[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) throw new Error('CSV file must have header and at least one data row');

  const headers = lines[0].split(',').map(h => h.trim());
  const products: ProductImportData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) continue; // Skip malformed rows

    const product: any = {};
    headers.forEach((header, index) => {
      const value = values[index]?.trim();

      // Type conversions
      if (header === 'price' || header === 'salePrice' || header === 'discount') {
        product[header] = value ? parseFloat(value) : (header === 'price' ? 0 : undefined);
      } else if (header === 'featured' || header === 'inStock') {
        product[header] = value?.toLowerCase() === 'true';
      } else {
        product[header] = value || (header === 'material' ? 'Cotton' : '');
      }
    });

    products.push(product);
  }

  return products;
}

/**
 * Parse a single CSV line, handling quoted values with commas
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"';
      i++; // Skip next quote
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);

  return result;
}

/**
 * Convert products to CSV string
 */
export function generateCSV(products: ProductExportData[]): string {
  if (products.length === 0) return '';

  const headers = [
    'id', 'title', 'description', 'type', 'gender', 'colors', 'material',
    'price', 'salePrice', 'discount', 'featured', 'inStock', 'sku',
    'sizes', 'imageURLs', 'createdAt', 'updatedAt'
  ];

  const rows = products.map(product => {
    return headers.map(header => {
      const value = (product as any)[header];
      if (value === null || value === undefined) return '';

      // Escape values with commas or quotes
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Generate CSV template for product import
 */
export function generateCSVTemplate(): string {
  const headers = [
    'title', 'description', 'type', 'gender', 'colors', 'material',
    'price', 'salePrice', 'discount', 'featured', 'inStock', 'sku',
    'sizes', 'imageURLs'
  ];

  const sampleData = [
    'Classic White T-Shirt',
    'Comfortable cotton t-shirt perfect for everyday wear',
    'T-Shirt',
    'Unisex',
    'White,Black,Navy',
    'Cotton',
    '29.99',
    '24.99',
    '17',
    'true',
    'true',
    'TS-001',
    'S,M,L,XL',
    '/uploads/tshirt-1.jpg,/uploads/tshirt-2.jpg'
  ];

  return [headers.join(','), sampleData.join(',')].join('\n');
}

/**
 * Validate product data before import
 */
export function validateProductData(product: ProductImportData): string[] {
  const errors: string[] = [];

  if (!product.title || product.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters');
  }

  if (!product.description || product.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  }

  if (!product.type || product.type.trim().length === 0) {
    errors.push('Product type is required');
  }

  if (!product.gender || !['Men', 'Women', 'Unisex'].includes(product.gender)) {
    errors.push('Gender must be Men, Women, or Unisex');
  }

  if (!product.colors || product.colors.trim().length === 0) {
    errors.push('At least one color is required');
  }

  if (!product.price || product.price <= 0) {
    errors.push('Price must be greater than 0');
  }

  if (product.salePrice && product.salePrice >= product.price) {
    errors.push('Sale price must be less than regular price');
  }

  if (product.discount && (product.discount < 0 || product.discount > 100)) {
    errors.push('Discount must be between 0 and 100');
  }

  if (!product.sizes || product.sizes.trim().length === 0) {
    errors.push('At least one size is required');
  }

  return errors;
}

/**
 * Convert product data for database insertion
 */
export function prepareProductForDB(product: ProductImportData): any {
  return {
    title: product.title.trim(),
    description: product.description.trim(),
    type: product.type.trim(),
    gender: product.gender.trim(),
    colors: product.colors.split(',').map(c => c.trim()).filter(c => c.length > 0),
    material: product.material?.trim() || 'Cotton',
    price: product.price,
    salePrice: product.salePrice || null,
    discount: product.discount || null,
    featured: Boolean(product.featured),
    inStock: Boolean(product.inStock),
    sku: product.sku?.trim() || null,
    imageURLs: product.imageURLs.split(',').map(url => url.trim()).filter(url => url.length > 0),
  };
}

/**
 * Convert database product to export format
 */
export function prepareProductForExport(product: any): ProductExportData {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    type: product.type,
    gender: product.gender,
    colors: Array.isArray(product.colors) ? product.colors.join(',') : product.colors,
    material: product.material,
    price: product.price,
    salePrice: product.salePrice || undefined,
    discount: product.discount || undefined,
    featured: product.featured,
    inStock: product.inStock,
    sku: product.sku || undefined,
    sizes: product.productSizes?.map((ps: any) => ps.size?.name || ps.name).join(',') || '',
    imageURLs: Array.isArray(product.imageURLs) ? product.imageURLs.join(',') : product.imageURLs,
    createdAt: product.createdAt?.toISOString() || '',
    updatedAt: product.updatedAt?.toISOString() || '',
  };
}
