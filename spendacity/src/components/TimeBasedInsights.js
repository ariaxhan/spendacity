import React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
} from "date-fns";

export default function TimeBasedInsights({ expenses }) {
  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);

  const daysInMonth = eachDayOfInterval({ start, end });

  const spendingByDay = daysInMonth.map((day) => {
    const total = expenses
      .filter(
        (e) =>
          format(new Date(e.date), "yyyy-MM-dd") === format(day, "yyyy-MM-dd"),
      )
      .reduce((sum, e) => sum + e.amount, 0);

    let backgroundColor = `hsl(${Math.max(0, 120 - (120 * total) / 50)}, 100%, 50%)`; // Green to Red gradient

    if (total === 0) backgroundColor = "#f7fafc"; // Tailwind's gray-100 equivalent

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
        Spending Calendar
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
