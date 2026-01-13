"use client";
import { SearchIcon, Loader2, X } from "lucide-react";
import { Input } from "./ui/input";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Product } from "@/types";

const NavbarSearch = () => {
  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchStr = searchParams.get("q");

  // Search products from API
  const searchProducts = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}&limit=6`
      );
      if (response.ok) {
        const data = await response.json();
        setResults(data);
        setShowDropdown(true);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchProducts(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, searchProducts]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = async () => {
    if (search.length >= 1) {
      setShowDropdown(false);
      router.push(`/shop?q=${encodeURIComponent(search)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
    if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const handleProductClick = (productId: string) => {
    setShowDropdown(false);
    setSearch("");
    router.push(`/product/${productId}`);
  };

  const clearSearch = () => {
    setSearch("");
    setResults([]);
    setShowDropdown(false);
  };

  useEffect(() => {
    if (pathname !== "/shop") setSearch("");
  }, [pathname]);

  useEffect(() => {
    if (searchStr) setSearch(searchStr);
  }, [searchStr]);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get optimized image URL
  const getImageUrl = (url: string) => {
    if (!url) return "/placeholder.png";
    const httpsIndex = url.indexOf("https://", 1);
    if (httpsIndex > 0) {
      url = url.substring(httpsIndex);
    }
    return url;
  };

  return (
    <div className="flex mx-auto relative w-full max-w-xl" ref={dropdownRef}>
      <Input
        className="w-full pr-20 rounded-full border-none bg-white text-black placeholder:text-gray-500 h-10"
        placeholder="Search for products..."
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setShowDropdown(true)}
        value={search}
      />
      {search && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-12 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={14} className="text-gray-400" />
        </button>
      )}
      <div
        className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-yellow-400 rounded-full p-1.5 cursor-pointer hover:bg-yellow-500 transition"
        onClick={handleSearchSubmit}
      >
        {isLoading ? (
          <Loader2 size={16} className="text-black animate-spin" />
        ) : (
          <SearchIcon size={16} className="text-black" />
        )}
      </div>

      {/* Search Results Dropdown */}
      {showDropdown && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            {results.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="w-12 h-12 relative flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={getImageUrl(product.image)}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.title}
                  </p>
                  <p className="text-xs text-gray-500">{product.category}</p>
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {formatPrice(product.price)}
                </div>
              </div>
            ))}
          </div>
          <div
            onClick={handleSearchSubmit}
            className="p-3 text-center text-sm font-medium text-blue-600 hover:bg-blue-50 cursor-pointer border-t border-gray-200"
          >
            View all results for "{search}"
          </div>
        </div>
      )}

      {/* No Results */}
      {showDropdown && results.length === 0 && search.length >= 2 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 p-4 text-center">
          <p className="text-sm text-gray-500">No products found for "{search}"</p>
        </div>
      )}
    </div>
  );
};

export default NavbarSearch;
