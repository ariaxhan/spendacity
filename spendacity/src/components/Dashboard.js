"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import DashboardHeader from "./DashboardHeader";
import DashboardCard from "./DashboardCard";
import SpendingByCategory from "./SpendingByCategory";
import TimeBasedInsights from "./TimeBasedInsights";
import ExpenseList from "./ExpenseList";
import AddExpenseForm from "./AddExpenseForm";
import AnimatedBackground from "./AnimatedBackground";

export default function Dashboard() {
  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    isLoading: authLoading,
    user,
  } = useAuth0();

  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
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

  const fetchExpenses = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/expenses", {
        headers: {
          "user-id": user.sub,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }

      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

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

  const handleDeleteExpense = async (id) => {
    if (!user) return;
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
        headers: {
          "user-id": user.sub,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }

      setExpenses(expenses.filter((expense) => expense._id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleAddExpense = async (newExpense) => {
    if (!user || isAddingExpense) return;

    setIsAddingExpense(true);
    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": user.sub,
        },
        body: JSON.stringify(newExpense),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      }

      const savedExpense = await response.json();
      setExpenses([...expenses, savedExpense]);
    } catch (error) {
      console.error("Error in handleAddExpense:", error.message);
      // Show error message to user
    } finally {
      setIsAddingExpense(false);
    }
  };

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
