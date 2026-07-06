import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

/**
 * Edge middleware: session-gates the member app and admin surface using the
 * edge-safe auth config (the `authorized` callback in src/auth.config.ts).
 * Security headers live in next.config.mjs; rate limiting lives in the API
 * wrapper (Redis is not edge-reachable here).
 */
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  // Skip static assets and image optimizer; everything else is evaluated.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|og/|fonts/).*)"],
};
