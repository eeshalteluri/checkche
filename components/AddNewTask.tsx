"use client"

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AddAccountabilityPartner from "./AddAccountabilityPartner";
import { DatePicker } from "./DatePicker";
import { Calendar } from "./ui/calendar";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Info } from "lucide-react";
import { Combobox } from "./Combobox"
import taskSchema from "@/zod/TaskSchema";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { startOfDay } from "date-fns";
import MonthlyPicker from "./MonthlyPicker";

const date = new Date()
const monthName = date.getMonth().toString()
console.log(typeof(monthName))

const AddNewTask = () => {
  const { data: session, status } = useSession();
  const [userId, setUserId] = useState<string | undefined>();

  useEffect(() => {
    if (session?.user?.id) {
      setUserId(session.user.id);
    }
  }, [session])

  const { control, handleSubmit, clearErrors, setValue, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      taskName: "",
      description: "",
      frequencyType: "daily",
      frequency: [] as Date[] | String[], // This should be typed as Date[]
      taskType: "AT",
      accountabilityPartner: {name: "", username:""},
      from: new Date() as Date,
      end: null as Date | null,
    }
  })
  
  useEffect(() => {
    const frequencyType = watch("frequencyType");
  
    if (frequencyType === "monthly") {
      const firstOfMonth = new Date();
      firstOfMonth.setDate(1); // Set the date to the first day of the month
      setValue("from", startOfDay(firstOfMonth)); // Normalize to the start of the day
    } else if (frequencyType === "daily" || frequencyType === "weekly") {
      setValue("from", startOfDay(new Date())); // Set to today's date
    }
  }, [watch("frequencyType"), setValue])  

  const onSubmit = async (data: any) => {
    console.log("on submit data: ",data)

    const bodyData = { ...data, userId }


    const response = await fetch("/api/tasks/new-task",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    })

    const responseData = await response.json()

    console.log("Response of adding new task: ", responseData)
    reset()
    clearErrors()
  };

  console.log(errors)

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="bg-white text-black text-xl hover:bg-slate-300">
          +
        </Button>
      </DialogTrigger>

      <DialogContent className="h-[400px] overflow-y-scroll">
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          {/* Task Name */}
          <div>
            <Label htmlFor="name">Task Name</Label>
            <Controller
              name="taskName"
              control={control}
              render={({ field }) => (
                <Input
                  id="name"
                  {...field}
                  className={errors.taskName ? "border-red-500" : ""}
                />
              )}
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="description"
                  {...field}
                  className={errors.description ? "border-red-500" : ""}
                />
              )}
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
                  onClick={() => {
                    setValue("frequencyType", freq)
                    setValue("frequency", [])
                  }}
                  className={watch("frequencyType") === freq ? "bg-blue-500 text-white hover:bg-blue-500 hover:text-white" : ""}
                >
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </Button>
              ))}
            </div>

            
          </div>

          {/* Conditional Inputs */}
          {watch("frequencyType") === "weekly" && (
            <div >
            <ToggleGroup
              type="multiple"
              value={watch("frequency") as string[]}
              className="w-full grid grid-cols-7 gap-2"
              onValueChange={(selectedDays) =>
              setValue("frequency", selectedDays)
              }
            >
            {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
              <ToggleGroupItem
                key={day}
                value={day}
                variant={"outline"}
                className={`outline-none data-[state=on]:bg-blue-500 data-[state=on]:text-white ${errors.frequency ? (watch("frequency")?.length ? "" : "border-red-500") : ""}`}
              >
                {day.charAt(0).toUpperCase()}
              </ToggleGroupItem>
            ))}
            </ToggleGroup>
          </div>
          )}

          {watch("frequencyType") === "monthly" && (
            <>
            <div >
            <ToggleGroup
              type="multiple"
              value={watch("frequency") as string[]}
              className="w-full grid grid-cols-7 gap-2"
              onValueChange={(selectedDates) =>
              setValue("frequency", selectedDates)
              }
            >
              {Array.from({ length: 31 }, (_, i) => (
                <ToggleGroupItem
                key={i+1}
                value={(i+1).toString()}
                variant={"outline"}
                className={`outline-none data-[state=on]:bg-blue-500 data-[state=on]:text-white ${errors.frequency ? (watch("frequency")?.length ? "" : "border-red-500") : ""}`}
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

          {watch("frequencyType") === "custom" && (
            <>
              <Calendar
              mode="multiple"
              selected={watch("frequency") as Date[]}
              onSelect={(date)=> setValue("frequency", date!)}
              />
              {errors.frequency && !watch("frequency")?.length ? <p className="text-xs text-red-500">{errors?.frequency.message}</p>: <></>}
          </>
          )}


          {/* Start and End Dates */}
          {(watch("frequencyType") === "daily" || watch("frequencyType") === "weekly") && 
          <>
            <div className="flex justify-between items-center">
              <Label>Starts at:</Label>
              <DatePicker date={watch("from") as Date} onDateChange={(date) => { setValue("from", date!)}}
              />
            </div>

            <div className={`flex justify-between items-center `}>
  <Label>
    Ends at: <span className="text-xs text-gray-400">(optional)</span>
  </Label>
  <DatePicker
    date={watch("end") as Date}
    onDateChange={(date) => {
      console.log("Callback triggered with date:", date);
      if (date) {
        // Ensure the date is set in UTC and avoid time zone shifts
        const utcDate = new Date(
          Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        );

        console.log("UTC date:", utcDate);

        // Set the value using the UTC date
        setValue("end", utcDate);
      }
    }}
    className={errors.end ? "border-red-500" : ""}
  />
</div>

          </>
         }

         {watch("frequencyType") === "monthly" && 
         <>
          <div className={`flex justify-between items-center `}>
            <Label className="w-1/2">Starts at: </Label>
            <div className="w-full">
              
              <MonthlyPicker startYear={2024} endYear={2030} selected={watch("from")} onSelect={(date) => { setValue("from", date)}} />
            </div>
              
          </div>

          <div className={`flex justify-between items-center `}>
            <Label className="w-1/2">Ends at: <span className="text-xs text-gray-400">(optional)</span></Label>
            <div className="w-full">
              
              <MonthlyPicker startYear={2024} endYear={2030} selected={watch("end") as Date} onSelect={(date) => { setValue("end", date)}}/>
            </div>
          </div>
         </>}

          {/* Task Type */}
          <div className="grid grid-cols-2 gap-2">
              {["AT", "NT"].map((type) => (
                <Button
                key={type}
                variant="outline"
                type="button"
                onClick={() => {
                  setValue("taskType", type)
                  setValue("accountabilityPartner", {name: "", username: ""})
                }}
                className={watch("taskType") === type ? "bg-blue-500 text-white hover:bg-blue-500 hover:text-white" : ""}
              >
                {type === "AT" ? "Accountable" : "Normal"}
              </Button>
              ))}
            </div>

          {/* Accountability Partner */}
          {watch("taskType") === "AT" && 
            <div>
              <AddAccountabilityPartner
                selectedPartner={watch("accountabilityPartner")}
                onPartnerSelect={(partner: {name: string, username: string}) => setValue("accountabilityPartner", partner)}
                error={errors.accountabilityPartner}
              />
            </div>
          }
        </div>

        <DialogFooter className="mt-6">
          <Button type="submit">Add Task</Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewTask;
