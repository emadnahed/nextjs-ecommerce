import { type Metadata } from "next";
import ProductItem from "./_components/product-item";
import { getProductFromDB } from "@/lib/serverDataAccess";
import Footer from "@/components/footer";
import { siteConfig } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: { productId: string };
}): Promise<Metadata> {
  console.log('[ProductPage] Fetching metadata for product:', params.productId);
  const getProducts = await getProductFromDB(params.productId);

  if (!getProducts)
    return {
      title: "Foticket Store",
      description: "E-ecommerce, selling products, and new productivity",
    };

  return {
    title: `${getProducts.title} | ${siteConfig.name}`,
    description: `${getProducts.title} - ${getProducts.category}`,
  };
}

const ProductPage = ({ params }: { params: { productId: string } }) => {
  return (
    <div>
      <ProductItem />
      <Footer />
    </div>
  );
};

export default ProductPage;
