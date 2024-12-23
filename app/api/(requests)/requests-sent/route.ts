import client from "@/lib/db"
import { NextResponse, NextRequest } from "next/server"
import Notification from "@/models/Notification"
import User from "@/models/User"
import NotificationType from "@/types/notification"

export async function GET (req: NextResponse) {
    try{
    const { searchParams } =  new URL(req.url)
    const username = searchParams.get("username")

    const db = client.db()
    const findUser =  await db.collection("users").findOne({username})

        if (!findUser) {
            return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
            );
        }
    
    const requestsSent = await Notification.find({fromUserId: findUser._id.toString()})
    console.log("Requests sent by user:", requestsSent)

    
        const requestedUsers = await Promise.all(
            requestsSent.map( async (request: NotificationType) => {
           const user = await db.collection("users").findOne({_id: request.userId})

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