import "next-auth";



declare module "next-auth" {
  interface User {
    username?: string;
    tasks?: string[];
    friends?: {
      name: string;
      username: string;
    }[];
    groups?: string[]; 
  }

  interface Session {
    user: {
      username?: string;
      tasks?: string[];
      friends?: {
        name: string;
        username: string;
      }[];
      groups?: string[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string;
    tasks?: string[];
    friends?: {
      name: string;
      username: string;
    }[];
    groups?: string[];
  }
}
