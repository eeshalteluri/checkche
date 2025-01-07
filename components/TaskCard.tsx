"use client"

import { Check, ClipboardList, Flame, Hourglass, Info, PlayCircle } from "lucide-react";
import { TaskCardHolder, CardHeader, CardTitle, CardContent } from "./TaskCardHolder";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "./ui/button";
import { EllipsisVertical } from 'lucide-react';
import { FlagTriangleRight } from 'lucide-react';
import { useEffect, useRef } from 'react';


import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "./ui/separator";

interface TaskLog {
  _id: string;
  taskId: string;
  logs: { date: string; status: string }[];
}

interface TaskDetails {
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

interface TaskLogType {
  taskLog: TaskLog;
  taskDetails: TaskDetails;
}

interface TaskCardProps {
  task: TaskLogType;
}

const getDayOfYear = (date: Date): number => {
  const startOfYear = new Date(date.getFullYear(), 0, 1); // January 1st of the same year
  const diffInMs = +date - +startOfYear; // Difference in milliseconds
  const dayOfYear = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1; // Convert ms to days
  return dayOfYear;
};

const getDateFromDayOfYear = (dayOfYear: number, year: number = new Date().getFullYear()): string => {
  const startOfYear = new Date(year, 0, 1); // January 1st of the given year
  const targetDate = new Date(startOfYear.getTime() + (dayOfYear - 1) * 24 * 60 * 60 * 1000); // Add days in milliseconds
  const day = String(targetDate.getDate()).padStart(2, '0'); // Get the day
  const month = String(targetDate.getMonth() + 1).padStart(2, '0'); // Get the month
  const formattedDate = `${day}-${month}-${year}`; // Format as "DD-MM-YYYY"
  return formattedDate;
};


const calculateStreaks = (taskLogs: TaskLog) => {
  // Sort logs by date
  const sortedLogs = taskLogs.logs
    .map(log => ({ ...log, date: new Date(log.date) }))
    .sort((a, b) => a.date.getTime() - b.date.getTime()); // Sort in ascending order

  let currentStreak = 0;
  let longestStreak = 0;
  let previousDay: number | null = null;

  for (let i = 0; i < sortedLogs.length; i++) {
    const log = sortedLogs[i];
    const currentDay = getDayOfYear(log.date);

    if (log.status === "completed") {
      // If this is the first completed log or it's consecutive with the previous one
      if (previousDay === null || currentDay === previousDay + 1) {
        currentStreak++;
      } else {
        // Reset streak if days are not consecutive
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1; // Start a new streak
      }

      // Update previousDay to the current day
      previousDay = currentDay;
    } else {
      // Update longest streak if current streak ends
      longestStreak = Math.max(longestStreak, currentStreak);
      currentStreak = 0; // Reset streak for non-completed status
      previousDay = null; // Reset previous day
    }
  }

  // Ensure to compare last streak with longest streak
  longestStreak = Math.max(longestStreak, currentStreak);

  return { currentStreak, longestStreak };
}

const TaskCard: React.FC<TaskCardProps> = (taskData) => {
  const taskDetails = taskData.task.taskDetails;
  const taskLogs = taskData.task.taskLog;

  // Step 1: Create the ref for the scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Step 2: Scroll to the end when the component is mounted
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.scrollLeft = scrollContainer.scrollWidth; // Scroll to the end
    }
  }, []); // Empty dependency array to run this effect once

  const start = getDayOfYear(new Date(taskDetails.startDate));
  const end = getDayOfYear(new Date(taskDetails.endDate || new Date()));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-200";
      case "pending":
        return "bg-amber-200";
      case "approval":
        return "bg-yellow-200";
      case "missed":
        return "bg-red-200";
      default:
        return "bg-gray-200";
    }
  };

  const streak = calculateStreaks(taskLogs)

  return (
    <TaskCardHolder className="mx-2 mt-2 ">
      <CardHeader className="flex justify-between items-center gap-2">
        <div className="flex justify-center items-center gap-2">
          <CardTitle className="max-w-[100px] py-1 truncate">{taskDetails.name}</CardTitle>
          {/* Use HoverCard for larger screens and Popover for smaller screens */}
          <div className="hidden sm:block">
            <HoverCard>
              <HoverCardTrigger>
                <Info className="w-4 h-4" />
              </HoverCardTrigger>
              <HoverCardContent className="p-4 space-y-2 max-w-sm">
              <div className="flex items-center">
                <span className="font-medium text-sm text-gray-500">Type:</span>
                <p className="ml-2 text-sm">{taskDetails.description}</p>
              </div>

              <div className="flex items-center">
                <span className="font-medium text-sm text-gray-500">Task Frequency:</span>
                <p className="ml-2 text-sm">{taskDetails.taskFrequency.charAt(0).toUpperCase() + taskDetails.taskFrequency.slice(1)}</p>
              </div>

              <div className="flex items-center">
                <span className="font-medium text-sm text-gray-500">Frequency:</span>
                <p className="ml-2 text-sm">
                  {taskDetails.frequency.map((freq, index) => (
                    <span key={index}>{freq.charAt(0).toUpperCase() + freq.slice(1)}{index < taskDetails.frequency.length - 1 ? ", " : ""}</span>
                  ))}
                </p>
              </div>

              <div className="flex items-center">
                <span className="font-medium text-sm text-gray-500">Type:</span>
                <p className="ml-2 text-sm">{taskDetails.type === "NT" ? "Normal Task" : "Accountability Task"}</p>
              </div>
              </HoverCardContent>
            </HoverCard>
          </div>

          <div className="sm:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <Info className="w-4 h-4" />
              </PopoverTrigger>
              <PopoverContent className="max-w-[350px] md:w-fit m-2 p-2">
              <div className=" flex justify-end items-start">
                <p className="w-[300px] md:w-full ml-2 text-sm">{taskDetails.description}</p>
              </div>

              <Separator className="my-2"/>

              <div className="flex items-center">
                <span className="font-medium text-sm text-gray-500">Task Frequency:</span>
                <p className="ml-2 text-sm">{taskDetails.taskFrequency.charAt(0).toUpperCase() + taskDetails.taskFrequency.slice(1)}</p>
              </div>

              <div className="flex items-center">
                <span className="font-medium text-sm text-gray-500">Frequency:</span>
                <p className="ml-2 text-sm">
                  {taskDetails.frequency.map((freq, index) => (
                    <span key={index}>{freq.charAt(0).toUpperCase() + freq.slice(1)}{index < taskDetails.frequency.length - 1 ? ", " : ""}</span>
                  ))}
                </p>
              </div>

              <div className="flex items-center">
                <span className="font-medium text-sm text-gray-500">Type:</span>
                <p className="ml-2 text-sm">{taskDetails.type === "NT" ? "Normal Task" : "Accountability Task"}</p>
              </div>
              </PopoverContent>
            </Popover>
          </div>
          
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="flex justify-center items-center text-sm">
              {streak.currentStreak ? <p>{streak.currentStreak}</p>: <p>-</p>}
              <Flame className="w-5 h-5 text-orange-500" />
            </div>

            <p className="w-fit text-xs text-gray-500">Curr.</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex justify-center items-center text-sm">
            {streak.longestStreak ? <p>{streak.longestStreak}</p>: <p>-</p>}
              <Flame className="w-5 h-5 text-orange-500" />
            </div>

            <p className="w-fit text-xs text-gray-500">Long.</p>
          </div>
        </div>

        <div className="flex justify-center items-center">
          <Button>Mark</Button>
          <Popover>
            <PopoverTrigger asChild>
              <EllipsisVertical />
            </PopoverTrigger>

            <PopoverContent className="w-fit m-2 p-2">
              <div className="flex gap-2">
                <Button size={"sm"}>Edit task</Button>
                <Button size={"sm"}>Delete</Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>

      <CardContent  ref={scrollContainerRef} className="w-full overflow-x-auto overflow-y-hidden">
        <div className="w-fit overflow-x-auto overflow-y-hidden grid grid-flow-col grid-rows-7 gap-x-[1px] gap-y-[1px]">
          {Array.from({ length: end }).map((_, index) => {
            const currentDay = index + 1;
            const currentDate = getDateFromDayOfYear(currentDay)
            let colorClass = "bg-gray-200"; // Default color for days before start

            console.log("Start Day:", start, "Current Day:", currentDay)
            // Find log for this day
            const logForDay = taskLogs.logs.find(
              (log) => getDayOfYear(new Date(log.date)) === currentDay
            );

            if (currentDay >= start && currentDay <= end) {
              // Use log status if available
              if (logForDay) {
                colorClass = getStatusColor(logForDay.status);
              }
            }

            return (
              <HoverCard key={index}>
                <HoverCardTrigger>
                  <div
                    className={`w-[14px] h-[14px] rounded-sm ${colorClass} relative flex justify-center items-center`}
                  >
                    {currentDay === start && (
                      
                      <FlagTriangleRight className="w-3 h-3 absolute text-center text-blue-500"/>
                    )}
                  </div>
                </HoverCardTrigger>

                <HoverCardContent>
                  <p>{currentDate}</p>
                  <p>{logForDay ? logForDay.status : "-"}</p>
                </HoverCardContent>
              </HoverCard>
            );
          })}
        </div>
      </CardContent>
    </TaskCardHolder>
  );
};

export default TaskCard;
