import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { UserMinus } from "lucide-react";
import { useState } from "react";

const FriendCard = ({fullname, username, loggedInUserId}: {fullname: string, username: string, loggedInUserId: string}) => {
  console.log(loggedInUserId)
  const [isRemoving, setIsRemoving] = useState(false);
  const removeFriend = async(username: string, loggedInUserId: string) => {
    setIsRemoving(true)
    try{
      const response =  await fetch("/api/friend",{
      method: "DELETE",
      headers: {
      "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        loggedInUserId
      })
    })


    if (!response.ok) {
      // Handle errors returned by the server
      console.error("Failed to remove friend");
    } else {
      // Optionally refresh the UI or provide feedback
      console.log("Friend removed successfully");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    setIsRemoving(false); // Reset loading state
  }
    }

  return (
    <Card className="w-full p-4 flex jusify-between items-center">
        <div className="flex-1 space-y-1">
          <CardTitle>{fullname}</CardTitle>
          <CardDescription>@{username}</CardDescription>
        </div>
        
        <UserMinus onClick={() => removeFriend(username, loggedInUserId)} className={`text-red-500 cursor-pointer ${
          isRemoving ? "opacity-50 cursor-not-allowed" : ""
        }`}/>
    </Card>
  )
}

export default FriendCard;
