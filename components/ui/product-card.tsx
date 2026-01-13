"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { Expand, ShoppingCart, Star } from "lucide-react";
import IconButton from "@/components/ui/icon-button";
import { MouseEventHandler } from "react";
import useCart from "@/hooks/use-cart";

interface ProductCard {
  data: Product;
}

const ProductCard: React.FC<ProductCard> = ({ data }) => {
  const router = useRouter();
  const cart = useCart();

  const handleClick = () => {
    router.push(`/product/${data?.id}`);
  };

  const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    router.push(`/product/${data?.id}`);
  };

  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    cart.addItem(data);
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
    <div onClick={handleClick} className="bg-white group cursor-pointer rounded-lg border border-gray-200 p-2 sm:p-3 space-y-2 sm:space-y-3 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      {/* Images */}
      <div className="aspect-square rounded-md bg-gray-100 relative overflow-hidden">
        <Image
          src={getImageUrl(data.image)}
          alt={data.title}
          fill
          className="aspect-square object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
          quality={85}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      
      {/* Description */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
           {rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-black text-black" />
              <span className="text-[10px] sm:text-xs text-gray-700">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <p className="font-medium text-gray-900 text-xs sm:text-sm line-clamp-2 leading-tight hover:underline">
          {data.title}
        </p>
      </div>

      {/* Price & Action */}
      <div className="space-y-2 sm:space-y-3 mt-auto">
        <div className="font-bold text-lg sm:text-xl text-green-700">
          {formatPrice(data.price)}
        </div>
        
        <button
          onClick={onAddToCart}
          className="w-full rounded-full border border-primary text-primary font-bold py-1 px-3 sm:py-1.5 sm:px-4 text-xs sm:text-sm hover:bg-primary/5 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
