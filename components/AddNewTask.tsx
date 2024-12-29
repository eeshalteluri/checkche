"use client"

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"; // Import Zod for validation
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


// Zod schema definition
const schema = z.object({
  taskName: z.string().min(1, "Task name is required"),
  description: z.string().min(1, "Description is required"),
  frequencyType: z.enum(["daily", "weekly", "monthly", "custom"], {
    errorMap: () => ({ message: "Please select a frequency" }),
  }),
  taskType: z.enum(["AT", "NT"]),
  from: z.union([z.string(), z.date()]),  // Allows either string or Date for 'from'
  end: z.date().nullable().optional(),   // End date is optional and can be null
  accountabilityPartner: z
    .object({
      name: z.string(),
      username: z.string(),
    })
    .optional(),
  frequency: z.array(z.union([z.string(), z.date()])).optional(), // Frequency can be an array of strings or Dates
})
  .refine(
    (data) => data.taskType === "NT" || (data.taskType === "AT" && data.accountabilityPartner?.username),
    {
      message: "Accountability partner is required for 'Accountable' tasks",
      path: ["accountabilityPartner"],
    }
  )
  .refine(
    (data) =>
      data.frequencyType === "daily" || (data.frequency && data.frequency.length > 0),
    {
      message: "Frequency cannot be empty for the selected frequency type",
      path: ["frequency"],
    }
  )

const AddNewTask = () => {
  const { control, handleSubmit, clearErrors, setValue, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      taskName: "",
      description: "",
      frequencyType: "daily",
      frequency: [] as Date[] | String[], // This should be typed as Date[]
      taskType: "AT",
      accountabilityPartner: {name: "", username:""},
      from: "" as Date | string,
      end: null as Date | null
    }
  })

  const onSubmit = (data: any) => {
    console.log(data); // Data can be sent to your database API
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
        <DialogHeader/>
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
            {["monday", "tuesday", "wednesday", "thrusday", "friday", "saturday", "sunday"].map((day) => (
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
              <DatePicker
                date={watch("from") as Date}
                onDateChange={(date) => setValue("from", date as Date)}
              />
            </div>

            <div className="flex justify-between items-center">
              <Label>Ends at: <span className="text-xs text-gray-400">(optional)</span></Label>
              <DatePicker
                date={watch("end")}
                onDateChange={(date) => setValue("end", date)}
              />
            </div>
          </>
         }

         {watch("frequencyType") === "monthly" && 
         <>
          <Combobox onSelect={(selectedMonth: string) => {
            setValue("from", selectedMonth)
          }}/>
         </>}

          {/* Task Type */}
          <div>
            <Label>Task Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {["AT", "NT"].map((type) => (
                <Button
                  key={type}
                  variant="outline"
                  onClick={() => setValue("taskType", type)}
                  className={watch("taskType") === type ? "bg-blue-500 text-white" : ""}
                >
                  {type === "AT" ? "Accountable" : "Normal"}
                </Button>
              ))}
            </div>
          </div>

          {/* Accountability Partner */}
          {watch("taskType") === "AT" && (
            <div>
              <AddAccountabilityPartner
                selectedPartner={watch("accountabilityPartner")}
                onPartnerSelect={(partner: {name: string, username: string}) => setValue("accountabilityPartner", partner)}
                error={errors.accountabilityPartner}
              />
            </div>
          )}
        </div>

        <DialogFooter className="mt-1">
          <Button type="submit">Add Task</Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewTask;
