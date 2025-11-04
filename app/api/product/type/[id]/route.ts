import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { enrichProductsWithImageURLs } from "@/lib/imageUrlHelper";

/**
 * Get products by type (replaces old category endpoint)
 * Example: /api/product/type/T-Shirt
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Filter by type (the id param represents the type)
    const products = await db.product.findMany({
      where: {
        type: id,
      },
      include: {
        productSizes: {
          include: {
            size: true,
          },
        },
      },
    });

    const enrichedProducts = enrichProductsWithImageURLs(products);
    return NextResponse.json(enrichedProducts);
  } catch (error) {
    return NextResponse.json({ error: "Error getting products", status: 500 });
  }
}
