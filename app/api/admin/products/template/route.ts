import { NextRequest, NextResponse } from "next/server";
import { generateCSVTemplate } from "@/lib/product-import-export";

/**
 * GET /api/admin/products/template
 * Download CSV template for product import
 */
export async function GET(request: NextRequest) {
  try {
    const csvTemplate = generateCSVTemplate();

    return new NextResponse(csvTemplate, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=\"product-import-template.csv\"",
      },
    });
  } catch (error: any) {
    console.error("Error generating template:", error);
    return NextResponse.json(
      { error: "Failed to generate template" },
      { status: 500 }
    );
  }
}
