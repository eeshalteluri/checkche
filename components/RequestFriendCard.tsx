import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
  } from "@/components/ui/card";
import { Button } from "./ui/button";
import { useState } from "react";
import { useSession } from "next-auth/react";

  
  const RequestFriendCard = ({fullname, username, type}: {fullname: string, username: string, type: string}) => {
    const { data: session} = useSession()
    const [ isClicked, setIsClicked ] = useState<boolean>(false)

    const deleteRequest = async (fromUsername: string, toUsername: string) => {
      
      try{
        const response = await fetch("/api/friend-request",{
          "method": "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fromUsername, toUsername
          })
        })

        const data = await response.json()
        console.log("Delete received request: ",data)
        }catch(error){
        console.error("Error deleting friend request:", error)
        }
    }

    const handleDeleteClick = async () => {
      setIsClicked(true);
      await deleteRequest(
        type === "received" ? username : session?.user?.username!,
        type === "received" ? session?.user?.username! : username
      );
      setIsClicked(false);
    }

    const addFriend = async (username: string, loggedInUsername: string, loggedInUserFullname: string) => {
      const response = await fetch("/api/friend",{
        "method": "POST",
        "headers": {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          loggedInUsername,
          loggedInUserFullname
        })
      })
    }

    return (
      <Card className={`w-full p-4 flex ${type == "sent"? "flex-row" : "flex-col"} jusify-between items-center`}>
          <div className="flex-1 space-y-1 mb-2 text-center">
            <CardTitle>{fullname}</CardTitle>
            <CardDescription>{username}</CardDescription>
          </div>
          
          <div className="flex gap-2">
          {type == "received" && <Button onClick={() => addFriend(username, session?.user.username, session?.user.name)}>Accept</Button>}
          <Button onClick={handleDeleteClick}>Delete</Button>
          </div>
      </Card>
    );
  };
  
  export default RequestFriendCard;
  