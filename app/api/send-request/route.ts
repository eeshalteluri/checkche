import { connectDB } from "@/lib/dbConnect";
import Notification from "@/models/Notification";
import { NextRequest, NextResponse } from "next/server";

import User from "@/models/User";

export async function POST (req: NextRequest) {
    try{

        await connectDB()
        

        const { fromUsername, toUsername } = await req.json()

        // Find users by their usernames
        const fromUser = await User.findOne({ username: fromUsername });
        const toUser = await User.findOne({ username: toUsername });

        if (!fromUser || !toUser) {
            return NextResponse.json({ error: "User(s) not found" }, { status: 404 });
          }

        const newFriendRequest = new Notification({
            userId: toUser._id,
            fromUserId: fromUser._id,
            type: "friend-request",
            status: "pending",
            message:"",
        })

        await newFriendRequest.save()

        return NextResponse.json(
            { message: "Friend request sent successfully" },
            { status: 201 }
          )

    }catch(error){
        console.error("Error sending friend request:", error);
    return NextResponse.json({ error: "Failed to send friend request" }, { status: 500 })
    }
    
}