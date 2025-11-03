import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { uploadFile } from "@/lib/file-upload";

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized", status: 401 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll("files");

    const fileNames: string[] = [];
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    // Upload files to DigitalOcean Spaces and get image URLs
    for (const file of Array.from(files)) {
      if (file instanceof File) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const imageUrl = await uploadFile(buffer, file.name);
        fileNames.push(imageUrl);
      }
    }

    const requestData = formData.get("requestData") as string;
    const productInfo = JSON.parse(requestData);

    const {
      title,
      description,
      price,
      featured,
      type,
      gender,
      colors,
      material,
      sizes,
      discount,
      sku,
    } = productInfo;

    // Validate required fields
    if (
      !title ||
      title.length < 4 ||
      !description ||
      description.length < 4 ||
      !price ||
      !fileNames.length ||
      !type ||
      !gender ||
      !colors ||
      !Array.isArray(colors) ||
      colors.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Calculate sale price if discount exists
    let salePrice: number | null = null;
    if (discount && discount > 0) {
      const discountAmount = (discount / 100) * +price;
      salePrice = +price - discountAmount;
    }

    const product = await db?.product.create({
      data: {
        title,
        description,
        price: +price,
        featured: featured || false,
        imageIds: fileNames,
        type,
        gender,
        colors: Array.isArray(colors) ? colors : [colors],
        material: material || "Cotton",
        discount: discount ? +discount : null,
        salePrice,
        inStock: true,
        sku: sku || null,
        productSizes: {
          create: sizes.map((size: any) => ({
            size: { connect: { id: size.id } },
            name: size.name,
          })),
        },
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
    const tasks = await db.product.findMany();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error getting products:", error);
    return NextResponse.json(
      { error: "Error getting products" },
      { status: 500 }
    );
  }
}
