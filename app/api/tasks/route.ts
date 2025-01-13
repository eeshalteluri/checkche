import Task from "@/models/Task";
import TaskLog from "@/models/Tasklog";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    try{
        const {taskId} = await req.json()

        if(!taskId) {
            return NextResponse.json(
                { message: "Task ID is required." },
                { status: 400 }
            )
        }

        const [ deletedTaskDetails, deletedTaskLogs ] = await Promise.all([
            Task.deleteOne({_id: taskId}),
            TaskLog.deleteOne({taskId})
        ])

        if( deletedTaskDetails.deletedCount === 0 && deletedTaskLogs.deletedCount === 0 ) {
            return NextResponse.json(
                { message : "No task or task logs found to delete. "},
                { status : 404 }
            )
        }

        if( deletedTaskLogs.deletedCount === 0) {
            return NextResponse.json(
                { message : "Task Log deleted, but Task was not found. "},
                { status : 404 }
            )
        }

        if( deletedTaskDetails.deletedCount === 0 ) {
            return NextResponse.json(
                { message : "Task deleted, but Task Log was not found. "},
                { status : 404 }
            )
        }

        return NextResponse.json(
            { message: "Task deleted successfully" },
            { status: 200 }
        )
    }catch(error){
        console.error("Error deleting task:", error);
        
        return NextResponse.json(
        { message: "An error occurred while deleting the task." },
        { status: 500 }
        )
    }
  }