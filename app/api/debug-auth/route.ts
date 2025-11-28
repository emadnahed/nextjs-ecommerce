import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { userId, sessionId } = auth();
    const user = await currentUser();

    return NextResponse.json({
      debug: {
        userId: userId || "null",
        sessionId: sessionId || "null",
        hasUser: !!user,
        userEmail: user?.emailAddresses?.[0]?.emailAddress || "none",
        clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 20) + "...",
        hasSecretKey: !!process.env.CLERK_SECRET_KEY,
        requestOrigin: req.headers.get("origin") || "none",
        requestHost: req.headers.get("host") || "none",
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
