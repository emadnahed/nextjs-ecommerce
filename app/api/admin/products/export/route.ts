import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateCSV, prepareProductForExport } from "@/lib/product-import-export";

/**
 * GET /api/admin/products/export?format=csv|json
 * Export all products to CSV or JSON
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get("format") || "csv";

    // Fetch all products with related data
    const products = await db.product.findMany({
      include: {
        productSizes: {
          include: {
            size: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert products to export format
    const exportData = products.map((product) => prepareProductForExport(product));

    if (format === "json") {
      return NextResponse.json(exportData, {
        headers: {
          "Content-Disposition": `attachment; filename="products-export-${Date.now()}.json"`,
        },
      });
    }

    // Generate CSV
    const csvContent = generateCSV(exportData);

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="products-export-${Date.now()}.csv"`,
      },
    });
  } catch (error: any) {
    console.error("Error exporting products:", error);
    return NextResponse.json(
      { error: `Export failed: ${error.message}` },
      { status: 500 }
    );
  }
}
