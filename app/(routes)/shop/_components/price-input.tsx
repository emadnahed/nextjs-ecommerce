"use client";

import { getCategoryProducts } from "@/lib/apiCalls";
import { Product } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type PriceInputProps = {
  data: Product[];
};

const PriceInput = ({ data }: PriceInputProps) => {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [value, setValue] = useState<number>(0);

  const handleSortChange = useCallback(
    async (value: string) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      if (!value || +value === maxPrice) {
        current.delete("price");
      } else {
        current.set("price", value);
      }
      const search = current.toString();
      const query = search ? `?${search}` : "";

      await router.replace(`${pathName}${query}`);
    },
    [searchParams, pathName, router, maxPrice]
  );

  useEffect(() => {
    const fetchProductPrice = async () => {
      let products = data;
      
      if (pathName.startsWith("/shop/") && pathName !== "/shop") {
        const urlString = pathName.substring("/shop/".length);
        const categoryData = await getCategoryProducts(urlString);
        products = categoryData || [];
      }
      
      if (products && products.length > 0) {
        const prices = products.map((product: Product) => {
          if (product.salePrice && product.salePrice > 0) {
            return parseFloat(product.salePrice.toString());
          } else {
            return parseFloat(product.price.toString());
          }
        });
        
        const max = Math.max(...prices);
        const min = Math.min(...prices);
        
        setMaxPrice(max);
        setMinPrice(min);
        setValue(max);
      }
    };

    fetchProductPrice();
  }, [pathName, data]);

  return (
    <div className="range-container mt-2">
      <div className="range-label flex justify-between">
        <div className="flex flex-col gap-y-1">
          <p className="font-semibold">Price</p>
          <span className="font-serif">₹{value?.toLocaleString('en-IN')}</span>
        </div>
      </div>
      <input
        type="range"
        min={minPrice}
        max={maxPrice}
        value={value || 0}
        step="1"
        onChange={(e) => {
          handleSortChange(e.target.value);
          setValue(parseFloat(e.target.value));
        }}
        className=" accent-neutral-800 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      />
    </div>
  );
};

export default PriceInput;
