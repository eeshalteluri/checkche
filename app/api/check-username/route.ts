import client from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try{
    const { username } = await req.json()
    console.log(username)

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
    const user = await db.collection("users").findOne({username})

    console.log(user)

    if(user){
        return NextResponse
        .json(
            {
                availability: false,
                data: user
            },
            {
                status: 200
            }
        )  
    }

    return NextResponse
        .json(
            {
                availability: true,
                data: null
            },
            {
                status: 200
            }
        )
    }catch(error){
        return NextResponse
        .json(
            {
                error: "Internal Server Error"
            },
            {
                status: 200
            }
        )
    }

}