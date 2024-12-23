import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
  } from "@/components/ui/card";
  import { UserMinus } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
  
  const FriendCard = ({fullname, username, loggedInUsername}: {fullname: String, username: String, loggedInUsername: String}) => {

    console.log(username, loggedInUsername)

    const sendFriendRequest = async () => {
      const response = await fetch("/api/friend-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "fromUsername": loggedInUsername,
            "toUsername": username
          }) 
        })

      console.log("Friend Request Response: ",response)
    }

    const searchedThemself = () => {
      if(username == loggedInUsername) return true
      else return false
    }
    return (
      <Card className="w-full p-4 flex jusify-between items-center">
          <div className="flex-1 space-y-1">
            <CardTitle>{fullname}</CardTitle>
            <CardDescription className="font-italic">@{username}</CardDescription>
          </div>
          
          <Button onClick={() =>{sendFriendRequest()}} disabled={searchedThemself()}>Send Request</Button>
      </Card>
    );
  };
  
  export default FriendCard;
  