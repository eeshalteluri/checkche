import { connectDB } from "@/lib/dbConnect";
import Notification from "@/models/Notification";
import { NextRequest, NextResponse } from "next/server";

import User from "@/models/User";
import { ObjectId } from "mongodb";
import { isObjectIdOrHexString } from "mongoose";
import client from "@/lib/db";
import findUserId from "@/app/helpers/FindUserId";

export async function POST (req: NextRequest) {
    try{
        const { fromUsername, toUsername } = await req.json()

        const fromUserId = await findUserId(fromUsername)
        const toUserId = await findUserId(toUsername)

        if (!fromUserId || !toUserId) {
            return NextResponse.json({ error: "User(s) not found" }, { status: 404 });
        }

        const requestAlreadySentByYou = await Notification.findOne({
                userId: toUserId.toString(), // Convert to hex string
                fromUserId: fromUserId.toString(), // Convert to hex string
        })
        console.log(toUserId)
        console.log(requestAlreadySentByYou)

        if(requestAlreadySentByYou){
            return NextResponse.json(
            { message: "Friend request already sent." },
            { status: 400 }
          )
        }

        
        const requestAlreadySentByThem = await Notification.findOne({
            userId: fromUserId.toString() ,
            fromUserId: toUserId.toString()
        })
        console.log(requestAlreadySentByThem)

        if(requestAlreadySentByThem){
            return NextResponse.json(
            { message: "The same person already sent you a request." },
            { status: 400 }
          )
        }

        const newFriendRequest = new Notification({
            userId: toUserId,
            fromUserId: fromUserId,
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
export async function DELETE (req: NextRequest) {
    try{
        const { fromUsername, toUsername } = await req.json()

        const fromUserId = await findUserId(fromUsername)
        const toUserId = await findUserId(toUsername)

        if (!fromUserId || !toUserId) {
            return NextResponse.json({ error: "User(s) not found" }, { status: 404 });
        }

        const deletedRequest = await Notification.findOneAndDelete({
            userId: toUserId.toString(),
            fromUserId: fromUserId.toString(), 
        })

        if (!deletedRequest) {
            return NextResponse.json(
            { message: "Friend request not found." },
            { status: 404 }
            );
        }
    
        return NextResponse.json(
            { message: "Friend request deleted successfully." },
            { status: 200 }
        );

    }catch(error){
        console.error("Error deleting friend request:", error);
        return NextResponse.json({ error: "Failed to delete friend request" }, { status: 500 })
    }
}