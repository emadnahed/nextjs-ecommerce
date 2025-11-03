import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { uploadFile } from "@/lib/file-upload";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { userId } = auth();

  try {
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    const product = await db.product.findUnique({
      where: {
        id,
      },
      include: {
        productSizes: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Error getting product", status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { userId } = auth();

  try {
    const formData = await req.formData();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    const title = formData.get("name") as string;
    const price = formData.get("price") as string;
    const description = formData.get("description") as string;
    const type = formData.get("type") as string;
    const gender = formData.get("gender") as string;
    const colorsData = formData.get("colors") as string;
    const colors = colorsData ? JSON.parse(colorsData) : [];
    const material = formData.get("material") as string;
    const featured = formData.get("isFeatured");
    const discount = formData.get("discount") as string | null;
    const sku = formData.get("sku") as string | null;
    const isFeaturedBoolean = featured === "on";
    const files = formData.getAll("image");
    const fileNames: string[] = [];

    const sizes = JSON.parse(formData.get("productSizes") as string) as {
      sizeId: string;
      name: string;
    }[];

    const convPrice = +price;

    // Get existing sizes to determine which ones are new
    const existingSizes = await db.productSize.findMany({
      where: {
        productId: id,
      },
      select: {
        id: true,
      },
    });

    const existingSizeIds = existingSizes.map((item) => item.id);
    const newSizes = sizes.filter((item) => item.sizeId);
    const sizesToCreate = newSizes.filter(
      (item: any) => !existingSizeIds.includes(item.id)
    );

    // Calculate sale price if discount exists
    let salePrice: number | null = null;
    if (discount && +discount > 0) {
      const discountAmount = (+discount / 100) * convPrice;
      salePrice = convPrice - discountAmount;
    }

    const updateData: {
      title: string;
      price: number;
      description: string;
      featured: boolean;
      type: string;
      gender: string;
      colors: string[];
      material: string;
      salePrice: number | null;
      discount: number | null;
      sku: string | null;
      imageIds?: string[];
      productSizes?: {
        create: {
          size: { connect: { id: string } };
          name: string;
        }[];
      };
    } = {
      featured: isFeaturedBoolean,
      title,
      price: convPrice,
      description,
      type,
      gender,
      colors: Array.isArray(colors) ? colors : [colors],
      material: material || "Cotton",
      salePrice,
      discount: discount ? +discount : null,
      sku: sku || null,
      productSizes: {
        create: sizesToCreate.map((size: any) => ({
          size: { connect: { id: size.sizeId } },
          name: size.name,
        })),
      },
    };

    // Upload new files to DigitalOcean Spaces if provided
    if (files && files.length > 0) {
      for (const file of Array.from(files)) {
        if (file instanceof File && file.name) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const imageUrl = await uploadFile(buffer, file.name);
          fileNames.push(imageUrl);
        }
      }

      if (fileNames.length > 0) {
        updateData.imageIds = fileNames;
      }
    }

    const product = await db.product.update({
      where: {
        id: id,
      },
      data: updateData,
    });

    return NextResponse.json({ product, msg: "Successful edit product" });
  } catch (error) {
    return NextResponse.json({ error: "Error updating task", status: 500 });
  }
}
