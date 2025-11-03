import filteredData from "@/app/utils/filteredData";
import ProductCard from "@/components/ui/product-card";
import { siteConfig } from "@/config/site";
import { getProductsByTypeFromDB } from "@/lib/serverDataAccess";
import { Product } from "@/types";
import { type Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  console.log('[CategoryPage] Fetching metadata for category:', params.category);
  const data = await getProductsByTypeFromDB(params.category);
  if (!data || data.length <= 0)
    return {
      title: "Demo Store",
      description: "E-ecommerce, selling products, and new productivity",
    };

  return {
    title: `${
      data[0]?.type?.[0]?.toUpperCase() + data[0]?.type?.slice(1)
    } | ${siteConfig.name}`,
    description: data[0]?.description,
  };
}

const SearchPage = async ({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  console.log('[CategoryPage] Fetching products for category:', params.category);
  const data = await getProductsByTypeFromDB(params.category);
  console.log('[CategoryPage] Products fetched:', data.length);

  let filtered: Product[] | undefined;

  if (searchParams.sort || searchParams.price) {
    filtered = filteredData(searchParams, data);
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {(filtered || data)?.map((product: Product) => (
          <ProductCard key={product.id} data={product} />
        ))}
      </div>
    </>
  );
};

export default SearchPage;
