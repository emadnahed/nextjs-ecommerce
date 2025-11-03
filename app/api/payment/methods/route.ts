import { NextResponse } from "next/server";
import { paymentService } from "@/lib/payment/payment-service";

/**
 * GET /api/payment/methods
 * Get all available payment methods
 */
export async function GET() {
  try {
    const methods = paymentService.getAvailablePaymentMethods();
    return NextResponse.json({ methods });
  } catch (error: any) {
    console.error("Error getting payment methods:", error);
    return NextResponse.json(
      { error: "Failed to get payment methods" },
      { status: 500 }
    );
  }
}
