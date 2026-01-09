import ProductCard from "@/components/ui/product-card";
import { getAllProductsPrioritizedFromDB } from "@/lib/serverDataAccess";
import filteredData from "@/app/utils/filteredData";
import { Product } from "@/types";

export const metadata = {
  title: "Shop | Demo Store",
  description: `Shop for e-ecommerce, selling products, and new productivity`,
};

const ShopPage = async ({
  searchParams,
}: {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}) => {
  console.log('[ShopPage] Fetching products with prioritization...');
  // Products with productDetails are prioritized (shown first)
  const data = await getAllProductsPrioritizedFromDB();
  console.log('[ShopPage] Products fetched:', data.length);
  let searchMsg;

  let filtered: Product[] | undefined;

  // Apply filters if any filter params are present
  if (searchParams.sort || searchParams.price || searchParams.q ||
      searchParams.topLevelCategory || searchParams.category || searchParams.parentCategory) {
    filtered = filteredData(searchParams, data);
  }

  if (filtered && filtered.length <= 0) {
    if (searchParams.q) {
      return (
        <p className="font-serif text-lg">
          There are no products that match{" "}
          <span className="font-bold">{`"${searchParams.q}"`}</span>
        </p>
      );
    }
    if (searchParams.topLevelCategory) {
      return (
        <p className="font-serif text-lg">
          No products found in{" "}
          <span className="font-bold">{searchParams.topLevelCategory}</span>
        </p>
      );
    }
    if (searchParams.category) {
      return (
        <p className="font-serif text-lg">
          No products found in{" "}
          <span className="font-bold">{searchParams.category}</span>
        </p>
      );
    }
  }

  if (searchParams.q && filtered && filtered.length > 0) {
    searchMsg = (
      <p className="font-serif text-lg mb-3">
        Showing {filtered.length} results for{" "}
        <span className="font-bold">{`"${searchParams.q}"`}</span>
      </p>
    );
  } else if (searchParams.topLevelCategory && filtered) {
    searchMsg = (
      <p className="font-serif text-lg mb-3">
        Showing {filtered.length} products in{" "}
        <span className="font-bold">{searchParams.topLevelCategory}</span>
      </p>
    );
  } else if (searchParams.category && filtered) {
    searchMsg = (
      <p className="font-serif text-lg mb-3">
        Showing {filtered.length} products in{" "}
        <span className="font-bold">{searchParams.category}</span>
      </p>
    );
  }

  return (
    <>
      {searchMsg ? searchMsg : ""}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {(filtered || data)?.map((product: any) => (
          <ProductCard key={product.id} data={product} />
        ))}
      </div>
    </>
  );
};

export default ShopPage;
