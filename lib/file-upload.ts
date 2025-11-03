import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

// Initialize DigitalOcean Spaces client (S3-compatible)
const s3Client = new S3Client({
  endpoint: process.env.DO_SPACES_ENDPOINT,
  region: process.env.DO_SPACES_REGION || "blr1",
  credentials: {
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.DO_SPACES_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.DO_SPACES_BUCKET || "paymadi-ecommerce";
const CDN_URL = process.env.DO_SPACES_CDN_URL || `https://${BUCKET_NAME}.${process.env.DO_SPACES_REGION}.cdn.digitaloceanspaces.com`;

/**
 * Get content type based on file extension
 */
function getContentType(fileName: string): string {
  const ext = fileName.toLowerCase().split(".").pop();
  const contentTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
  };
  return contentTypes[ext || ""] || "application/octet-stream";
}

/**
 * Generate a unique file name with the original extension
 */
function generateFileName(originalFileName: string): string {
  const ext = originalFileName.toLowerCase().split(".").pop();
  const uniqueId = randomUUID();
  return `${uniqueId}.${ext}`;
}

/**
 * Uploads a file to DigitalOcean Spaces
 * @param file - File buffer
 * @param fileName - Original file name
 * @returns Public URL of the uploaded file
 */
export async function uploadFile(
  file: Buffer,
  fileName: string
): Promise<string> {
  try {
    const uniqueFileName = generateFileName(fileName);
    const contentType = getContentType(fileName);

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: uniqueFileName,
      Body: file,
      ContentType: contentType,
      ACL: "public-read", // Make the file publicly accessible
    });

    await s3Client.send(command);

    // Return the CDN URL for the uploaded file
    return `${CDN_URL}/${uniqueFileName}`;
  } catch (error) {
    console.error("Error uploading file to DigitalOcean Spaces:", error);
    throw new Error(`Failed to upload file: ${error}`);
  }
}

/**
 * Deletes a file from DigitalOcean Spaces
 * @param fileUrl - Public URL or file key
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    // Extract the file key from the URL
    const fileKey = fileUrl.includes(CDN_URL)
      ? fileUrl.replace(`${CDN_URL}/`, "")
      : fileUrl.includes(`${BUCKET_NAME}.${process.env.DO_SPACES_REGION}.digitaloceanspaces.com`)
      ? fileUrl.split(`${BUCKET_NAME}.${process.env.DO_SPACES_REGION}.digitaloceanspaces.com/`)[1]
      : fileUrl;

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error("Error deleting file from DigitalOcean Spaces:", error);
    // Don't throw - file might already be deleted
  }
}

/**
 * Gets multiple image URLs (pass-through since images are already public URLs)
 * @param imageUrls - Array of image URLs
 * @returns Array of image URLs
 */
export async function getImageUrls(imageUrls: string[]): Promise<string[]> {
  return imageUrls;
}

/**
 * Check if a file exists in DigitalOcean Spaces
 * @param fileUrl - Public URL or file key
 */
export async function imageExists(fileUrl: string): Promise<boolean> {
  try {
    // Extract the file key from the URL
    const fileKey = fileUrl.includes(CDN_URL)
      ? fileUrl.replace(`${CDN_URL}/`, "")
      : fileUrl.includes(`${BUCKET_NAME}.${process.env.DO_SPACES_REGION}.digitaloceanspaces.com`)
      ? fileUrl.split(`${BUCKET_NAME}.${process.env.DO_SPACES_REGION}.digitaloceanspaces.com/`)[1]
      : fileUrl;

    const command = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Legacy function for backward compatibility
 * Retrieves an image by its URL (redirects to the URL)
 * @param imageUrl - Image URL
 * @returns Image URL
 */
export async function getImage(imageUrl: string) {
  return {
    url: imageUrl,
    contentType: "image/jpeg", // Default content type
  };
}
