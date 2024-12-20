import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
  } from "@/components/ui/card";
  import { UserMinus } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
  
  const RequestFriendCard = ({fullname, username, type}: {fullname: String, username: String, type: String}) => {
    const [ isClicked, setIsClicked ] = useState<boolean>(false)
    return (
      <Card className={`w-full p-4 flex ${type == "sent"? "flex-row" : "flex-col"} jusify-between items-center`}>
          <div className="flex-1 space-y-1 mb-2">
            <CardTitle>{fullname}</CardTitle>
            <CardDescription>{username}</CardDescription>
          </div>
          
          <div className="flex gap-2">
          {type == "received" && <Button>Accept</Button>}
          <Button>Delete</Button>
          </div>
      </Card>
    );
  };
  
  export default RequestFriendCard;
  