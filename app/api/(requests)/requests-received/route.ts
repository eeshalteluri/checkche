import client from "@/lib/db"
import { NextResponse, NextRequest } from "next/server"
import Notification from "@/models/Notification"
import NotificationType from "@/types/notification"
import { connectDB } from "@/lib/dbConnect"

export async function GET (req: NextRequest) {
    try{
    const { searchParams } =  new URL(req.url)
    const username = searchParams.get("username")

    const db = client.db()
    await connectDB()
    const findUser =  await db.collection("users").findOne({username})

        if (!findUser) {
            return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
            );
        }
    
    const requestsReceived = await Notification.find({userId: findUser._id.toString()})
    console.log("Requests sent by user:", requestsReceived)

    
        const requestedUsers = await Promise.all(
            requestsReceived.map( async (request: NotificationType) => {
           const user = await db.collection("users").findOne({_id: request.fromUserId})

           if(user){
            return {name: user.name, username: user.username}
           }

           return null
        }))

        console.log("requestedusers: ", requestedUsers)
    return NextResponse.json({requestedUsers: requestedUsers}, { status: 200 }) 

    }catch (error) {
        console.error("Error fetching requests sent:", error)
        return NextResponse.json(
          { error: "Failed to fetch requests sent" },
          { status: 500 }
        )
      }
}
