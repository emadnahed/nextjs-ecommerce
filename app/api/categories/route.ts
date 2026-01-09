import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const topLevelCategory = url.searchParams.get('topLevelCategory');

    let categories;
    if (topLevelCategory) {
      categories = await db.category.findMany({
        where: { topLevelCategory },
        orderBy: { name: 'asc' }
      });
    } else {
      categories = await db.category.findMany({
        orderBy: { name: 'asc' }
      });
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error getting categories:", error);
    return NextResponse.json(
      { error: "Error getting categories" },
      { status: 500 }
    );
  }
}
