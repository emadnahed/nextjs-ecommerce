import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { paymentService } from "@/lib/payment/payment-service";
import { PaymentMethod, PaymentStatus } from "@/lib/payment/types";

/**
 * POST /api/payment/verify
 * Verify a payment and update order status
 */
export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Get order from database
    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Verify payment with payment provider
    const verification = await paymentService.verifyPayment(
      order.paymentMethod as PaymentMethod,
      order.paymentId || orderId
    );

    // Update order status based on verification
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: verification.status,
        isPaid: verification.status === PaymentStatus.SUCCESS,
      },
    });

    return NextResponse.json({
      success: verification.success,
      order: updatedOrder,
      paymentStatus: verification.status,
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: error.message || "Payment verification failed" },
      { status: 500 }
    );
  }
}
