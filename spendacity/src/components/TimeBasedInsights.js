import React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  parseISO,
} from "date-fns";

export default function TimeBasedInsights({ expenses }) {
  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);
  const monthName = format(today, "MMMM yyyy");
  const todayFormatted = format(today, "yyyy-MM-dd");
  const daysInMonth = eachDayOfInterval({ start, end });

  const spendingByDay = daysInMonth.map((day) => {
    const dayFormatted = format(day, "yyyy-MM-dd");
    const total = expenses
      .filter((e) => {
        try {
          // Try to parse the date, return false if invalid
          const expenseDate =
            e.date instanceof Date ? e.date : parseISO(e.date);
          return format(expenseDate, "yyyy-MM-dd") === dayFormatted;
        } catch (error) {
          console.error(`Invalid date for expense:`, e);
          return false;
        }
      })
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    let backgroundColor = `hsl(${Math.max(0, 120 - (120 * total) / 50)}, 100%, 50%)`;
    if (total === 0) backgroundColor = "#f7fafc";

    return {
      day,
      total,
      backgroundColor,
    };
  });

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-white rounded-lg shadow-md transform transition-transform hover:scale-105 p-6 border">
      <h2 className="text-2xl font-semibold text-purple-700 mb-4">
        Spending Calendar - {monthName}
      </h2>
      <div className="grid grid-cols-7 gap-2">
        {dayLabels.map((label) => (
          <div key={label} className="text-center font-medium text-gray-700">
            {label}
          </div>
        ))}
        {daysInMonth.map((day, index) => (
          <div
            key={index}
            className={`flex items-center justify-center h-16 w-full rounded-lg`}
            style={{
              backgroundColor: spendingByDay[index].backgroundColor,
            }}
          >
            <span className="text-gray-900">{format(day, "d")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
