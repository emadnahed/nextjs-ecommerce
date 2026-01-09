import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const {
      productId,
      title,
      category,
      categoryId,
      parentCategory,
      topLevelCategory,
      price,
      rating,
      reviewCount,
      image,
      link,
    } = body;

    // Validate required fields
    if (
      !productId ||
      !title ||
      !category ||
      !categoryId ||
      !parentCategory ||
      !topLevelCategory ||
      price === undefined ||
      !rating ||
      !image ||
      !link
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await db.product.create({
      data: {
        productId,
        title,
        category,
        categoryId,
        parentCategory,
        topLevelCategory,
        price: +price,
        rating,
        reviewCount: reviewCount || 0,
        image,
        link,
        scrapedAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({ msg: "Successfully created product", product });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({
      error: "Error creating product",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    const topLevelCategory = url.searchParams.get('topLevelCategory');

    let products;
    if (category) {
      products = await db.product.findMany({
        where: { category },
        orderBy: { price: 'desc' }
      });
    } else if (topLevelCategory) {
      products = await db.product.findMany({
        where: { topLevelCategory },
        orderBy: { price: 'desc' }
      });
    } else {
      products = await db.product.findMany({
        orderBy: { price: 'desc' }
      });
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error getting products:", error);
    return NextResponse.json(
      { error: "Error getting products" },
      { status: 500 }
    );
  }
}
