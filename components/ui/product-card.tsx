"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/types";

interface ProductCard {
  data: Product;
}

const ProductCard: React.FC<ProductCard> = ({ data }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/product/${data?.id}`);
  };

  // Handle both local and S3 URLs
  const getImageUrl = (url: string) => {
    if (url.startsWith('http')) {
      // S3 or external URL
      return url;
    } else {
      // Local upload
      return url;
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white group cursor-pointer rounded-xl border p-3 space-y-4 relative"
    >
      {/* Discount Badge */}
      {data.discount && data.discount > 0 && (
        <div className="absolute top-2.5 right-2 bg-red-600 text-sm text-white p-1 px-3 font-semibold rounded-sm z-10">
          -{data.discount}% OFF
        </div>
      )}

      <div className="aspect-square rounded-xl bg-gray-100 relative overflow-hidden">
        <Image
          src={getImageUrl(data.imageURLs[0])}
          alt={data.title}
          fill
          className="aspect-square object-cover rounded-md opacity-0 hover:opacity-100 transform scale-100 hover:scale-110 duration-300 transition-all"
          onLoad={(event: React.SyntheticEvent<HTMLImageElement, Event>) =>
            event.currentTarget.classList.remove("opacity-0")
          }
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div>
        <p className="font-semibold text-lg">{data.title}</p>
        <p className="text-sm text-gray-500">
          {data.type} • {data.gender}
        </p>
        {/* Color indicators */}
        {data.colors && data.colors.length > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-gray-500">
              {data.colors.length > 1
                ? `${data.colors.length} colors`
                : data.colors[0]
              }
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        {data.salePrice && data.salePrice > 0 ? (
          <div className="font-semibold">
            ${Number(data.salePrice).toFixed(2)}{" "}
            <span className="text-gray-500 line-through text-sm">
              ${Number(data?.price).toFixed(2)}
            </span>
          </div>
        ) : (
          <div className="font-semibold">${Number(data?.price).toFixed(2)}</div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
