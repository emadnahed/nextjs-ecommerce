import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const sizes = await db.size.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(sizes);
  } catch (error) {
    console.error("Error fetching sizes:", error);
    return NextResponse.json(
      { error: "Error getting sizes.", status: 500 },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized", status: 401 }, { status: 401 });
  }

  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Size name is required", status: 400 },
        { status: 400 }
      );
    }

    const size = await db.size.create({
      data: {
        name,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.error("Error creating size:", error);
    return NextResponse.json(
      { error: "Error creating size.", status: 500 },
      { status: 500 }
    );
  }
}
