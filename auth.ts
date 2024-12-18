import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "./lib/db"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  adapter: MongoDBAdapter(client),
  callbacks: {
    async signIn({ user }) {
      const db = client.db()

      const usersCollection = db.collection('users')

      const username = ""
      await usersCollection.updateOne(
        {email: user.email},
        { $set: {username} }
      )
      user.username = username

      return true
    },
    async session({ session, user }) {
      session.user.username = user.username

      return session
    }
  }
})