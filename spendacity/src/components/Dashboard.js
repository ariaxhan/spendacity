"use client";

import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardCard from "./DashboardCard";
import SpendingByCategory from "./SpendingByCategory";
import TimeBasedInsights from "./TimeBasedInsights";
import ExpenseList from "./ExpenseList";
import AddExpenseForm from "./AddExpenseForm";
import AnimatedBackground from "./AnimatedBackground";

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
    "Transportation",
    "Shopping",
    "Drinks",
  ];

  const paymentTypes = ["Card", "Cash", "Venmo", "Zelle"];

  const initialBudgets = {
    "Self-Care": 100,
    Experiences: 200,
    Necessities: 300,
    Dining: 150,
    Transportation: 100,
    Shopping: 150,
    Drinks: 50,
  };

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageSatisfaction =
    expenses.reduce((sum, expense) => sum + expense.satisfaction, 0) /
    expenses.length;

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const handleAddExpense = (newExpense) => {
    setExpenses([...expenses, newExpense]);
  };

  return (
    <div className="min-h-screen bg-gray-100 relative font-sans">
      <AnimatedBackground />

      <div className="container mx-auto px-4 py-8">
        <DashboardHeader />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TimeBasedInsights expenses={expenses} />
          <div className="grid grid-cols-1 gap-6">
            <DashboardCard
              title="Total Spent"
              value={`$${totalSpent.toFixed(2)}`}
              bgColor="bg-white"
              textColor="text-gray-800"
            />
            <DashboardCard
              title="Top Category"
              value={categories[0]}
              bgColor="bg-white"
              textColor="text-gray-800"
            />
            <DashboardCard
              title="Avg Satisfaction"
              value={`${averageSatisfaction.toFixed(1)} / 10`}
              bgColor="bg-white"
              textColor="text-gray-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          <AddExpenseForm
            categories={categories}
            paymentTypes={paymentTypes}
            onAddExpense={handleAddExpense}
          />
        </div>

        <ExpenseList
          expenses={expenses}
          onDeleteExpense={handleDeleteExpense}
        />

        <div className="grid grid-cols-1 gap-6 mb-8">
          <SpendingByCategory
            expenses={expenses}
            categories={categories}
            initialBudgets={initialBudgets}
          />
        </div>
      </div>

      {/* 3D Background Animation */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-white opacity-20 rounded-full blur-3xl animate-pulse delay-75"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-white opacity-20 rounded-full blur-3xl animate-pulse delay-150"></div>
      </div>
    </div>
  );
}
