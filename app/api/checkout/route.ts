import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { CartItem } from "@/hooks/use-cart";
import { paymentService } from "@/lib/payment/payment-service";
import { PaymentMethod } from "@/lib/payment/types";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    const {
      items,
      paymentMethod,
      customerName,
      customerEmail,
      customerPhone,
      address,
    } = await req.json();

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart items are required" },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: "Payment method is required" },
        { status: 400 }
      );
    }

    if (!customerName || !customerPhone || !address) {
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

    // Initialize payment with selected method
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

    if (!paymentResponse.success) {
      // Delete order if payment initialization failed
      await db.order.delete({ where: { id: order.id } });

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
    if (paymentResponse.paymentUrl) {
      // For redirect-based payments (Cashfree)
      return NextResponse.json({
        success: true,
        orderId: order.id,
        paymentUrl: paymentResponse.paymentUrl,
        message: paymentResponse.message,
      });
    } else {
      // For COD and other non-redirect payments
      return NextResponse.json({
        success: true,
        orderId: order.id,
        message: paymentResponse.message || "Order placed successfully",
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
