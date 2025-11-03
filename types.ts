export interface Product {
  id: string;
  type: string;
  gender: string;
  colors: string[];
  material: string;
  description: string;
  title: string;
  price: string;
  featured: boolean;
  inStock: boolean;
  imageIds: string[];
  imageURLs?: string[]; // Computed field for display
  discount?: number;
  salePrice?: number;
  sku?: string;
  size?: string;
  productSizes?: ProductSize[];
}

export interface ProductSize {
  id: string;
  productId: string;
  sizeId: string;
  name?: string;
  size?: Size;
}

export interface Size {
  id: string;
  name: string;
}

export interface Image {
  id: string;
  url: string;
}

export interface SelectedSize {
  id: string;
  name: string;
}

export interface RequestData {
  title: string;
  description: string;
  price: number;
  files: File[];
  featured: boolean;
  type: string;
  gender: string;
  colors: string[];
  material: string;
  sizes: SelectedSize[];
  discount?: number;
  sku?: string;
}
