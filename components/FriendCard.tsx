import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { UserMinus } from "lucide-react";

const FriendCard = ({fullname, username}: {fullname: String, username: String}) => {
  return (
    <Card className="w-full p-4 flex jusify-between items-center">
        <div className="flex-1 space-y-1">
          <CardTitle>{fullname}</CardTitle>
          <CardDescription>@{username}</CardDescription>
        </div>
        
        <UserMinus className="text-red-500 cursor-pointer"/>
    </Card>
  );
};

export default FriendCard;
