import client from "@/lib/db";

 export const findUserId = async (username: string) => {
    try{
        const db = client.db()    
        console.log(username)

        // Find users by their usernames
        const User = await db.collection("users").findOne({ username });
    

        console.log(User?._id.toString())
        return User?._id.toString()
    }catch(error){
        console.error("Error finding user ID:", error);
        return null;
    }
}

export const findUserDetails = async (username: string) => {
    try{
        const db = client.db()    
        console.log(username)

        // Find users by their usernames
        const User = await db.collection("users").findOne({ username });
    

        console.log("User: ", User)
        return User
    }catch(error){
        console.error("Error finding user:", error);
        return null;
    }
}

