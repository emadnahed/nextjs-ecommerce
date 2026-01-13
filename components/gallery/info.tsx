"use client";
import { ShoppingCart, Star, Truck, CheckCircle, XCircle, Shield, RotateCcw, CreditCard, Package } from "lucide-react";

import { Product, ProductDetails, ProductAttribute, ProductReview } from "@/types";
import { Button } from "../ui/button";
import useCart from "@/hooks/use-cart";
import { useState } from "react";

interface InfoProps {
  data: Product;
  productDetails?: ProductDetails | null;
}

const Info: React.FC<InfoProps> = ({ data, productDetails }) => {
  const cart = useCart();
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<string | null>(null);

  const onAddToCart = () => {
    cart.addItem(data);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const rating = parseFloat(data.rating) || 0;
  const detailedData = productDetails?.data;
  const productName = detailedData?.name || data.title;
  const description = detailedData?.description;
  const inStock = detailedData?.in_stock ?? true;
  const variations = detailedData?.variations || [];
  const shipping = detailedData?.shipping;
  const reviewSummary = detailedData?.review_summary?.data;
  const productHighlights = detailedData?.product_details?.product_highlights;
  const additionalDetails = detailedData?.product_details?.additional_details;
  const supplier = detailedData?.suppliers?.[0];
  const mrpDetails = detailedData?.mrp_details;

  const reviews = reviewSummary?.reviews || [];
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const truncatedDescription = description && description.length > 250
    ? description.substring(0, 250) + '...'
    : description;

  return (
    <div className="space-y-6">
      {/* ===== SECTION 1: Essential Info ===== */}
      <div className="space-y-4">
        {/* Product Title */}
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">{productName}</h1>

        {/* Category */}
        <p className="text-sm text-gray-500">
          {[data.topLevelCategory, data.parentCategory, data.category].filter(Boolean).join(' / ')}
        </p>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded">
              <span className="font-semibold text-sm">{rating.toFixed(1)}</span>
              <Star className="w-3 h-3 fill-white" />
            </div>
            <span className="text-sm text-gray-600">
              {reviewSummary?.rating_count || data.reviewCount} ratings
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-3xl font-bold text-black">
            {formatPrice(supplier?.price || data.price)}
          </span>
          {mrpDetails?.mrp && mrpDetails.mrp > (supplier?.price || data.price) && (
            <>
              <span className="text-lg text-gray-500 line-through">
                {formatPrice(mrpDetails.mrp)}
              </span>
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-sm font-semibold">
                {Math.round(((mrpDetails.mrp - (supplier?.price || data.price)) / mrpDetails.mrp) * 100)}% OFF
              </span>
            </>
          )}
        </div>
        <p className="text-xs text-gray-500">{mrpDetails?.title || 'Inclusive of all taxes'}</p>
      </div>

      {/* ===== SECTION 2: Availability & Delivery ===== */}
      <div className="flex flex-wrap items-center gap-4 py-3 border-y border-gray-100">
        {inStock ? (
          <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            In Stock
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-red-600 text-sm font-medium">
            <XCircle className="w-4 h-4" />
            Out of Stock
          </span>
        )}
        {shipping?.show_free_delivery && (
          <span className="flex items-center gap-1.5 text-blue-600 text-sm font-medium">
            <Truck className="w-4 h-4" />
            Free Delivery
          </span>
        )}
        {shipping?.estimated_delivery?.date && (
          <span className="text-sm text-gray-600">
            by {shipping.estimated_delivery.date}
          </span>
        )}
      </div>

      {/* ===== SECTION 3: Variations ===== */}
      {variations.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-900 mb-2">Select Size</p>
          <div className="flex flex-wrap gap-2">
            {variations.map((variation, index) => (
              <button
                key={index}
                onClick={() => setSelectedVariation(variation)}
                className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-colors
                  ${selectedVariation === variation
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 hover:border-gray-400'}`}
              >
                {variation}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ===== SECTION 4: Add to Cart ===== */}
      <Button
        onClick={onAddToCart}
        className="w-full h-12 text-base font-bold rounded-full hover:shadow-lg transition-all"
        size="lg"
        disabled={!inStock}
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        {inStock ? 'Add to cart' : 'Currently Unavailable'}
      </Button>

      {/* ===== SECTION 5: Trust Badges ===== */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="p-2">
          <RotateCcw className="w-5 h-5 mx-auto text-gray-600 mb-1" />
          <p className="text-xs text-gray-600">7 Day<br/>Returns</p>
        </div>
        <div className="p-2">
          <CreditCard className="w-5 h-5 mx-auto text-gray-600 mb-1" />
          <p className="text-xs text-gray-600">Pay on<br/>Delivery</p>
        </div>
        <div className="p-2">
          <Shield className="w-5 h-5 mx-auto text-gray-600 mb-1" />
          <p className="text-xs text-gray-600">Secure<br/>Payment</p>
        </div>
        <div className="p-2">
          <Package className="w-5 h-5 mx-auto text-gray-600 mb-1" />
          <p className="text-xs text-gray-600">Quality<br/>Checked</p>
        </div>
      </div>

      {/* ===== SECTION 6: Seller Info ===== */}
      {supplier && (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="text-xs text-gray-500">Sold by</p>
            <p className="font-medium text-gray-900">{supplier.name}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{supplier.average_rating?.toFixed(1)}</span>
            </div>
            <p className="text-xs text-gray-500">{supplier.rating_count?.toLocaleString()} ratings</p>
          </div>
        </div>
      )}

      {/* ===== SECTION 7: Product Details (Collapsible sections) ===== */}
      <div className="space-y-4 pt-4 border-t border-gray-100">

        {/* Specifications */}
        {(productHighlights?.attributes?.length || additionalDetails?.attributes?.length) && (
          <details className="group" open>
            <summary className="flex items-center justify-between cursor-pointer py-2">
              <h3 className="font-semibold text-gray-900">Product Specifications</h3>
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 space-y-2">
              {productHighlights?.attributes?.map((attr: ProductAttribute, index: number) => (
                <div key={`h-${index}`} className="flex text-sm py-1.5 border-b border-gray-50">
                  <span className="w-1/2 text-gray-500">{attr.display_name}</span>
                  <span className="w-1/2 text-gray-900">{attr.value}</span>
                </div>
              ))}
              {additionalDetails?.attributes?.map((attr: ProductAttribute, index: number) => (
                <div key={`a-${index}`} className="flex text-sm py-1.5 border-b border-gray-50">
                  <span className="w-1/2 text-gray-500">{attr.display_name}</span>
                  <span className="w-1/2 text-gray-900">{attr.value}</span>
                </div>
              ))}
            </div>
          </details>
        )}

        {/* Description */}
        {description && (
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer py-2">
              <h3 className="font-semibold text-gray-900">Product Description</h3>
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2">
              <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                {showFullDescription ? description : truncatedDescription}
              </p>
              {description.length > 250 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  {showFullDescription ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
          </details>
        )}

        {/* Reviews Section - Always Visible */}
        {(reviews.length > 0 || reviewSummary?.rating_count) && (
          <div className="pt-4">
            <h3 className="font-bold text-lg text-gray-900 mb-4">
              Customer Reviews
            </h3>

            {/* Rating Overview Card */}
            {reviewSummary?.rating_count_map && (
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 mb-6">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-gray-900">{reviewSummary.average_rating?.toFixed(1)}</p>
                    <div className="flex gap-0.5 mt-2 justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(reviewSummary.average_rating || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-300 text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{reviewSummary.rating_count?.toLocaleString()} ratings</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviewSummary.rating_count_map?.[star.toString()] || 0;
                      const pct = reviewSummary.rating_count ? Math.round((count / reviewSummary.rating_count) * 100) : 0;
                      return (
                        <div key={star} className="flex items-center gap-2 text-sm">
                          <span className="w-4 text-gray-600 font-medium">{star}</span>
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400 rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-12 text-right text-gray-500">{count.toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Individual Reviews */}
            {reviews.length > 0 && (
              <div className="space-y-4">
                {displayedReviews.map((review: ProductReview, index: number) => (
                  <div key={index} className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {review.reviewer_name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{review.reviewer_name}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(review.created_iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <span className="flex items-center gap-0.5 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                        {review.rating}<Star className="w-3 h-3 fill-white" />
                      </span>
                    </div>
                    {review.comments && (
                      <p className="text-sm text-gray-700 leading-relaxed">{review.comments}</p>
                    )}
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {review.images.slice(0, 4).map((img, i) => (
                          <img
                            key={i}
                            src={img.url}
                            alt=""
                            className="w-16 h-16 object-cover rounded-lg border border-gray-100"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {reviews.length > 3 && (
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="w-full py-3 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    {showAllReviews ? 'Show fewer reviews' : `View all ${reviews.length} reviews`}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* SKU */}
      <p className="text-xs text-gray-400 pt-2">SKU: {data.productId}</p>
    </div>
  );
};

export default Info;
