// NextAuth v5 configuration — Credentials provider with email/password auth

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
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.emailVerified = token.emailVerified as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
