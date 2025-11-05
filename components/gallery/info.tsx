"use client";
import { ShoppingCart } from "lucide-react";

import { Product } from "@/types";
import { Button } from "../ui/button";
import useCart from "@/hooks/use-cart";
import { useState } from "react";
import { formatPrice } from "@/lib/utils/currency";

interface InfoProps {
  data: Product;
  availableSizes: any[];
}

const Info: React.FC<InfoProps> = ({ data, availableSizes }) => {
  const [size, setSize] = useState("");

  const cart = useCart();

  const onAddToCart = () => {
    const productWithSize = {
      ...data,
      size: size,
    };
    cart.addItem(productWithSize);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{data.title}</h1>

      {/* Product Type & Gender */}
      <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
        <span className="font-medium">{data.type}</span>
        <span>•</span>
        <span>{data.gender}</span>
      </div>

      {/* Price */}
      <div className="mt-3 flex items-end justify-between">
        {data.salePrice && data.salePrice > 0 ? (
          <div className="font-semibold">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 line-through">
                {formatPrice(data?.price)}
              </span>
              <div className="bg-red-600 text-sm text-white p-1 px-2 font-semibold rounded-sm">
                -{data?.discount}% OFF
              </div>
            </div>
            <p className="text-2xl text-gray-900 font-semibold mt-1">
              {formatPrice(data.salePrice)}
            </p>
          </div>
        ) : (
          <p className="text-2xl text-gray-900 font-semibold">
            {formatPrice(data?.price)}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="flex items-center gap-x-4 mt-4">
        <span className="text-sm text-gray-700 leading-relaxed">
          {data?.description}
        </span>
      </div>

      <hr className="my-4" />

      {/* Product Details */}
      <div className="space-y-3">
        {/* Colors */}
        {data.colors && data.colors.length > 0 && (
          <div>
            <span className="text-sm font-semibold text-gray-900">Available Colors:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {data.colors.map((color, index) => (
                <span
                  key={index}
                  className="text-sm px-2 py-1 bg-gray-100 rounded-md"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Material */}
        {data.material && (
          <div>
            <span className="text-sm font-semibold text-gray-900">Material:</span>{" "}
            <span className="text-sm text-gray-700">{data.material}</span>
          </div>
        )}

        {/* SKU */}
        {data.sku && (
          <div>
            <span className="text-sm font-semibold text-gray-900">SKU:</span>{" "}
            <span className="text-sm text-gray-700">{data.sku}</span>
          </div>
        )}
      </div>

      <hr className="my-4" />

      {/* Size Selection */}
      <div className="flex mt-2 flex-wrap gap-2 flex-col">
        <span className="text-xl font-semibold py-2 text-gray-900">Select Size</span>
        <div className="flex flex-wrap gap-2">
          {availableSizes && availableSizes.length > 0 ? (
            availableSizes.map((sizeItem: any) => (
              <Button
                type="button"
                className={`flex min-w-[48px] items-center justify-center rounded-full border px-3 py-2 text-sm ${
                  size === sizeItem.name ? "ring-2 ring-neutral-600 bg-neutral-900 text-white" : ""
                }`}
                key={sizeItem.id}
                onClick={() => setSize(sizeItem.name)}
              >
                {sizeItem.name}
              </Button>
            ))
          ) : (
            <p className="text-sm text-gray-500">No sizes available</p>
          )}
        </div>
      </div>

      {/* Add to Cart */}
      <div className="mt-6 flex items-center gap-x-3">
        <Button
          disabled={!size}
          onClick={onAddToCart}
          className={`flex items-center gap-x-2 ${
            !size
              ? "disabled:pointer-events-auto relative z-10 cursor-not-allowed opacity-50"
              : ""
          }`}
        >
          Add To Cart
          <ShoppingCart size={20} />
        </Button>
      </div>
      {!size && (
        <p className="text-sm text-gray-500 mt-2">Please select a size to add to cart</p>
      )}
    </div>
  );
};

export default Info;
