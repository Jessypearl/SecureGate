// Type augmentation for NextAuth v5 — adds emailVerified to session and user types

import "next-auth";

declare module "next-auth" {
  interface User {
    emailVerified: boolean;
  }

  interface Session {
    user: {
      id: string;
      emailVerified: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    emailVerified: boolean;
  }
}
