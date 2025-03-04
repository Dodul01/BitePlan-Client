import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "./services/AuthServices";

type RoleKey = "customar" | "provider";

const roleBasedPrivateRoutes: Record<RoleKey, RegExp[]> = {
  customar: [
    /^\/dashboard\/customar(\/.*)?$/,
    /^\/dashboard\/profile\/customar(\/.*)?$/,
  ],
  provider: [
    /^\/dashboard\/provider(\/.*)?$/,
    /^\/dashboard\/profile\/provider(\/.*)?$/,
  ],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this route is protected.
  const isProtected = Object.values(roleBasedPrivateRoutes).some((patterns) =>
    patterns.some((pattern) => pattern.test(pathname))
  );
  if (!isProtected) return NextResponse.next();

  const user = await getCurrentUser();

  if (!user) {
    const loginUrl = new URL("/sign-in", request.url);
    loginUrl.searchParams.set("redirectPath", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Map user role to the expected keys:
  // "customer" becomes "customar" and "seller" becomes "provider"
  const effectiveRole: RoleKey | undefined =
    user.role === "customer"
      ? "customar"
      : user.role === "seller"
      ? "provider"
      : undefined;

  // If the role isn't recognized, redirect to home.
  if (!effectiveRole) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const allowedPatterns = roleBasedPrivateRoutes[effectiveRole] || [];

  // If the pathname matches an allowed pattern, let the request pass.
  if (allowedPatterns.some((pattern) => pattern.test(pathname))) {
    return NextResponse.next();
  }

  // Otherwise, redirect to the homepage.
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: [
    "/dashboard/customar/:path*",
    "/dashboard/profile/customar/:path*",
    "/dashboard/provider/:path*",
    "/dashboard/profile/provider/:path*",
  ],
};
