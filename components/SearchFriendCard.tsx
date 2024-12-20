import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
  } from "@/components/ui/card";
  import { UserMinus } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
  
  const FriendCard = ({fullname, username}: {fullname: String, username: String}) => {
    const [ isClicked, setIsClicked ] = useState<boolean>(false)
    return (
      <Card className="w-full p-4 flex jusify-between items-center">
          <div className="flex-1 space-y-1">
            <CardTitle>{fullname}</CardTitle>
            <CardDescription>{username}</CardDescription>
          </div>
          
          <Button onClick={() => setIsClicked(!isClicked)}>{ isClicked ? "Remove" : "Send Request" }</Button>
      </Card>
    );
  };
  
  export default FriendCard;
  