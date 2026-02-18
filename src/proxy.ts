import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import PAGE_ROUTES from "./constants/page-routes.constant";

// Export the custom middleware wrapped with NextAuth's `withAuth`
export default withAuth(
  function middleware() {
    // function middleware(req: NextRequest) {

    try {
      return NextResponse.next();
    } catch (error) {
      console.error("❌ Middleware error:", error);
      return NextResponse.next(); // fallback to avoid breaking the app
    }
  },

  {
    callbacks: {
      authorized: ({ token }) => {
        try {
          if (!token) return false;
          const accessToken = token.accessToken as string;

          const decoded = jwt.decode(accessToken) as { exp?: number };
          const currentTime = Math.floor(Date.now() / 1000); // seconds

          // Check if the token has an `exp` property and is expired
          if (decoded?.exp && decoded.exp < currentTime) {
            return false;
          }

          return true; // Token is valid
        } catch (err) {
          console.error("❌ Authorization callback error:", err);
          return false;
        }
      },
    },

    pages: {
      signIn: PAGE_ROUTES.login,
    },
  }
);

// 🛡️ Apply middleware to specific routes
export const config = {
  matcher: [
    "/dashboard",
    "/users",
    "/members",
  ],
};
