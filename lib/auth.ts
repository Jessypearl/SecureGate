// NextAuth v5 configuration â€” Credentials provider with email/password auth

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { comparePassword } from "./password";
import { db } from "./db";

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

        const { email, password } = parsed.data;

        try {
          const user = await db.user.findUnique({ where: { email } });

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
          };
        } catch (err) {
          console.error("Login database error:", err);
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
        return token;
      }
      if (token.id) {
        try {
          const dbUser = await db.user.findUnique({
            where: { id: token.id as string },
            select: { passwordChangedAt: true },
          });
          if (dbUser) {
            const tokenIat = token.iat
              ? new Date(token.iat * 1000).getTime()
              : 0;
            if (dbUser.passwordChangedAt.getTime() > tokenIat + 1000) {
              return {};
            }
          }
        } catch {
          console.error("JWT passwordChangedAt check failed");
        }
      }
      return token;
    },
    async session({ session: rawSession, token }) {
      const session = rawSession as {
        user: { id: string; emailVerified: boolean };
      };
      if (session.user) {
        session.user.id = token.id as string;
        const tokenVerified = token.emailVerified as boolean;
        session.user.emailVerified = tokenVerified;
        if (!tokenVerified) {
          try {
            const dbUser = await db.user.findUnique({
              where: { id: token.id as string },
              select: { emailVerified: true },
            });
            if (dbUser) session.user.emailVerified = dbUser.emailVerified;
          } catch {
            console.error("Session emailVerified DB check failed");
          }
        }
      }
      return rawSession;
    },
  },
  pages: {
    signIn: "/auth",
  },
  session: {
    strategy: "jwt",
  },
});
