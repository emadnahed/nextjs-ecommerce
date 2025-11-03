import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { PaymentStatus } from "@/lib/payment/types";

/**
 * POST /api/payment/webhook/cashfree
 * Webhook handler for Cashfree payment notifications
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Cashfree webhook received:", body);

    // Validate webhook signature (important for production)
    // const signature = request.headers.get("x-webhook-signature");
    // Implement signature verification here

    const { orderId, orderStatus, orderAmount, paymentMethod, paymentTime } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID missing in webhook" },
        { status: 400 }
      );
    }

    // Find order in database
    const order = await db.order.findFirst({
      where: {
        OR: [
          { id: orderId },
          { paymentId: orderId },
        ],
      },
    });

    if (!order) {
      console.error(`Order not found for webhook: ${orderId}`);
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Map Cashfree status to our PaymentStatus
    let paymentStatus: PaymentStatus;
    let isPaid = false;

    switch (orderStatus) {
      case "PAID":
        paymentStatus = PaymentStatus.SUCCESS;
        isPaid = true;
        break;
      case "ACTIVE":
        paymentStatus = PaymentStatus.PENDING;
        break;
      case "EXPIRED":
      case "TERMINATED":
        paymentStatus = PaymentStatus.CANCELLED;
        break;
      default:
        paymentStatus = PaymentStatus.FAILED;
    }

    // Update order in database
    await db.order.update({
      where: { id: order.id },
      data: {
        paymentStatus,
        isPaid,
      },
    });

    console.log(`Order ${order.id} updated: ${paymentStatus}`);

    // Return success response to Cashfree
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Cashfree webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
