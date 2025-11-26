import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { PaymentStatus } from "@/lib/payment/types";
import { SprintNxtPaymentProvider } from "@/lib/payment/providers/sprintnxt-provider";

const isProduction = process.env.NODE_ENV === "production";

/**
 * POST /api/payment/webhook/sprintnxt
 * Webhook handler for SprintNxt UPI payment notifications
 *
 * SprintNxt sends encrypted callback data in 'encdata' field
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("SprintNxt webhook received:", body);

    // SprintNxt sends encrypted data in 'encdata' field
    const { encdata } = body;

    // In production, require encrypted payload
    if (!encdata) {
      if (isProduction) {
        console.error("SprintNxt webhook missing encrypted payload in production");
        return NextResponse.json(
          { error: "Invalid webhook payload" },
          { status: 400 }
        );
      }
      // Allow plain callbacks only in development/UAT
      return await processPlainCallback(body);
    }

    // Decrypt and process the callback
    let callbackResult;
    try {
      const sprintNxtProvider = new SprintNxtPaymentProvider();
      callbackResult = await sprintNxtProvider.processCallback(encdata);
    } catch (decryptError: any) {
      console.error("SprintNxt webhook decryption failed:", decryptError.message);
      // Do NOT fall back to plain callback on decryption failure - this is a security risk
      return NextResponse.json(
        { error: "Webhook payload decryption failed" },
        { status: 400 }
      );
    }

    if (!callbackResult.referenceId) {
      console.error("Reference ID missing in SprintNxt callback");
      return NextResponse.json(
        { error: "Reference ID missing in callback" },
        { status: 400 }
      );
    }

    // Find order by payment reference ID
    const order = await db.order.findFirst({
      where: {
        OR: [
          { paymentId: callbackResult.referenceId },
          { id: callbackResult.data?.orderid },
        ],
      },
    });

    if (!order) {
      console.error(`Order not found for SprintNxt callback: ${callbackResult.referenceId}`);
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Determine if payment is successful
    const isPaid = callbackResult.status === PaymentStatus.SUCCESS;

    // Update order in database
    await db.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: callbackResult.status,
        isPaid,
        // Store transaction details in metadata if needed
      },
    });

    console.log(`Order ${order.id} updated via SprintNxt webhook: ${callbackResult.status}`);

    // Return success response to SprintNxt
    return NextResponse.json({
      success: true,
      message: "Callback processed successfully",
    });
  } catch (error: any) {
    console.error("SprintNxt webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

/**
 * Process plain (non-encrypted) callback for testing/UAT only
 * This function is disabled in production for security
 */
async function processPlainCallback(body: any) {
  // Security guard: Block plain callbacks in production
  if (isProduction) {
    console.error("Plain callback processing blocked in production");
    return NextResponse.json(
      { error: "This endpoint requires encrypted payload in production" },
      { status: 403 }
    );
  }

  const {
    referenceid,
    referenceId,
    txnStatus,
    status,
    orderid,
    amount,
    upiTxnId,
  } = body;

  const refId = referenceid || referenceId;

  if (!refId && !orderid) {
    console.log("Plain callback received without reference ID or order ID:", body);
    return NextResponse.json(
      { error: "Reference ID or Order ID required", received: body },
      { status: 400 }
    );
  }

  // Find order
  const order = await db.order.findFirst({
    where: {
      OR: [
        ...(refId ? [{ paymentId: refId }] : []),
        ...(orderid ? [{ id: orderid }] : []),
      ],
    },
  });

  if (!order) {
    console.error(`Order not found for reference: ${refId || orderid}`);
    return NextResponse.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  // Map SprintNxt status - handle both string and numeric status
  const statusValue = txnStatus || status;
  let paymentStatus: PaymentStatus;
  let isPaid = false;

  // Handle string status values
  if (typeof statusValue === "string") {
    const upperStatus = statusValue.toUpperCase();
    if (upperStatus === "SUCCESS" || upperStatus === "PAID") {
      paymentStatus = PaymentStatus.SUCCESS;
      isPaid = true;
    } else if (upperStatus === "PENDING" || upperStatus === "INITIATED") {
      paymentStatus = PaymentStatus.PENDING;
    } else if (upperStatus === "EXPIRED" || upperStatus === "CANCELLED") {
      paymentStatus = PaymentStatus.CANCELLED;
    } else {
      paymentStatus = PaymentStatus.FAILED;
    }
  } else {
    // Handle numeric status codes
    const statusCode = parseInt(statusValue);
    switch (statusCode) {
      case 1: // SUCCESS
        paymentStatus = PaymentStatus.SUCCESS;
        isPaid = true;
        break;
      case 2: // INITIATED
      case 3: // QR_GENERATED
      case 6: // PENDING
        paymentStatus = PaymentStatus.PENDING;
        break;
      case 4: // QR_EXPIRED
        paymentStatus = PaymentStatus.CANCELLED;
        break;
      case 5: // FAILED
      default:
        paymentStatus = PaymentStatus.FAILED;
    }
  }

  // Update order
  await db.order.update({
    where: { id: order.id },
    data: {
      paymentStatus,
      isPaid,
    },
  });

  console.log(`[UAT] Order ${order.id} updated: ${paymentStatus} (UPI TxnId: ${upiTxnId || "N/A"})`);

  return NextResponse.json({
    success: true,
    message: "Callback processed successfully",
  });
}
