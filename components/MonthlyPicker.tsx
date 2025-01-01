"use client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { Merge, FieldErrorsImpl } from "react-hook-form";
import { FieldError } from "react-hook-form";

interface MonthlyPickerProps {
  startYear: number;
  endYear: number;
  selected: Date; // Ensure selected is always a Date object
  onSelect: (date: Date) => void;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<{ date: Date }>>;
}

const MonthlyPicker: React.FC<MonthlyPickerProps> = ({
  startYear,
  endYear,
  selected,
  onSelect,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(selected); // Track the current date
  const [month]

  // Update currentDate when selected changes
  useEffect(() => {
    setCurrentDate(selected);
  }, [selected]);

  // Handle month change
  const handleMonthChange = (month: string) => {
    const year = currentDate?.getFullYear();
    if (!year) {
      setError("Please select a year before selecting a month.");
      return;
    }

    const newDate = new Date(year, months.indexOf(month));
    setCurrentDate(newDate);
    setError(null); // Clear error
    onSelect(newDate);
  };

  // Handle year change
  const handleYearChange = (year: string) => {
    const month = currentDate?.getMonth();
    if (month === undefined || month === null) {
      setError("Please select a month before selecting a year.");
      return;
    }

    const newDate = new Date(parseInt(year), month);
    setCurrentDate(newDate);
    setError(null); // Clear error
    onSelect(newDate);
  };

  // List of month names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // List of years from startYear to endYear
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  return (
    <div className="grid grid-cols-2 gap-4 max-w-[360px] dark:text-white">
      {/* Month Selector */}
      <Select onValueChange={handleMonthChange}>
        <SelectTrigger
          className={`${
            !currentDate?.getFullYear() ? "border-red-500" : ""
          } h-auto shadow-sm focus:outline-0 focus:ring-0 focus:ring-offset-0`}
        >
          <SelectValue
            placeholder={
              <div className="flex flex-col items-start">
                <span className="font-normal dark:text-white">
                  {months[currentDate?.getMonth()] || "-"}
                </span>
              </div>
            }
          />
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className="h-48">
            {months.map((month, index) => (
              <SelectItem key={index} value={month}>
                {month}
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>

      {/* Year Selector */}
      <Select onValueChange={handleYearChange}>
        <SelectTrigger
          className={`${
            currentDate?.getMonth() === undefined || currentDate?.getMonth() === null
              ? "border-red-500"
              : ""
          } h-auto shadow-sm focus:outline-0 focus:ring-0 focus:ring-offset-0`}
        >
          <SelectValue
            placeholder={
              <div className="flex flex-col items-start">
                <span className="font-normal dark:text-white">
                  {currentDate?.getFullYear() || "-"}
                </span>
              </div>
            }
          />
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className="h-48">
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>

      {/* Error Message */}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default MonthlyPicker;
