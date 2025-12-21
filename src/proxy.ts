import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface AuthenticatedRequest extends NextRequest {
  auth: {
    user: {
      id: string;
      email: string;
      name?: string;
      role: string;
    };
  } | null;
}

export default auth((req: AuthenticatedRequest) => {
  const { pathname } = req.nextUrl;
  const token = req.auth;

  if (pathname.startsWith("/admin")) {
    if (!token || !["admin", "super-admin"].includes(token.user.role)) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
