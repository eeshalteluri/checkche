"use client";
import { useSession } from "next-auth/react";
import ClaimUsername from "../../../components/ClaimUsername";
import Sidebar from "@/components/Sidebar";
import ProgressCard from "@/components/ProgressCard";
import RemainingTasks from "@/components/RemainingTasks";
import TasksCard from "@/components/TasksCard";
import TaskCard from "@/components/TaskCard";
import { useEffect, useState } from "react";

interface Task {
  _id: string;
  taskId: string;
  logs: { date: string; status: string }[]; // Array of objects with date and status properties
}


export default function Home() {
  const { data: session } = useSession();
  const [taskLogs, setTaskLogs] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (session?.user?.tasks?.length > 0) {
        try {
          const response = await fetch("/api/taskslogs", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ taskIds: session?.user.tasks }), // Send the array of task IDs
          });

          const data = await response.json();
          setTaskLogs(data.tasks || []); // Assuming the API returns a `tasks` array
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      }
    };

    fetchTasks();
  }, [session]);

  if (!session) return <p>Loading...</p>;
  console.log("session: ", session);

  return (
    <div>
      <h1>Welcome, {session.user?.name}</h1>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex justify-center">
          {!session.user.username && <ClaimUsername />}
        </div>
      </div>

      <div className="flex justify-between align-center px-2 gap-2 h-[200px] xs:h-[250px]">
        <ProgressCard />
        <RemainingTasks />
      </div>

      <TasksCard />

      {/* Render TaskCard for each task */}
      <div className="task-cards-container">
        {taskLogs.length > 0 ? (
          taskLogs.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </div>
    </div>
  );
}
