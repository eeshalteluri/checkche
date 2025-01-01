"use client"
import { Check, ClipboardList, Flame, Hourglass, Info } from "lucide-react";
import { TaskCardHolder, 
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent } from "./TaskCardHolder";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "./ui/button";
import { EllipsisVertical } from 'lucide-react';
import { useState } from "react";

const TaskCard = () => {
 
  return (
    <TaskCardHolder className="mx-2 mt-2 ">
        <CardHeader className="flex justify-between items-center gap-2">
            <div className="flex justify-center items-center gap-2">
            <CardTitle className="w-fit">Create project</CardTitle>
            <Info className="w-4 h-4"/>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex justify-center items-center text-sm">
                  <p>123</p>
                  <Flame className="w-5 h-5 text-orange-500"/>
                </div>

                <p className="w-fit text-xs text-gray-500">Curr.</p>
                
              </div>

              <div className="flex flex-col items-center">
                <div className="flex justify-center items-center text-sm">
                  <p>123</p>
                  <Flame className="w-5 h-5 text-orange-500"/>
                </div>

                <p className="w-fit text-xs text-gray-500">Long.</p>
                
              </div>
            </div>

            <div className="flex justify-center items-center">
            <Button>Mark</Button>
            <Popover>
              <PopoverTrigger asChild>
                <EllipsisVertical/>
              </PopoverTrigger>
              
              <PopoverContent className="w-fit m-2 p-2">
                <div className="flex gap-2">
                  <Button size={"sm"}>Edit task</Button>
                  <Button size={"sm"}>Delete</Button>
                </div>
              </PopoverContent>
            </Popover>
            </div>
            {/*<Button><Check/></Button>
            <Button><ClipboardList/></Button>
            <Button><Hourglass/></Button>*/}
        </CardHeader>

        <CardContent className="w-full flex flex-col justify-center items-center">  
        <div className="w-full overflow-scroll grid grid-flow-col grid-rows-7 gap-x-[1px] gap-y-[1px]">
        {Array.from({ length: 365 }).map((_, index) => (
            <div
            key={index}
            className={`w-[14px] h-[14px] rounded-sm ${index%2 === 0 ? "bg-green-200": "bg-gray-200" }`}
            ></div>
        ))}
        </div>
        </CardContent>
    </TaskCardHolder>
  );
};

export default TaskCard;
