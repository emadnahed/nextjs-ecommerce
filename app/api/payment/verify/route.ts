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

    console.log(`\n[Verify] ===== REQUEST =====`);
    console.log(`[Verify] OrderId: ${orderId}`);

    if (!orderId) {
      console.log(`[Verify] FAIL: Missing orderId`);
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
      console.log(`[Verify] FAIL: Order not found`);
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    console.log(`[Verify] Order found: method=${order.paymentMethod}, paymentId=${order.paymentId}`);

    // Verify payment with payment provider
    const verification = await paymentService.verifyPayment(
      order.paymentMethod as PaymentMethod,
      order.paymentId || orderId
    );

    console.log(`[Verify] ===== VERIFICATION RESULT =====`);
    console.log(`[Verify] Success: ${verification.success}, Status: ${verification.status}`);

    // Update order status based on verification
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: verification.status,
        isPaid: verification.status === PaymentStatus.SUCCESS,
      },
    });

    console.log(`[Verify] Order updated: isPaid=${updatedOrder.isPaid}`);

    return NextResponse.json({
      success: verification.success,
      order: updatedOrder,
      paymentStatus: verification.status,
    });
  } catch (error: any) {
    console.error("[Verify] ERROR:", error.message);
    return NextResponse.json(
      { error: error.message || "Payment verification failed" },
      { status: 500 }
    );
  }
}
