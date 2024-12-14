import ClaimUsername from "../components/ClaimUsername";
import Sidebar from "@/components/Sidebar";
import ProgressCard from "@/components/ProgressCard";
import RemainingTasks from "@/components/RemainingTasks";
import TasksCard from "@/components/TasksCard";

export default function Home() {
  return (
    <div>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex justify-center">
        <ClaimUsername/>
        </div>
      </div>

      <div className="flex justify-between align-center px-2 gap-2 h-[200px] xs:h-[250px] ">
      <ProgressCard />
      <RemainingTasks />
      </div>

      <TasksCard />
    </div>
  );
}
