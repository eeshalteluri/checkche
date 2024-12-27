"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  
  
  import { Button } from "./ui/button";
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import { Textarea } from "@/components/ui/textarea"
import { useState } from "react";
import { Toggle } from "@/components/ui/toggle"
import { Calendar } from "@/components/ui/calendar"
import { Calendar1, ChevronRight, Info } from "lucide-react";
import AddAccountabilityPartner from "./AddAccountabilityPartner";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { DatePicker } from "./DatePicker";

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const AddNewTask = () => {
  const [formData, setFormData] = useState<{
    taskName: string;
    description: string;
    frequencyType: string;
    frequency: string[] | Date[]; // Correct type
    taskType: string;
    accountabilityPartner: string;
    from: Date
    end: Date | null
  }>({
    taskName: "",
    description: "",
    frequencyType: "daily",
    frequency: [],
    taskType: "AT",
    accountabilityPartner: "",
    from: new Date(), 
    end: null
  })
  
  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "frequencyType" && { frequency: [] }), // Reset frequency if frequencyType changes
    }));
  };

  const handleSubmit = () => {
    console.log(formData); // This can be sent to your database API
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="bg-white text-black text-xl hover:bg-slate-300">
          +
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Task Name */}
          <div>
            <Label htmlFor="name">Task Name</Label>
            <Input
              id="name"
              value={formData.taskName}
              onChange={(e) => handleChange("taskName", e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          {/* Frequency */}
          <div>
            <Label>Task Frequency</Label>
            <div className="grid grid-cols-4 gap-2">
              {["daily", "weekly", "monthly", "custom"].map((freq) => (
                <Button
                  key={freq}
                  variant="outline"
                  onClick={() => handleChange("frequencyType", freq)}
                  className={`${
                    formData.frequencyType === freq
                      ? "bg-blue-500 text-white hover:bg-blue-500 hover:text-white"
                      : ""
                  }`}
                >
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Conditional Inputs for Weekly, Monthly, Custom */}
          
          {/* Weekly Selection */}
          {formData.frequencyType === "weekly" && (
            <div >
              <ToggleGroup
                type="multiple"
                value={formData.frequency as string[]}
                className="w-full grid grid-cols-7 gap-2"
                onValueChange={(selectedDays) =>
                setFormData((prev) => ({
                    ...prev,
                    frequency: selectedDays,
                  }))
                }
              >
              {["monday", "tuesday", "wednesday", "thrusday", "friday", "saturday", "sunday"].map((day) => (
                <ToggleGroupItem
                  key={day}
                  value={day}
                  variant={"outline"}
                  className="outline-none data-[state=on]:bg-blue-500 data-[state=on]:text-white"
                >
                  {day.charAt(0).toUpperCase()}
                </ToggleGroupItem>
              ))}
              </ToggleGroup>
            </div>
          )}

          {/* Monthly Selection */}
          {formData.frequencyType === "monthly" && (
            <>
              <div >
              <ToggleGroup
                type="multiple"
                value={formData.frequency as string[]}
                className="w-full grid grid-cols-7 gap-2"
                onValueChange={(selectedDates) =>
                setFormData((prev) => ({
                    ...prev,
                    frequency: selectedDates,
                  }))
                }
              >
                {Array.from({ length: 31 }, (_, i) => (
                  <ToggleGroupItem
                  key={i+1}
                  value={(i+1).toString()}
                  variant={"outline"}
                  className="outline-none data-[state=on]:bg-blue-500 data-[state=on]:text-white"
                >
                  {i+1}
                </ToggleGroupItem>
              ))}
              </ToggleGroup>
            </div>

              <div className="flex items-start gap-2">
                <Info />
                <p className="text-xs">
                  Tasks will be added to the particular date, if that date exists in the month.
                </p>
              </div>
            </>
          )}

          {/* Custom Selection */}
          {formData.frequencyType === "custom" && (
            <Calendar
              mode="multiple"
              selected={formData.frequency as Date[]}
              onSelect={(frequency) => handleChange("frequency", frequency)}
            />
          )}

          <div className="flex justify-between items-center">
            <Label>Starts at:</Label>
            <DatePicker
              date={formData.from}
              onDateChange={(date) => handleChange("from", date || new Date())}
            />
          </div>

          <div className="flex justify-between items-center">
            <Label className="w-fit">
              Ends at: <span className="text-xs text-gray-400">(optional)</span>
            </Label>
            <DatePicker
              date={formData.end}
              onDateChange={(date) => handleChange("end", date || null)}
            />
          </div>


          {/* Task Type */}
          <div>
            <Label>Task Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {["AT", "NT"].map((type) => (
                <Button
                  key={type}
                  variant="outline"
                  onClick={() => handleChange("taskType", type)}
                  className={`${
                    formData.taskType === type
                      ? "bg-blue-500 text-white"
                      : ""
                  }`}
                >
                  {type === "AT" ? "Accountable" : "Normal"}
                </Button>
              ))}
            </div>
          </div>

          {formData.taskType === "AT" && 
          (<div>
            <AddAccountabilityPartner/>
          </div>)  
          }


        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Add Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewTask;
