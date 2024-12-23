import "next-auth";

declare module "next-auth" {
  interface User {
    username?: string;
    friends?: string[]; 
  }

  interface Session {
    user: {
      username?: string;
      friends?: string[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string;
    friends?: string[];
  }
}
