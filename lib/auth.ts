// NextAuth v5 configuration — Credentials provider with email/password auth

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(1),
          })
          .safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const email = parsed.data.email.toLowerCase();
        const { password } = parsed.data;

        const { checkRateLimit } = await import("./rate-limiter");
        const rl = checkRateLimit(`login:${email}`);
        if (!rl.allowed) {
          return null;
        }

        try {
          const { db } = await import("./db");
          const { comparePassword } = await import("./password");

          const user = await db.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              emailVerified: true,
              passwordHash: true,
              passwordChangedAt: true,
            },
          });

          if (!user) {
            return null;
          }

          const passwordValid = await comparePassword(
            password,
            user.passwordHash,
          );

          if (!passwordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            emailVerified: user.emailVerified,
            passwordChangedAt: user.passwordChangedAt.toISOString(),
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.emailVerified = (user as { emailVerified: boolean }).emailVerified;
        token.passwordChangedAt = (user as { passwordChangedAt: string }).passwordChangedAt;
        return token;
      }
      return token;
    },
    async session({ session: rawSession, token }) {
      const session = rawSession as {
        user: { id: string; emailVerified: boolean };
      };
      if (session.user) {
        session.user.id = token.id as string;
        session.user.emailVerified = token.emailVerified as boolean;
      }
      return rawSession;
    },
  },
  pages: {
    signIn: "/auth",
  },
  session: {
    strategy: "jwt",
    maxAge: 86400, // 24 hours
  },
});
