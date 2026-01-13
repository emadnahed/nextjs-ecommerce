"use client";

import { useState } from "react";
import useCart from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils/currency";
import { CheckoutForm } from "./checkout-form";
import { X } from "lucide-react";

export function Summary() {
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const items = useCart((state) => state.items);
  const router = useRouter();

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.totalPrice);
  }, 0);

  const handleCheckoutClick = () => {
    if (items.length === 0) {
      return;
    }
    setShowCheckoutForm(true);
  };

  const handleBackToCart = () => {
    setShowCheckoutForm(false);
  };

  const handleOrderSuccess = () => {
    setShowCheckoutForm(false);
    router.push("/order-confirmation");
  };

  if (showCheckoutForm) {
    return (
      <div className="mt-16 rounded-lg bg-gray-50 p-6 lg:mt-0 lg:col-span-5 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Checkout</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackToCart}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pr-2 -mr-2">
          <CheckoutForm 
            onSuccess={handleOrderSuccess} 
            onBack={handleBackToCart} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between pt-4">
          <div className="text-base font-medium text-gray-900">Subtotal</div>
          <p className="text-gray-900">{formatPrice(totalPrice)}</p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <div className="text-base font-medium text-gray-900">Shipping</div>
          <p className="text-gray-900">
            {totalPrice > 0 ? "Calculated at checkout" : "Free"}
          </p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <div className="text-base font-medium text-gray-900">Total</div>
          <p className="text-lg font-semibold text-gray-900">
            {formatPrice(totalPrice)}
          </p>
        </div>
      </div>
      <Button
        onClick={handleCheckoutClick}
        disabled={items.length === 0}
        className="w-full mt-6 rounded-full font-bold text-lg hover:bg-primary/90"
      >
        {items.length > 0 ? "Proceed to Checkout" : "Your cart is empty"}
      </Button>
    </div>
  );
}

export default Summary;
