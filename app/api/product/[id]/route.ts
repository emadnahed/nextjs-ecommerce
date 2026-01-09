import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { userId } = auth();

  try {
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete associated order items first
    const orderItems = await db.orderItem.findMany({
      where: { productId: id },
    });

    await Promise.all(
      orderItems.map(async (orderItem) => {
        await db.orderItem.delete({
          where: { id: orderItem.id },
        });
      })
    );

    // Delete the product
    await db.product.delete({
      where: { id },
    });

    return NextResponse.json({ msg: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({
      error: "Error deleting product",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const product = await db.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error getting product:", error);
    return NextResponse.json({
      error: "Error getting product",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
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

    const product = await db.product.update({
      where: { id },
      data: {
        productId,
        title,
        category,
        categoryId,
        parentCategory,
        topLevelCategory,
        price: price !== undefined ? +price : undefined,
        rating,
        reviewCount: reviewCount !== undefined ? +reviewCount : undefined,
        image,
        link,
      },
    });

    return NextResponse.json({ msg: "Successfully updated product", product });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({
      error: "Error updating product",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
