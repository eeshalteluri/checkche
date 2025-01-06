import { connectDB } from "@/lib/dbConnect";
import Task from "@/models/Task";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { taskIds } = await req.json();

    if (!taskIds || taskIds.length === 0) {
      return NextResponse.json({ success: false, message: "No task IDs provided." }, { status: 400 });
    }

    const tasks = await Task.find({ _id: { $in: taskIds } });

    return NextResponse.json({ success: true, tasks });
  } catch (error) {

    console.error("Unhandled Error: ", error instanceof Error ? error.message : error);

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
