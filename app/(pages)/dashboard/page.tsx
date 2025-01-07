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
  taskLog: {
    _id: string;
  taskId: string;
  logs: { date: string; status: string }[]; // Array of objects with date and status properties
  },
  taskDetails: {
    _id: string;
    userId: string;
    name: string;
    description: string;
    taskFrequency: string;
    frequency: string[];
    type: string;
    accountabilityPartner: {
      name: string;
      username: string;
    };
    startDate: string;
    endDate: string | null;
    createdAt: string;
    updatedAt: string;
  }
}

export default function Home() {
  const { data: session } = useSession();
  const [tasksData, setTasksData] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasksLogs = async () => {
      const taskIds = session?.user?.tasks || []; // Ensure fallback for tasks
      if (taskIds.length > 0) {
        console.log("User Tasks: ", taskIds);
        try {
          const response = await fetch("/api/tasks/tasklogs", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ taskIds }), // Send the array of task IDs
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch tasks: ${response.statusText}`);
          }

          const data = await response.json();
          console.log("Fetched Task logs: ", data)

          setTasksData(data.tasksLogsData)
        } catch (error) {
          console.error("Error fetching tasks:", error);
          setTasksData([]); // Reset state to avoid UI inconsistencies
        }
      }
    };

    fetchTasksLogs();
  }, [session?.user?.tasks]);

  if (!session) return <p>Loading...</p>;

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

      {/* Render TaskCard for each task */}
      {Array.isArray(tasksData) && tasksData.length === 0 ? (
        <p>no tasks found.</p>
      ) : (
        tasksData?.map((taskData) => <TaskCard key={taskData.taskDetails._id} task={taskData} />)
      )}
    </div>
  );
}
