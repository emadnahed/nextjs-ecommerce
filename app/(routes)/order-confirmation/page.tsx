"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

const OrderConfirmationPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle2 className="h-24 w-24 text-green-500" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your order. We&apos;ll send you a confirmation email shortly.
          </p>
        </div>

        <div className="space-y-3 pt-6">
          <Button
            className="w-full"
            size="lg"
            onClick={() => router.push("/")}
          >
            Continue Shopping
          </Button>

          <p className="text-sm text-gray-500">
            Questions? Contact us at{" "}
            <Link
              href="mailto:support@foticket.store"
              className="text-blue-600 hover:underline"
            >
              support@foticket.store
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
