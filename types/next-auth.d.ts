import "next-auth";



declare module "next-auth" {
  interface User {
    username?: string;
    friends?: {
      name: string;
      username: string;
    }[]; 
  }

  interface Session {
    user: {
      username?: string;
      friends?: {
        name: string;
        username: string;
      }[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string;
    friends?: {
      name: string;
      username: string;
    }[];
  }
}
