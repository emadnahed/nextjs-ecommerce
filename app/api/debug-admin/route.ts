import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { getAdminEmails, isAdminByEmail } from "@/lib/admin-auth";

export async function GET() {
  try {
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    const adminEmails = getAdminEmails();
    const isAdmin = userEmail ? isAdminByEmail(userEmail) : false;

    return NextResponse.json({
      debug: {
        hasUser: !!user,
        userId: user?.id,
        userEmail,
        adminEmails,
        adminEmailsRaw: process.env.ADMIN_EMAILS,
        isAdmin,
        clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 20) + '...',
        hasClerkSecret: !!process.env.CLERK_SECRET_KEY,
      },
      message: isAdmin ? 'User is admin' : 'User is not admin',
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
