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
    <div onClick={handleClick} className="bg-white group cursor-pointer rounded-xl border p-3 space-y-4 hover:shadow-xl transition-all duration-300">
      {/* Images and Actions */}
      <div className="aspect-square rounded-xl bg-gray-100 relative">
        <Image
          src={getImageUrl(data.image)}
          alt={data.title}
          fill
          className="aspect-square object-cover rounded-xl"
          quality={85}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
          <div className="flex gap-x-6 justify-center">
            <IconButton 
              onClick={onPreview} 
              icon={<Expand size={20} className="text-gray-600" />} 
            />
            <IconButton
              onClick={onAddToCart} 
              icon={<ShoppingCart size={20} className="text-gray-600" />} 
            />
          </div>
        </div>
      </div>
      {/* Description */}
      <div>
        <p className="font-semibold text-lg line-clamp-1">{data.title}</p>
        <p className="text-sm text-gray-500">{data.category}</p>
      </div>
      {/* Price & Rating */}
      <div className="flex items-center justify-between">
        <div className="font-semibold text-lg">{formatPrice(data.price)}</div>
        {rating > 0 && (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
