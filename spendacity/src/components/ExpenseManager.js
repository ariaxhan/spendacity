import React, { useState } from "react";
import AddExpenseForm from "./AddExpenseForm";
import SpendingByCategory from "./SpendingByCategory";

export default function ExpenseManager() {
  const [categories, setCategories] = useState([
    "Self-Care",
    "Experiences",
    "Necessities",
    "Dining",
    "Transportation",
    "Shopping",
    "Drinks",
  ]);

  const [expenses, setExpenses] = useState([]); // You'll need to load this from your API

  const initialBudgets = {
    "Self-Care": 100,
    Experiences: 200,
    Necessities: 300,
    Dining: 150,
    Transportation: 100,
    Shopping: 150,
    Drinks: 50,
  };

  const addCategory = (newCategory) => {
    if (!categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
    }
  };

  return (
    <div>
      <AddExpenseForm
        categories={categories}
        onAddExpense={(newExpense) => setExpenses([...expenses, newExpense])}
        onAddCategory={addCategory}
      />
      <SpendingByCategory
        expenses={expenses}
        initialCategories={categories}
        initialBudgets={initialBudgets}
      />
    </div>
  );
}
