import { NextRequest, NextResponse } from "next/server";
import taskSchema from "@/zod/TaskSchema";
import { z } from "zod";
import Task from "@/models/Task";
import { connectDB } from "@/lib/dbConnect";
import TaskLog from "@/models/Tasklog";
import { generateDailyLogs, generateWeeklyLogs } from "@/app/helpers/GenerateLogs";

export async function POST(req: NextRequest) {
    try {
      await connectDB()
      
      const {userId, taskName, taskDescription, frequencyType, frequency, from, end, startMonth, taskType, accountabilityPartner} = await req.json()
      console.log("body: ", userId, taskName, taskDescription, frequencyType, frequency, from, end, startMonth, taskType, accountabilityPartner)

      const parsedFrom = new Date(from)
      const parsedEnd = end ? new Date(end) : null
      const validatedData = taskSchema.parse({
        taskName, 
        taskDescription, 
        frequencyType, 
        frequency, 
        from: parsedFrom, 
        end: parsedEnd, 
        startMonth, 
        taskType, 
        accountabilityPartner
      });
      console.log("validated Data: ", validatedData)

      const newTask = await new Task({
        userId,
        name: validatedData.taskName,
        description: validatedData.description,
        taskFrequency: validatedData.frequencyType,
        frequency: validatedData.frequency,
        type: validatedData.taskType,
        accountabilityPartner: validatedData.accountabilityPartner,
        startDate: validatedData.from,
        endDate: validatedData.end,
        startMonth: validatedData.startMonth
      })
      const savedNewTask = await newTask.save()

      let logs: { [key: string]: {date: string, status: string}[]} = {};
    const currentDate = new Date();
    const startDate = new Date(validatedData.from);
    const endDate = validatedData.end ? new Date(validatedData.end) : null;
    
    if (validatedData.frequencyType === "daily") {
        logs["daily"] = generateDailyLogs(startDate, endDate || currentDate )
    }else if(validatedData.frequencyType === "weekly") {
         generateWeeklyLogs(startDate, endDate || currentDate )
    }

    /*
    const newTaskLog = await new TaskLog({
        taskId: savedNewTask._id,
        type: savedNewTask.taskFrequency,
        logs /*object of key value pairs of array of specific task type 
     })

    await newTaskLog.save() */

      return NextResponse.json({ success: true, data: validatedData });
    } catch (error) {
      // Handle validation errors
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            success: false,
            errors: error.errors, // Zod provides detailed error messages here
          },
          { status: 400 }
        );
      }
  
      console.error("Unhandled Error: ", error)
      return NextResponse.json(
        {
          success: false,
          error: error,
          message: "Something went wrong.",
        },
        { status: 500 }
      );
    }
  }