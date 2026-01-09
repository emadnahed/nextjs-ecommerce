"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { Star } from "lucide-react";

interface ProductCard {
  data: Product;
}

const ProductCard: React.FC<ProductCard> = ({ data }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/product/${data?.id}`);
  };

  // Upgrade Meesho image URL to higher resolution
  const getImageUrl = (url: string) => {
    if (!url) return '/placeholder.png';

    // Handle malformed concatenated URLs
    const httpsIndex = url.indexOf('https://', 1);
    const httpIndex = url.indexOf('http://', 1);

    if (httpsIndex > 0) {
      url = url.substring(httpsIndex);
    } else if (httpIndex > 0) {
      url = url.substring(httpIndex);
    }

    // For Meesho images: upgrade _512 to _1200 and remove width query param
    if (url.includes('images.meesho.com')) {
      url = url.replace(/\?width=\d+/, '');
      url = url.replace(/_512\./, '_1200.');
    }

    return url;
  };

  // Format price from integer to INR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Parse rating to number
  const rating = parseFloat(data.rating) || 0;

  return (
    <div
      onClick={handleClick}
      className="bg-white group cursor-pointer rounded-xl border p-3 space-y-4 relative hover:shadow-lg transition-shadow"
    >

      <div className="aspect-square rounded-xl bg-gray-100 relative overflow-hidden">
        <Image
          src={getImageUrl(data.image)}
          alt={data.title}
          fill
          className="aspect-square object-cover rounded-md opacity-0 transform scale-100 hover:scale-110 duration-300 transition-all"
          quality={85}
          onLoad={(event: React.SyntheticEvent<HTMLImageElement, Event>) =>
            event.currentTarget.classList.remove("opacity-0")
          }
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>

      <div className="space-y-1">
        <p className="font-semibold text-lg line-clamp-2">{data.title}</p>
        <p className="text-sm text-gray-500">{data.category}</p>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            {data.reviewCount > 0 && (
              <span className="text-xs text-gray-500">
                ({data.reviewCount})
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="font-semibold text-lg">{formatPrice(data.price)}</div>
      </div>
    </div>
  );
};

export default ProductCard;
