"use client"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ChevronRight } from "lucide-react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Merge, FieldErrorsImpl } from "react-hook-form";

import {
  Card,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { FieldError } from "react-hook-form";

interface AddAccountabilityPartnerProps {
  selectedPartner: {name: string, username: string}
  onPartnerSelect: (partner: {name: string, username: string}) => void;
  error?:  FieldError | Merge<FieldError, FieldErrorsImpl<{ name: string; username: string }>>
}

const AddAccountabilityPartner = ({ selectedPartner, onPartnerSelect, error }: AddAccountabilityPartnerProps) => {
  const { data: session } = useSession();
  const [friends, setFriends] = useState< {name: string; username: string }[]>([])
  const [searchedPartner, setSearchedPartner] = useState<string>("");
  

  useEffect(() => {
    if (session?.user?.friends) {
      setFriends(session.user.friends);
    }
  }, [session]);

  const filteredFriends = friends.filter(
    (friend: any) =>
      friend.name.toLowerCase().includes(searchedPartner.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchedPartner.toLowerCase())
  );

  const handleSelectPartner = (friend: any) => {
    onPartnerSelect(friend)
    console.log("Selected Partner:", friend); // You can send this data to an API or handle it as needed
  };

  return (
    <Drawer>
      <DrawerTrigger className= "w-full">
        <div className={`flex items-center justify-between p-2 border rounded ${!selectedPartner.username && error ? "border-red-500":""}`}>
          <Label htmlFor="title" className="text-right">
            Accountability Partner
          </Label>

          {selectedPartner.username ? <Badge className="max-w-25">{selectedPartner?.username}</Badge>: <ChevronRight /> }
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Select your Partner</DrawerTitle>
          <DrawerDescription />
        </DrawerHeader>

        <div className="mx-4">
          <Input
            value={searchedPartner}
            onChange={(e) => setSearchedPartner(e.target.value)}
            placeholder="Add from your friends"
          />

          <div className="mt-2">
            {Array.isArray(filteredFriends) && filteredFriends.length > 0 ? (
              filteredFriends.map((friend: any) => (
                <Card
                  key={friend.id}
                  className="w-full p-4 flex justify-between items-center"
                >
                  <div className="flex-1 space-y-1">
                    <CardTitle>{friend.name}</CardTitle>
                    <CardDescription>@{friend.username}</CardDescription>
                  </div>

                  <DrawerClose>
                    <Button onClick={() => handleSelectPartner(friend)}>
                      Add
                    </Button>
                  </DrawerClose>
                </Card>
              ))
            ) : (
              <p className="text-gray-500">No friends available</p>
            )}
          </div>
        </div>

        <DrawerFooter>
          {selectedPartner.username && (
            <div className="text-sm text-gray-600">
              Selected Partner: {selectedPartner.name} (@{selectedPartner.username})
            </div>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddAccountabilityPartner;
