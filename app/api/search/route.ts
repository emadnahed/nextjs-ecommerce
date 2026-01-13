import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("q");
    const limit = parseInt(url.searchParams.get("limit") || "12");

    if (!query || query.trim().length === 0) {
      return NextResponse.json([]);
    }

    const searchTerm = query.trim().toLowerCase();

    // Get all products and filter in memory for case-insensitive search
    const allProducts = await db.product.findMany({
      orderBy: { price: "desc" },
    });

    // Filter products by search term
    const filteredProducts = allProducts
      .filter((product) => {
        const title = product.title?.toLowerCase() || "";
        const category = product.category?.toLowerCase() || "";
        const parentCategory = product.parentCategory?.toLowerCase() || "";
        const topLevelCategory = product.topLevelCategory?.toLowerCase() || "";

        return (
          title.includes(searchTerm) ||
          category.includes(searchTerm) ||
          parentCategory.includes(searchTerm) ||
          topLevelCategory.includes(searchTerm)
        );
      })
      .slice(0, limit)
      .map((product) => ({
        id: product.id,
        productId: product.productId,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        topLevelCategory: product.topLevelCategory,
        rating: product.rating,
        reviewCount: product.reviewCount,
      }));

    return NextResponse.json(filteredProducts);
  } catch (error) {
    console.error("Error searching products:", error);
    console.error("Error details:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      {
        error: "Error searching products",
        details: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
}
