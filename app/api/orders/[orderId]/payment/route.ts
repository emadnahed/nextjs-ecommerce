import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';

export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { userId } = auth();
    const { paymentStatus } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.orderId) {
      return new NextResponse("Order ID is required", { status: 400 });
    }

    // Only allow 'PAID' or 'UNPAID' statuses
    if (paymentStatus !== 'PAID' && paymentStatus !== 'UNPAID') {
      return new NextResponse("Invalid payment status. Must be either 'PAID' or 'UNPAID'.", { status: 400 });
    }

    // Update the order with the new payment status
    const order = await db.order.update({
      where: {
        id: params.orderId,
      },
      data: {
        paymentStatus: paymentStatus === 'PAID' ? 'success' : 'pending',
        isPaid: paymentStatus === 'PAID',
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('[ORDER_PAYMENT_UPDATE]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
