import { NextRequest, NextResponse } from "next/server";
import taskSchema from "@/zod/TaskSchema";
import { z } from "zod";
import Task from "@/models/Task";
import { connectDB } from "@/lib/dbConnect";
import TaskLog from "@/models/Tasklog";
import { generateCustomDateLogs, generateDailyLogs, generateMonthlyLogs, generateWeeklyLogs } from "@/app/helpers/GenerateLogs";

export async function POST(req: NextRequest) {
    try {
      await connectDB()
      
      const {userId, taskName, taskDescription, frequencyType, frequency, from, end,  taskType, accountabilityPartner} = await req.json()
      console.log("body: ", userId, taskName, taskDescription, frequencyType, frequency, from, end, taskType, accountabilityPartner)

      const parsedFrom = new Date(from)
      const parsedEnd = end ? new Date(end) : null

      const validatedData = taskSchema.parse({
        taskName, 
        taskDescription, 
        frequencyType, 
        frequency, 
        from: parsedFrom, 
        end: parsedEnd, 
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
        endDate: validatedData.end
      })
      const savedNewTask = await newTask.save()

      let logs: {date: string, status: string}[] = [] ;
    const currentDate = new Date();
    const startDate = new Date(validatedData.from);
    const endDate = validatedData.end ? new Date(validatedData.end) : null;
    
    if (validatedData.frequencyType === "daily") {
        logs = generateDailyLogs(startDate, endDate || currentDate )
        console.log("Logs to database: ", logs)
    }else if(validatedData.frequencyType === "weekly") {
        logs = generateWeeklyLogs(startDate, endDate || currentDate, validatedData.frequency as string[] )
        console.log("Logs to database (weekly): ", logs)
    }else if(validatedData.frequencyType === "monthly") {
        logs = generateMonthlyLogs( startDate, endDate || currentDate, validatedData.frequency as string[] )
        console.log("Logs to database (monthly): ", logs)
    }else if(validatedData.frequencyType === "custom") {
        logs = generateCustomDateLogs(validatedData.frequency as Date[] )
        console.log("Logs to database (custom): ", logs)
    }

    
    /*const newTaskLog = await new TaskLog({
        taskId: savedNewTask._id,
        type: savedNewTask.taskFrequency,
        logs

        await newTaskLog.save() 
     }) */

     

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