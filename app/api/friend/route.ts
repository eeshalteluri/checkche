import { NextRequest, NextResponse } from "next/server";
import findUserId from "@/app/helpers/FindUserId";
import client from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET (req: NextRequest) {
    try{
        const { searchParams } =  new URL(req.url)
        const username = searchParams.get("username")

        const db = client.db()
        const findUser =  await db.collection("users").findOne({username})

        if (!findUser) {
            return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
            )
        }

        console.log("Find User: ", findUser)

        const friendsDetails = await Promise.all(
            findUser.friends.map(async (friendId: string) => {
                const friendObjectId = new ObjectId(friendId)
            const friendDetails = await db.collection("users").findOne({_id: friendObjectId})

            return {
                name: friendDetails?.name,
                username: friendDetails?.username
                }
            })
        )

        console.log("Friend Details: ",friendsDetails)
        return NextResponse.json(
            {friends: friendsDetails},
            {status: 200} 
        )

    }catch(error){
        console.error("Error fetching requests sent:", error)
        return NextResponse.json(
          { error: "Failed to fetch friends list" },
          { status: 500 }
        )
    }
    
}

export async function POST (req: NextRequest) {
    try{
        const { username, loggedInUserId } = await req.json()
        console.log(username, loggedInUserId)

        if (!username || !loggedInUserId) {
            return NextResponse.json(
            { error: "Username and LoggedInUserId are required" },
            { status: 400 }
            );
        }

        const userId = await findUserId(username)
        console.log(userId)

        if (!userId) {
            return NextResponse.json(
            { error: "User with the provided username not found" },
            { status: 404 }
            );
        }

        const loggedInUserObjectId = new ObjectId(loggedInUserId)
        const UserObjectId = new ObjectId(userId)

        const db = client.db()
        const addedToLoggedInUserDocument = await db.collection("users").findOneAndUpdate(
            {_id: loggedInUserObjectId}, 
            {
                $addToSet: { friends: userId }, // Add to friends array without duplication
                $set: { updatedAt: new Date() }, // Optionally update the timestamp
            },
            { returnDocument: "after" } // Return the updated document
        )
        const addedToUserDocument = await db.collection("users").findOneAndUpdate(
            {_id: UserObjectId}, 
            {
                $addToSet: { friends: loggedInUserId }, // Add to friends array without duplication
                $set: { updatedAt: new Date() }, // Optionally update the timestamp
            },
            { returnDocument: "after" } // Return the updated document
        )
        

        if (!addedToLoggedInUserDocument || !addedToUserDocument) {
            return NextResponse.json(
              { error: "Failed to update the user's friends list" },
              { status: 500 }
            );
          }

        return NextResponse.json(
            { message: "Friend added successfully" },
            { status: 200 }
          )
    }catch(error){
        console.error("Error updating user's friends list:", error);
        
        return NextResponse.json(
        { error: "An internal server error occurred" },
        { status: 500 }
        )
    }
    
}
export async function DELETE (req: NextRequest) {
    try{
        const { username, loggedInUserId } = await req.json()
        console.log("Delete Friend: ",username, loggedInUserId)

        if (!username || !loggedInUserId) {
            return NextResponse.json(
            { error: "Username and LoggedInUserId are required" },
            { status: 400 }
            );
        }

        const userId = await findUserId(username)
        console.log(userId)

        if (!userId) {
            return NextResponse.json(
            { error: "User with the provided username not found" },
            { status: 404 }
            );
        }

        const loggedInUserObjectId = new ObjectId(loggedInUserId)
        const UserObjectId = new ObjectId(userId)

        const db = client.db()
        const deletedFromLoggedInUserDocument = await db.collection("users").findOneAndUpdate(
            { _id: loggedInUserObjectId },
            {
                $pull: { friends: "6767e1858e3c1ee739916c34" }, // Remove from friends
                $set: { updatedAt: new Date() }, // Set the updatedAt field
            },
            { returnDocument: "after" }
        )
        const deletedFromUserDocument = await db.collection("users").findOneAndUpdate(
            {_id: UserObjectId}, 
            {
                $pull: { friends: loggedInUserId }, // Add to friends array without duplication
                $set: { updatedAt: new Date() }, // Optionally update the timestamp
            },
            { returnDocument: "after" } // Return the updated document
        )
        

        if (!deletedFromLoggedInUserDocument || !deletedFromUserDocument) {
            return NextResponse.json(
              { error: "Failed to update the user's friends list" },
              { status: 500 }
            );
          }

        return NextResponse.json(
            { message: "Friend deleted successfully" },
            { status: 200 }
          )
    }catch(error){
        console.error("Error updating user's friends list:", error);
        
        return NextResponse.json(
        { error: "An internal server error occurred" },
        { status: 500 }
        )
    }
    
}