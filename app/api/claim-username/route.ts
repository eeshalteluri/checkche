import { NextRequest, NextResponse } from "next/server"
import client from "@/lib/db"

export async function POST(req: NextRequest){
    try{
        const { email, username } = await req.json()
        console.log(email, username)
    
        if(!username || username.trim() === ""){
            return NextResponse.json(
                        {
                            error: "Username is required."
                        },
                        {
                            status:405
                        }
                    )
        }
    
        const db = client.db()
        const user = await db.collection("users").findOneAndUpdate(
            {email},
            { $set: { username } }, // Update username
            { returnDocument: "after" } // Return the updated document
        )
    
        if(user){
            return NextResponse
            .json(
                {
                    message: "Username added successfully",
                    data: [user],
                    error: null
                },
                {
                    status: 200
                }
            )  
        }

        }catch(error){
            return NextResponse
            .json(
                {
                    message: "",
                    data: [],
                    error: "Internal Server Error"
                },
                {
                    status: 500
                }
            )
        }
}