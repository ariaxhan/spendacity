"use client";

import React, { useState } from "react";
import { Roboto } from "next/font/google";
import DashboardHeader from "./DashboardHeader";
import DashboardCard from "./DashboardCard";
import SpendingByCategory from "./SpendingByCategory";
import TimeBasedInsights from "./TimeBasedInsights";
import ExpenseList from "./ExpenseList";
import AddExpenseForm from "./AddExpenseForm";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export default function Dashboard() {
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      title: "Spa Day",
      category: "Self-Care",
      amount: 50,
      date: "2024-03-15",
      satisfaction: 4,
      paymentType: "Credit Card - Chase Sapphire",
    },
    {
      id: 2,
      title: "Concert",
      category: "Experiences",
      amount: 120,
      date: "2024-03-16",
      satisfaction: 5,
      paymentType: "Venmo",
    },
    {
      id: 3,
      title: "Groceries",
      category: "Necessities",
      amount: 80,
      date: "2024-03-17",
      satisfaction: 3,
      paymentType: "Cash",
    },
  ]);

  const categories = [
    "Self-Care",
    "Experiences",
    "Necessities",
    "Dining",
    "Travel",
  ];

  const paymentTypes = [
    "Credit Card - Chase Sapphire",
    "Credit Card - Amex",
    "Cash",
    "Venmo",
    "Zelle",
  ];

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageSatisfaction =
    expenses.reduce((sum, expense) => sum + expense.satisfaction, 0) /
    expenses.length;

  return (
    <div className={`min-h-screen bg-olive-50 ${roboto.className}`}>
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Total Spent"
            value={`$${totalSpent.toFixed(2)}`}
          />
          <DashboardCard title="Top Category" value={categories[0]} />
          <DashboardCard
            title="Avg Satisfaction"
            value={`${averageSatisfaction.toFixed(1)} / 5`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SpendingByCategory expenses={expenses} categories={categories} />
          <TimeBasedInsights expenses={expenses} />
        </div>

        <ExpenseList expenses={expenses} />

        <AddExpenseForm
          categories={categories}
          paymentTypes={paymentTypes}
          onAddExpense={(newExpense) => setExpenses([...expenses, newExpense])}
        />
      </div>
    </div>
  );
}
