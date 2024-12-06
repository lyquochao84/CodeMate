import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest, res: NextResponse) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/log-in", req.url));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    return NextResponse.next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.redirect(new URL("/log-in", req.url));
    }
  }
}

export const config = {
  // Protected routes
  matcher: [
    "/dashboard/:path*",
    "/problems/:path*",
    "/about/:path*",
  ],
};
