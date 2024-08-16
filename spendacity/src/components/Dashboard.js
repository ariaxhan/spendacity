"use client";

import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import DashboardHeader from "./DashboardHeader";
import DashboardCard from "./DashboardCard";
import SpendingByCategory from "./SpendingByCategory";
import TimeBasedInsights from "./TimeBasedInsights";
import ExpenseList from "./ExpenseList";
import AddExpenseForm from "./AddExpenseForm";
import AnimatedBackground from "./AnimatedBackground";
import { useExpenses } from "./useExpenses";

export default function Dashboard() {
  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    isLoading: authLoading,
    user,
  } = useAuth0();

  const {
    expenses,
    isLoading,
    isAddingExpense,
    fetchExpenses,
    handleAddExpense,
    handleDeleteExpense,
  } = useExpenses(user);

  const [categories, setCategories] = useState([
    "Self-Care",
    "Experiences",
    "Necessities",
    "Dining",
    "Transportation",
    "Shopping",
    "Drinks",
  ]);

  const paymentTypes = ["Card", "Cash", "Venmo", "Zelle"];
  const [budgets, setBudgets] = useState({
    "Self-Care": 100,
    Experiences: 200,
    Necessities: 300,
    Dining: 150,
    Transportation: 100,
    Shopping: 150,
    Drinks: 50,
  });

  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated && user) {
        fetchExpenses();
      } else {
        loginWithRedirect();
      }
    }
  }, [isAuthenticated, authLoading, user, fetchExpenses, loginWithRedirect]);

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageSatisfaction =
    expenses.length > 0
      ? expenses.reduce((sum, expense) => sum + expense.satisfaction, 0) /
        expenses.length
      : 0;

  const handleAddCategory = (newCategory) => {
    if (!categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setBudgets({ ...budgets, [newCategory]: 0 });
    }
  };

  const handleUpdateBudgets = (newBudgets) => {
    setBudgets(newBudgets);
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 relative font-sans">
      <AnimatedBackground />

      <div className="container mx-auto px-4 py-8">
        <DashboardHeader />

        {isAuthenticated && user && (
          <div className="flex justify-between items-center mb-8">
            <div className="text-gray-600">
              <p>User ID: {user.sub}</p>
            </div>
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
              className="px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700"
            >
              Log Out
            </button>
          </div>
        )}

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
            onAddCategory={handleAddCategory}
            isAddingExpense={isAddingExpense}
          />
        </div>

        <ExpenseList
          expenses={expenses}
          onDeleteExpense={handleDeleteExpense}
        />

        <div className="grid grid-cols-1 gap-6 mb-8">
          <SpendingByCategory
            expenses={expenses}
            initialCategories={categories}
            initialBudgets={budgets}
            onUpdateBudgets={handleUpdateBudgets}
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
