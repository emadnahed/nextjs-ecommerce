import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in to view your orders." },
      { status: 401 }
    );
  }

  try {
    const orders = await db.order.findMany({
      select: {
        id: true,
        isPaid: true,
        phone: true,
        address: true,
        orderStatus: true,
        orderItems: {
          select: {
            id: true,
            orderId: true,
            productName: true,
            product: true
          }
        },
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Error getting orders.", status: 500 });
  }
}
