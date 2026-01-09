import { Product } from "@/types";

const filteredData = (params: any, data: Product[]) => {
  let filtered = [...data];

  // Filter by category
  if (params.category) {
    filtered = filtered.filter((product: Product) =>
      product.category.toLowerCase() === params.category.toLowerCase()
    );
  }

  // Filter by top-level category
  if (params.topLevelCategory) {
    filtered = filtered.filter((product: Product) =>
      product.topLevelCategory.toLowerCase() === params.topLevelCategory.toLowerCase()
    );
  }

  // Filter by parent category
  if (params.parentCategory) {
    filtered = filtered.filter((product: Product) =>
      product.parentCategory.toLowerCase() === params.parentCategory.toLowerCase()
    );
  }

  // Filter by price (max price)
  if (params.price) {
    filtered = filtered.filter((product: Product) =>
      product.price <= +params.price
    );
  }

  // Filter by min price
  if (params.minPrice) {
    filtered = filtered.filter((product: Product) =>
      product.price >= +params.minPrice
    );
  }

  // Search query (search in title and category)
  if (params.q) {
    const query = params.q.toLowerCase();
    filtered = filtered.filter((product: Product) =>
      product.title.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  }

  // Sort
  if (params.sort === "price-low-to-high") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (params.sort === "price-high-to-low") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (params.sort === "rating-high-to-low") {
    filtered.sort((a, b) => {
      const ratingA = parseFloat(a.rating) || 0;
      const ratingB = parseFloat(b.rating) || 0;
      return ratingB - ratingA;
    });
  } else if (params.sort === "most-reviewed") {
    filtered.sort((a, b) => b.reviewCount - a.reviewCount);
  }

  return filtered;
};

export default filteredData;
