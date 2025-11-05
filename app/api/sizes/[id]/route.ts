import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized", status: 401 },
      { status: 401 }
    );
  }

  try {
    const { id } = params;

    // Check if size exists
    const size = await db.size.findUnique({
      where: { id },
      include: {
        productSizes: true,
      },
    });

    if (!size) {
      return NextResponse.json(
        { error: "Size not found", status: 404 },
        { status: 404 }
      );
    }

    // Delete the size (ProductSize records will be cascade deleted)
    await db.size.delete({
      where: { id },
    });

    return NextResponse.json({
      message: `Size "${size.name}" deleted successfully`,
      affectedProducts: size.productSizes.length,
    });
  } catch (error) {
    console.error("Error deleting size:", error);
    return NextResponse.json(
      { error: "Error deleting size.", status: 500 },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized", status: 401 },
      { status: 401 }
    );
  }

  try {
    const { id } = params;
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Size name is required", status: 400 },
        { status: 400 }
      );
    }

    // Update the size
    const size = await db.size.update({
      where: { id },
      data: { name },
    });

    // Also update the name in all related ProductSize records
    await db.productSize.updateMany({
      where: { sizeId: id },
      data: { name },
    });

    return NextResponse.json({
      message: "Size updated successfully",
      size,
    });
  } catch (error) {
    console.error("Error updating size:", error);
    return NextResponse.json(
      { error: "Error updating size.", status: 500 },
      { status: 500 }
    );
  }
}
