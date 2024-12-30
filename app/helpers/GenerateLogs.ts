import { getISOWeek } from "date-fns"

export function generateDailyLogs(startDate: Date, endDate: Date) {
    const logs = []
    const currentDate = new Date(startDate)

    while (currentDate <= endDate){
        logs.push({date: currentDate.toISOString(), status: "pending"})
        currentDate.setDate(currentDate.getDate() + 1)
    }

    return logs
}

export function generateWeeklyLogs(startDate: Date, endDate: Date) {
    const logs = []
    const currentDate = new Date(startDate)
    const weekNumber = getISOWeek(currentDate)

    console.log("Week number:", weekNumber)

}