import { NextRequest, NextResponse } from "next/server";
import  { findUserDetails } from "@/app/helpers/FindUser";
import client from "@/lib/db";




export async function POST (req: NextRequest) {
    try{
        const { username, loggedInUsername, loggedInUserFullname } = await req.json()
        console.log(username, loggedInUsername)

        if (!username || !loggedInUsername) {
            return NextResponse.json(
            { error: "Username and LoggedInUsername are required" },
            { status: 400 }
            );
        }

        const user = await findUserDetails(username)
        console.log(user)
        

        if (!user) {
            return NextResponse.json(
            { error: "User with the provided username not found" },
            { status: 404 }
            );
        }

        
        

        const db = client.db()
        const addedToLoggedInUserDocument = await db.collection("users").findOneAndUpdate(
            {username: loggedInUsername}, 
            {
                $addToSet: { friends: {name: user.name, username: user.username} }, // Add to friends array without duplication
                $set: { updatedAt: new Date() }, // Optionally update the timestamp
            },
            { returnDocument: "after" } // Return the updated document
        )
        const addedToUserDocument = await db.collection("users").findOneAndUpdate(
            {username: username}, 
            {
                $addToSet: { friends: {name: loggedInUserFullname, username: loggedInUsername} }, // Add to friends array without duplication
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

export async function DELETE(req: NextRequest) {
    try {
      const { username, loggedInUsername }: {username: string, loggedInUsername: string} = await req.json();
  
      if (!username || !loggedInUsername) {
        return NextResponse.json(
          { error: "Username and LoggedInUsername are required" },
          { status: 400 }
        );
      }
  
      const db = client.db();
  
      // Remove the friend object from the logged-in user's friends list
      const deletedFromLoggedInUserDocument = await db.collection("users").findOneAndUpdate(
        { username: loggedInUsername },
        { $pull: { friends: { username: username } } },
        { returnDocument: "after" }
      );
  
      // Remove the logged-in user object from the friend's friends list
      const deletedFromUserDocument = await db.collection("users").findOneAndUpdate(
        { username: username },
        {
          $pull: { friends: { username: loggedInUsername } }, // Remove the object with matching username
          $set: { updatedAt: new Date() },
        },
        { returnDocument: "after" }
      );
  
      if (!deletedFromLoggedInUserDocument.value || !deletedFromUserDocument.value) {
        return NextResponse.json(
          { error: "Failed to update the user's friends list" },
          { status: 500 }
        );
      }
  
      return NextResponse.json({ message: "Friend deleted successfully" }, { status: 200 });
    } catch (error) {
      console.error("Error updating user's friends list:", error);
      return NextResponse.json(
        { error: "An internal server error occurred" },
        { status: 500 }
      );
    }
  }
  