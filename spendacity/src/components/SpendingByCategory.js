import React, { useState, useEffect } from "react";
import { FaTrash, FaPencilAlt } from "react-icons/fa";

export default function SpendingByCategory({
  expenses,
  initialCategories,
  initialBudgets,
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [budgets, setBudgets] = useState(initialBudgets);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const handleBudgetChange = (category, value) => {
    setBudgets((prevBudgets) => ({
      ...prevBudgets,
      [category]: parseFloat(value) || 0,
    }));
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setBudgets({ ...budgets, [newCategory]: 0 });
      setNewCategory("");
    }
  };

  const handleDeleteCategory = (category) => {
    setCategories(categories.filter((c) => c !== category));
    setBudgets((prevBudgets) => {
      const { [category]: _, ...rest } = prevBudgets;
      return rest;
    });
  };

  const handleEditCategory = (oldCategory, newCategory) => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories(
        categories.map((c) => (c === oldCategory ? newCategory : c)),
      );
      setBudgets((prevBudgets) => {
        const { [oldCategory]: budget, ...rest } = prevBudgets;
        return { ...rest, [newCategory]: budget };
      });
      setEditingCategory(null);
    }
  };

  const categoryTotals = categories.map((category) => ({
    category,
    total: expenses
      .filter((e) => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0),
    budget: budgets[category] || 0,
  }));

  const allBudgetsSet = categories.every((category) => budgets[category] > 0);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 transform transition-transform hover:scale-105 mb-8 border border-solid border-gray-300">
      <h2 className="text-xl sm:text-2xl font-semibold text-pink-700 mb-4">
        Budgets & Spending
      </h2>
      <div className="mb-4">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="p-2 border border-gray-300 rounded-md text-sm mr-2"
          placeholder="New category"
        />
        <button
          onClick={handleAddCategory}
          className="bg-pink-500 text-white px-4 py-2 rounded-md text-sm"
        >
          Add Category
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
        {categories.map((category) => (
          <div key={category} className="flex flex-col relative group">
            <label className="text-sm text-gray-600 mb-1">
              {editingCategory === category ? (
                <input
                  type="text"
                  value={category}
                  onChange={(e) => handleEditCategory(category, e.target.value)}
                  onBlur={() => setEditingCategory(null)}
                  className="p-1 border border-gray-300 rounded-md text-sm w-full"
                  autoFocus
                />
              ) : (
                category
              )}
            </label>
            <div className="flex">
              <input
                type="number"
                value={budgets[category]}
                onChange={(e) => handleBudgetChange(category, e.target.value)}
                className="p-1 sm:p-2 border border-gray-300 rounded-md text-sm flex-grow"
                placeholder="Set budget"
              />
            </div>
            <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setEditingCategory(category)}
                className="text-blue-500 mr-2"
              >
                <FaPencilAlt />
              </button>
              <button
                onClick={() => handleDeleteCategory(category)}
                className="text-red-500"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {allBudgetsSet && (
        <div className="space-y-3">
          {categoryTotals.map(({ category, total, budget }) => (
            <div key={category} className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {category}
                </span>
                <span className="text-sm font-semibold text-pink-600">
                  ${total.toFixed(2)} / ${budget.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-pink-200 rounded-full h-2">
                <div
                  className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((total / budget) * 100, 100)}%` }}
                ></div>
              </div>
              {total > budget && (
                <div className="text-red-600 mt-1 text-xs">
                  Over by ${(total - budget).toFixed(2)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
