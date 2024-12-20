import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "./lib/db"
import Notification from "./models/Notification"
import { Types } from 'mongoose';
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  adapter: MongoDBAdapter(client),
  callbacks: {
    async signIn({ user }) {
      if(!user.username){
      const db = client.db()

      const usersCollection = db.collection('users')

      const username = ""
      await usersCollection.updateOne(
        {email: user.email},
        { $set: {username} }
      )
      user.username = username
      console.log(user)
    }

    // Create a new notification using Mongoose model
    const newNotification = new Notification({
      userId: new Types.ObjectId(user.id),
      fromUserId: new Types.ObjectId(user.id), 
      type: "friend-request",
      status: "pending",
      message: "Welcome to the app!",
    });

    // Save the notification to the database
    await newNotification.save();
    return true
  },
    
    async session({ session, user }) {
      session.user.username = user.username
      return session
  }
  }
})