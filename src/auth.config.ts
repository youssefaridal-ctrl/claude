import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Edge-safe portion of the auth config (no Prisma, no Node APIs) so
 * middleware can evaluate sessions. The full config in src/auth.ts adds the
 * Prisma adapter and the magic-link email provider.
 */
export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
    verifyRequest: "/signin/sent", // "Check your email — the door is open."
    error: "/signin/error",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: false,
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      // Middleware-level protection for the member app and admin surface.
      const { pathname } = request.nextUrl;
      const isProtected =
        pathname.startsWith("/today") ||
        pathname.startsWith("/practice") ||
        pathname.startsWith("/progress") ||
        pathname.startsWith("/commons") ||
        pathname.startsWith("/learn") ||
        pathname.startsWith("/settings") ||
        pathname.startsWith("/admin");
      if (!isProtected) return true;
      return Boolean(auth?.user);
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "MEMBER";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
