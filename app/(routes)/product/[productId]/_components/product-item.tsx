"use client";

import Gallery from "@/components/gallery/gallery";
import Info from "@/components/gallery/info";
import Container from "@/components/ui/container";
import ProductCard from "@/components/ui/product-card";
import { type Product, type ProductDetails } from "@/types";
import { useQueries } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import LoadingSkeleton from "./loading-skeleton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";

const ProductItem = () => {
  const { productId } = useParams();

  const [productQuery, relatedQuery, detailsQuery] = useQueries({
    queries: [
      {
        queryKey: ["single product", productId],
        queryFn: async () =>
          await axios.get(`/api/product/${productId}`).then((res) => res.data),
      },
      {
        queryKey: ["related products"],
        queryFn: async () => {
          const response = await axios.get("/api/product/");
          return response.data;
        },
      },
      {
        queryKey: ["product details", productId],
        queryFn: async () => {
          // First get the product to get its productId (string ID)
          const product = await axios.get(`/api/product/${productId}`).then((res) => res.data);
          if (product?.productId) {
            try {
              const details = await axios.get(`/api/product-details/${product.productId}`);
              return details.data;
            } catch {
              return null;
            }
          }
          return null;
        },
      },
    ],
  });

  if (productQuery.isLoading || relatedQuery.isLoading) {
    return (
      <Container>
        <LoadingSkeleton />
      </Container>
    );
  }

  if (!productQuery.data || !relatedQuery.data) {
    return <Container>Something went wrong!</Container>;
  }

  const productDetails: ProductDetails | null = detailsQuery.data;

  // Filter related products by same category, excluding current product
  const filteredData: Product[] = relatedQuery?.data?.filter(
    (item: Product) =>
      item.category === productQuery?.data?.category &&
      productQuery.data.id !== item.id
  ).slice(0, 4) || []; // Limit to 4 related products

  // Use images from productDetails if available, otherwise use product image
  const images = productDetails?.data?.images && productDetails.data.images.length > 0
    ? productDetails.data.images
    : productQuery.data?.image
      ? [productQuery.data.image]
      : [];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Container>
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          {/* Back navigation */}
          <Link href="/shop" className="inline-flex items-center gap-x-1 text-gray-600 hover:text-gray-900 mb-6">
            <ArrowBackIcon style={{ width: "18px", height: "18px" }} />
            <span className="text-sm font-medium">Back to shop</span>
          </Link>

          {/* Main product section */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="lg:grid lg:grid-cols-2 lg:gap-0">
              {/* Gallery - sticky on desktop */}
              <div className="lg:sticky lg:top-4 lg:self-start p-4 lg:p-8">
                <Gallery images={images} />
              </div>

              {/* Product Info */}
              <div className="p-4 lg:p-8 lg:border-l border-gray-100">
                <Info data={productQuery?.data} productDetails={productDetails} />
              </div>
            </div>
          </div>

          {/* Related Products */}
          {filteredData.length > 0 && (
            <div className="mt-12">
              <div className="mb-6">
                <h3 className="font-bold text-2xl text-gray-900">You May Also Like</h3>
                <p className="text-gray-500 mt-1">More products in {productQuery.data.category}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredData?.map((item: Product) => {
                  return <ProductCard key={item.id} data={item} />;
                })}
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default ProductItem;
