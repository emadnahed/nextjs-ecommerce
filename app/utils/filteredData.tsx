import { Product } from "@/types";

const filteredData = (params: any, data: Product[]) => {
  let filtered = [...data];

  const getPriceForSorting = (product: Product) => {
    return product.salePrice && product.salePrice > 0
      ? product.salePrice
      : product.price;
  };

  // Filter by product type
  if (params.type) {
    filtered = filtered.filter((product: Product) =>
      product.type.toLowerCase() === params.type.toLowerCase()
    );
  }

  // Filter by gender
  if (params.gender) {
    filtered = filtered.filter((product: Product) =>
      product.gender.toLowerCase() === params.gender.toLowerCase()
    );
  }

  // Filter by color (check if colors array includes the color)
  if (params.color) {
    filtered = filtered.filter((product: Product) =>
      product.colors?.some(c => c.toLowerCase() === params.color.toLowerCase())
    );
  }

  // Filter by price
  if (params.price) {
    filtered = filtered.filter((product: Product) => {
      if (product.salePrice && product.salePrice > 0) {
        return +product.salePrice <= +params.price;
      } else {
        return +product.price <= +params.price;
      }
    });
  }

  // Search query
  if (params.q) {
    filtered = filtered.filter((product: Product) =>
      product.title.toLowerCase().includes(params.q.toLowerCase())
    );
  }

  // Sort
  if (params.sort === "price-low-to-high") {
    filtered.sort(
      (a: any, b: any) => +getPriceForSorting(a) - +getPriceForSorting(b)
    );
  } else if (params.sort === "price-high-to-low") {
    filtered.sort(
      (a: any, b: any) => +getPriceForSorting(b) - +getPriceForSorting(a)
    );
  } else if (params.sort === "latest-arrivals") {
    filtered.sort(
      (a: any, b: any) =>
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  return filtered;
};

export default filteredData;
