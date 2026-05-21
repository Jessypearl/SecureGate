import "next-auth";

declare module "next-auth" {
  interface User {
    emailVerified: boolean;
    passwordChangedAt?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      emailVerified: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    emailVerified: boolean;
    passwordChangedAt?: string;
  }
}
