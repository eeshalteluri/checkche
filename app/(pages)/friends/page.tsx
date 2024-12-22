"use client";

import { Form, FormControl, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import SearchFriendCard from "@/components/SearchFriendCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import FriendCard from "@/components/FriendCard";
import RequestFriendCard from "@/components/RequestFriendCard";

interface FormData {
  username: string;
}

const FriendsPage = () => {
  const { data: session, status } = useSession(); // Track session status
  const [searchedUsername, setSearchedUsername] = useState("");
  const [searchedUser, setSearchedUser] = useState({
    fullName: "",
    userName: "",
  });
  const form = useForm<FormData>();

  console.log("LoggedInUsername: ", session?.user);

  const submitHandler = async (data: FormData) => {
    console.log(data);
    setSearchedUsername(data.username);

    const response = await fetch("/api/check-username", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: data.username,
      }),
    });

    const userData = await response.json();
    console.log(userData);

    await setSearchedUser({
      fullName: userData.data?.name,
      userName: userData.data?.username,
    });
  };

  // Render loading state while session is being fetched
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // If not logged in, you can handle that case (e.g., redirect or show an error message)
  if (!session) {
    return <div>You are not logged in. Please log in to access your friends.</div>;
  }

  return (
    <div className="h-full mx-2 mb-2 space-y-4">
      <div className="w-full flex justify-center items-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)}>
            <FormLabel />
            <FormControl>
              <div className="flex items-center gap-2 mt-4">
                {/* Input Field */}
                <Input
                  placeholder="Search by @username"
                  className="w-64"
                  {...form.register("username")}
                />
                {/* Button Inline with Input */}
                <Button type="submit" className="flex-shrink-0">
                  <Search />
                </Button>
              </div>
            </FormControl>
          </form>
        </Form>
      </div>

      {searchedUsername && (
        <div className="space-y-2">
          <h3>Search results for "{searchedUsername}"</h3>
          {searchedUser.fullName ? (
            <SearchFriendCard
              loggedInUsername={session.user.username!}
              fullname={searchedUser.fullName}
              username={searchedUser.userName}
            />
          ) : (
            <p className="text-center bg-red-300 text-white rounded">
              User does not exist!
            </p>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Friends</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <FriendCard fullname={"Praveen Kumar hinge"} username={"eeshal"} />
          <FriendCard fullname={"Eeshal"} username={"eeshal"} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Friend Requests</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <Card>
            <CardHeader>
              <CardTitle>Requests Sent</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              <RequestFriendCard fullname={"Eeshal"} username={"eeshal"} type="sent" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requests Received</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              <RequestFriendCard fullname={"Eeshal"} username={"eeshal"} type="received" />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default FriendsPage;
