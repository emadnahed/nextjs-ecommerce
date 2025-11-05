import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { userId } = auth();
    const { status } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.orderId) {
      return new NextResponse("Order ID is required", { status: 400 });
    }

    // Validate status
    const validStatuses = ["PENDING", "DELIVERED", "CANCELLED", "ON-HOLD"];
    if (!validStatuses.includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    // Update the order status
    const order = await db.order.update({
      where: {
        id: params.orderId,
      },
      data: {
        orderStatus: status,
        updatedAt: new Date()
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDER_UPDATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
