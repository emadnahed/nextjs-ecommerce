import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Testing database connection...");

    // Test fetching products
    const products = await db.product.findMany({
      take: 5,
    });

    // Test fetching categories
    const categories = await db.category.findMany({
      take: 5,
    });

    return NextResponse.json({
      success: true,
      message: "Database connection successful!",
      data: {
        productsCount: products.length,
        categoriesCount: categories.length,
        sampleProduct: products[0] || null,
        sampleCategory: categories[0] || null,
      },
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
