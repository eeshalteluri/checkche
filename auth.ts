import NextAuth, {User, Session} from "next-auth";
import { JWT } from "next-auth/jwt"
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "./lib/db";

export const authOptions = {
  providers: [Google],
  adapter: MongoDBAdapter(client),
  callbacks: {
    async session({ session, user }: { session: Session; user: User }) {
      session.user.username = user.username // Add the username property
      session.user.friends = user.friends
      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.username = user.username; // Add username to the JWT
        token.friends = user.friends
      }
      return token;
    },
  },
}

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
