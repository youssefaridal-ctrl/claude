import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";
import { sendMagicLinkEmail } from "@/lib/email/mailer";
import { enforceRateLimit, policies } from "@/lib/rate-limit";

/**
 * Full auth configuration. Primary sign-in is the passwordless magic link —
 * a deliberate product decision (no passwords to forget satisfies WCAG 2.2
 * accessible authentication, and "no password" is on-brand friction removal).
 * Google OAuth is the secondary path.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    ...authConfig.providers,
    {
      id: "email",
      type: "email",
      name: "Email",
      from: process.env.EMAIL_FROM ?? "SELV <hello@localhost>",
      maxAge: 10 * 60, // links expire in 10 minutes
      options: {},
      async sendVerificationRequest({ identifier, url }) {
        await enforceRateLimit(`magiclink:${identifier}`, policies.auth);
        await sendMagicLinkEmail(identifier, url);
      },
    },
  ],
  events: {
    async createUser({ user }) {
      // Every member gets a profile row; onboarding fills it in (flow B).
      if (user.id) {
        await prisma.profile.upsert({
          where: { userId: user.id },
          create: { userId: user.id },
          update: {},
        });
      }
    },
  },
});
