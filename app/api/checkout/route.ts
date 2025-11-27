import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { CartItem } from "@/hooks/use-cart";
import { paymentService } from "@/lib/payment/payment-service";
import { PaymentMethod } from "@/lib/payment/types";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    const body = await req.json();
    const {
      items,
      paymentMethod,
      customerName,
      customerEmail,
      customerPhone,
      address,
    } = body;

    console.log(`\n[Checkout] ===== REQUEST =====`);
    console.log(`[Checkout] Method: ${paymentMethod}, Items: ${items?.length}, User: ${userId || 'guest'}`);

    // Validate required fields
    if (!items || items.length === 0) {
      console.log(`[Checkout] FAIL: Missing cart items`);
      return NextResponse.json(
        { error: "Cart items are required" },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      console.log(`[Checkout] FAIL: Missing payment method`);
      return NextResponse.json(
        { error: "Payment method is required" },
        { status: 400 }
      );
    }

    if (!customerName || !customerPhone || !address) {
      console.log(`[Checkout] FAIL: Missing customer details - name:${!!customerName} phone:${!!customerPhone} addr:${!!address}`);
      return NextResponse.json(
        { error: "Customer details are required" },
        { status: 400 }
      );
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: CartItem) => {
      const price = item.salePrice || item.price;
      return sum + parseFloat(String(price)) * item.quantity;
    }, 0);

    // Create order in database
    const order = await db.order.create({
      data: {
        isPaid: false,
        paymentMethod: paymentMethod,
        paymentStatus: "pending",
        userId: userId || null,
        customerName,
        customerEmail: customerEmail || "",
        phone: customerPhone,
        address,
        totalAmount,
        orderItems: {
          create: items.map((product: CartItem) => ({
            productName: product.title,
            quantity: product.quantity || 1,
            size: product.size || null,
            price: product.salePrice || parseFloat(String(product.price)),
            product: {
              connect: {
                id: product.id,
              },
            },
          })),
        },
      },
    });

    console.log(`[Checkout] Order created: ${order.id}, Amount: ${totalAmount}`);

    // Initialize payment with selected method
    console.log(`[Checkout] Calling payment service...`);
    const paymentResponse = await paymentService.createPayment(
      paymentMethod as PaymentMethod,
      {
        orderId: order.id,
        amount: totalAmount,
        currency: "INR",
        customerName,
        customerEmail: customerEmail || "",
        customerPhone,
        returnUrl: `${process.env.NEXT_PUBLIC_API_URL}/cart?success=1`,
        metadata: {
          orderId: order.id,
        },
      }
    );

    console.log(`[Checkout] ===== PAYMENT RESPONSE =====`);
    console.log(`[Checkout] Success: ${paymentResponse.success}, Status: ${paymentResponse.status}`);
    if (paymentResponse.error) console.log(`[Checkout] Error: ${paymentResponse.error}`);
    if (paymentResponse.paymentUrl) console.log(`[Checkout] PaymentUrl: ${paymentResponse.paymentUrl?.substring(0, 80)}...`);

    if (!paymentResponse.success) {
      // Delete order and its items if payment initialization failed
      await db.$transaction([
        db.orderItem.deleteMany({ where: { orderId: order.id } }),
        db.order.delete({ where: { id: order.id } }),
      ]);

      console.log(`[Checkout] FAIL: Payment init failed, order ${order.id} deleted`);
      return NextResponse.json(
        { error: paymentResponse.error || "Payment initialization failed" },
        { status: 400 }
      );
    }

    // Update order with payment ID
    await db.order.update({
      where: { id: order.id },
      data: {
        paymentId: paymentResponse.paymentId,
        paymentStatus: paymentResponse.status,
      },
    });

    // Return appropriate response based on payment method
    // Include totalAmount in metadata for frontend to use as single source of truth
    console.log(`[Checkout] SUCCESS: Order ${order.id} ready`);
    if (paymentResponse.paymentUrl) {
      // For redirect-based payments (Cashfree) or UPI QR (SprintNxt)
      return NextResponse.json({
        success: true,
        orderId: order.id,
        paymentUrl: paymentResponse.paymentUrl,
        message: paymentResponse.message,
        metadata: { ...paymentResponse.metadata, amount: totalAmount },
      });
    } else {
      // For COD and other non-redirect payments
      return NextResponse.json({
        success: true,
        orderId: order.id,
        message: paymentResponse.message || "Order placed successfully",
        metadata: { ...paymentResponse.metadata, amount: totalAmount },
      });
    }
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
