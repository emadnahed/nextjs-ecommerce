import { auth, currentUser } from "@clerk/nextjs";

/**
 * Get admin emails from environment variable
 */
export function getAdminEmails(): string[] {
  const adminEmailsEnv = process.env.ADMIN_EMAILS || "";
  return adminEmailsEnv
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0);
}

/**
 * Check if a user is an admin based on email whitelist
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const user = await currentUser();
    if (!user) return false;

    const adminEmails = getAdminEmails();
    const userEmail = user.emailAddresses[0]?.emailAddress?.toLowerCase();

    if (!userEmail) return false;

    return adminEmails.includes(userEmail);
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

/**
 * Check if a user is an admin (synchronous version using userId)
 * Use this in API routes where you have the auth() data
 */
export function isAdminByEmail(email: string): boolean {
  const adminEmails = getAdminEmails();
  return adminEmails.includes(email.toLowerCase());
}

/**
 * Middleware helper to check admin access
 * Throws an error if user is not an admin
 */
export async function requireAdmin() {
  const admin = await isAdmin();
  if (!admin) {
    throw new Error("Unauthorized: Admin access required");
  }
}

/**
 * Get current user email from Clerk auth
 */
export async function getCurrentUserEmail(): Promise<string | null> {
  try {
    const user = await currentUser();
    return user?.emailAddresses[0]?.emailAddress || null;
  } catch (error) {
    console.error("Error getting current user email:", error);
    return null;
  }
}
