"use client"
import { useSession } from "next-auth/react";
import ClaimUsername from "../../components/ClaimUsername";
import Sidebar from "@/components/Sidebar";
import ProgressCard from "@/components/ProgressCard";
import RemainingTasks from "@/components/RemainingTasks";
import TasksCard from "@/components/TasksCard";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";


export default function Home() {

  const { data: session } = useSession();

    if (!session) return <p>Loading...</p>;
    console.log("session: ", session)
  

  return (
    <div>
      <h1>Welcome, {session.user?.name}</h1>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex justify-center">
        <ClaimUsername/>
        </div>
      </div>

      <div className="flex justify-between align-center px-2 gap-2 h-[200px] xs:h-[250px] ">
      <ProgressCard />
      <RemainingTasks />
      </div>

      <TasksCard />
    </div>
  );
}