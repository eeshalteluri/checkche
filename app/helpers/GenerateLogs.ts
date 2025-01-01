import { getISOWeek, startOfISOWeek, endOfISOWeek } from "date-fns";
import getWeekDay from "./GetWeekDay"

export function generateDailyLogs(startDate: Date, endDate: Date) {
    const logs = [];
    const currentDate = new Date(startDate); // Clone startDate to avoid mutating it
    const today = new Date(); // Get today's date
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate date-only comparison

    console.log("Start Date:", startDate.toISOString());
    console.log("End Date:", endDate.toISOString());
    console.log("Today's Date:", today.toISOString());

    // Loop until currentDate is less than or equal to endDate
    while (currentDate.toISOString().split("T")[0] <= endDate.toISOString().split("T")[0]) {
        console.log("Processing date:", currentDate);

        const status = currentDate < today ? "missed" : "pending"; // Determine status
        logs.push({ date: currentDate.toISOString(), status });

        console.log(`Logged date: ${currentDate.toISOString()} with status: ${status}`);

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
        console.log("Increased current date:", currentDate);
    }

    console.log("Generated Daily Logs:", logs);
    return logs;
}


export function generateWeeklyLogs(startDate: Date, endDate: Date, frequency: string[]) {
    const logs: { date: string; status: string }[] = [];
    let currentDate = new Date(startDate); // Clone startDate to avoid mutating it
    const today = new Date(); // Get today's date
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison

    console.log("Frequency:", frequency);
    console.log("Start Date:", startDate.toISOString());
    console.log("End Date:", endDate.toISOString());
    console.log("Today's Date:", today.toISOString());

    // Iterate through weeks
    while (currentDate <= endDate) {
        console.log("Processing week starting from:", currentDate.toISOString());

        // Iterate through each day of the week
        for (let i = 0; i < 7; i++) {
            const weekDay = getWeekDay(currentDate).toLowerCase(); // Get weekday (e.g., "wednesday")

            console.log("Current Date:", currentDate.toISOString(), "| Weekday:", weekDay);

            // Check if the day is within the frequency
            if (frequency.includes(weekDay) && currentDate >= startDate && currentDate <= endDate) {
                const status = currentDate < today ? "missed" : "pending"; // Set status based on today's date
                logs.push({
                    date: currentDate.toISOString(),
                    status,
                });
                console.log(`Logged date: ${currentDate.toISOString()} with status: ${status}`);
            }

            // Move to the next day
            currentDate.setDate(currentDate.getDate() + 1);
        }

        console.log("End of current week.");
    }

    console.log("Weekly logs for the specified range:", logs);
    return logs;
}

export function generateMonthlyLogs(
    startMonth: Date,
    endMonth: Date,
    frequency: string[]
  ) {
    const logs: { date: string; status: string }[] = [];
  
    // Validation: Ensure both month and year are selected for `endMonth`
    if (!endMonth.getFullYear() || isNaN(endMonth.getFullYear())) {
      throw new Error("Invalid endMonth: Year must be selected along with the month.");
    }
  
    if (endMonth.getMonth() === undefined || isNaN(endMonth.getMonth())) {
      throw new Error("Invalid endMonth: Month must be selected along with the year.");
    }
  
    // Extract month and year from the start and end dates
    let currentMonth = startMonth.getMonth();
    let currentYear = startMonth.getFullYear();
  
    const endMonthIndex = endMonth.getMonth();
    const endYear = endMonth.getFullYear();
  
    // Iterate over the months in the range
    while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonthIndex)) {
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  
      // Iterate over the days of the current month
      for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        const currentDate = new Date(currentYear, currentMonth, day);
        const dayOfMonth = day.toString(); // Get day of the month as string
  
        // Check if the day is in the frequency array
        if (frequency.includes(dayOfMonth)) {
          const status = currentDate < new Date() ? "missed" : "pending"; // Set status based on today's date
          logs.push({
            date: currentDate.toISOString(),
            status,
          });
        }
      }
  
      // Move to the next month
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
    }
  
    return logs;
  }
  

  
  

  
  
  
   
  