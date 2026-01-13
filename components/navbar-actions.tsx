"use client";

import { useRouter } from "next/navigation";
import { Package, ShoppingCart } from "lucide-react";
import useCart from "@/hooks/use-cart";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const NavbarActions = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { isSignedIn } = useUser();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const router = useRouter();
  const cart = useCart();

  if (!isMounted) {
    return null;
  }

  const filteredShop = cart?.items?.map((item) => item.quantity);

  const shopCount = filteredShop?.reduce((a, b) => {
    return a + b;
  }, 0);

  return (
    <div className="flex items-center gap-x-2">
      {isSignedIn && (
        <Button
          onClick={() => router.push("/my-orders")}
          variant="ghost"
          size="icon"
          title="My Orders"
          className="rounded-full"
        >
          <Package size={20} />
        </Button>
      )}
      <Button
        onClick={() => router.push("/cart")}
        variant="ghost" 
        size="icon"
        className="rounded-full relative"
      >
        <ShoppingCart size={20} />
        {shopCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
            {shopCount > 9 ? "9+" : shopCount}
          </span>
        )}
      </Button>
    </div>
  );
};

export default NavbarActions;
