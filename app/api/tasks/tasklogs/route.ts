import { connectDB } from "@/lib/dbConnect";
import Task from "@/models/Task";
import TaskLog from "@/models/Tasklog";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    
    const { taskIds } = await req.json();

    // Validate input
    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid task IDs provided." },
        { status: 400 }
      );
    }

    // Fetch task logs and details concurrently using Promise.all
    const tasksLogsData = await Promise.all(
      taskIds.map(async (taskId) => {
        try {
          const taskLog = await TaskLog.findOne({ taskId });
          const taskDetails = await Task.findById(taskId);

          if (taskLog) {
            return { taskLog, taskDetails };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching data for task ID ${taskId}:`, error);
          return null; // Skip tasks with errors
        }
      })
    );

    // Filter out null results (cases where task logs were not found)
    const filteredTasksLogsData = tasksLogsData.filter((data) => data !== null);

    console.log("Total tasks logs:", filteredTasksLogsData);

    return NextResponse.json({ success: true, tasksLogsData: filteredTasksLogsData });
  } catch (error) {
    console.error("Unhandled Error:", error instanceof Error ? error.message : error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
