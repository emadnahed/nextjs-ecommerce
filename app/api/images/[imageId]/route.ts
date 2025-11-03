import { NextRequest, NextResponse } from "next/server";
import { imageExists } from "@/lib/file-upload";

/**
 * GET /api/images/[imageId]
 * Redirects to the DigitalOcean Spaces URL
 *
 * This endpoint is maintained for backward compatibility
 * Since images are now stored on DigitalOcean Spaces with public URLs,
 * this endpoint redirects to the actual CDN URL
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { imageId: string } }
) {
  try {
    const { imageId } = params;

    if (!imageId) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    // If imageId is already a full URL, redirect to it
    if (imageId.startsWith("http://") || imageId.startsWith("https://")) {
      // Check if the image exists
      const exists = await imageExists(imageId);
      if (!exists) {
        return NextResponse.json(
          { error: "Image not found" },
          { status: 404 }
        );
      }

      return NextResponse.redirect(imageId, 301);
    }

    // Otherwise, construct the CDN URL from the image ID
    const cdnUrl = process.env.DO_SPACES_CDN_URL ||
      `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_REGION}.cdn.digitaloceanspaces.com`;
    const imageUrl = `${cdnUrl}/${imageId}`;

    // Check if the image exists
    const exists = await imageExists(imageUrl);
    if (!exists) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    return NextResponse.redirect(imageUrl, 301);
  } catch (error: any) {
    console.error("Error serving image:", error);

    return NextResponse.json(
      { error: "Failed to retrieve image" },
      { status: 500 }
    );
  }
}
