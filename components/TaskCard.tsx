import { Check, ClipboardList, Hourglass, Info } from "lucide-react";
import { TaskCardHolder, 
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent } from "./TaskCardHolder";
import { Button } from "./ui/button";

const TaskCard = () => {
  return (
    <TaskCardHolder className="mx-2 mt-2 ">
        <CardHeader className="flex justify-between items-center">
            <div className="flex justify-center items-center gap-2">
            <div className="flex flex-col">
            <CardTitle>Create project</CardTitle>
            <CardDescription/>
            </div>
            <Info className="w-4 h-4"/>
            </div>

            <Button>Mark</Button>
            {/*<Button><Check/></Button>
            <Button><ClipboardList/></Button>
            <Button><Hourglass/></Button>*/}
        </CardHeader>

        <CardContent className="w-full flex flex-col justify-center items-center">  
        <div className="w-full overflow-scroll grid grid-flow-col grid-rows-7 gap-x-[1px] gap-y-[1px]">
        {Array.from({ length: 365 }).map((_, index) => (
            <div
            key={index}
            className={`w-3 h-3 rounded ${index%2 === 0 ? "bg-green-200": "bg-gray-200" }`}
            ></div>
        ))}
        </div>
        </CardContent>
    </TaskCardHolder>
  );
};

export default TaskCard;
