import { db } from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in to view your orders." },
      { status: 401 }
    );
  }

  try {
    // Get user's email from Clerk
    const user = await clerkClient.users.getUser(userId);
    const userEmail = user.emailAddresses[0]?.emailAddress;

    // Find orders by userId OR by email (for backwards compatibility with old orders)
    const orders = await db.order.findMany({
      where: {
        OR: [
          { userId: userId },
          ...(userEmail ? [{ customerEmail: userEmail }] : []),
        ],
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { error: "Error getting orders.", status: 500 },
      { status: 500 }
    );
  }
}
