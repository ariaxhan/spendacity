// src/components/useExpenses.js
import { useState, useCallback } from "react";

export function useExpenses(user) {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingExpense, setIsAddingExpense] = useState(false);

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
      setExpenses((prevExpenses) => [...prevExpenses, savedExpense]);
      fetchExpenses();
    } catch (error) {
      console.error("Error in handleAddExpense:", error.message);
    } finally {
      setIsAddingExpense(false);
    }
  };

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

      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense._id !== id),
      );
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  return {
    expenses,
    isLoading,
    isAddingExpense,
    fetchExpenses,
    handleAddExpense,
    handleDeleteExpense,
  };
}
