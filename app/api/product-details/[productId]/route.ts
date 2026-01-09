import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  const { productId } = params;

  try {
    // Find product details by productId (the string ID like "5ft68p")
    const productDetails = await db.productDetails.findUnique({
      where: { productId },
    });

    if (!productDetails) {
      return NextResponse.json(
        { error: "Product details not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(productDetails);
  } catch (error) {
    console.error("Error getting product details:", error);
    return NextResponse.json(
      {
        error: "Error getting product details",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
