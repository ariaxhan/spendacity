import React, { useState } from "react";

export default function SpendingByCategory({
  expenses,
  categories,
  initialBudgets,
}) {
  const [budgets, setBudgets] = useState(initialBudgets);

  const handleBudgetChange = (category, value) => {
    setBudgets((prevBudgets) => ({
      ...prevBudgets,
      [category]: parseFloat(value) || 0,
    }));
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
    <div className="bg-white rounded-lg shadow-lg p-6 transform transition-transform hover:scale-105  mb-8 border border-solid border-gray-300">
      <h2 className="text-2xl font-semibold text-pink-700 mb-4">Set Budgets</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {categories.map((category) => (
          <div
            key={category}
            className="flex flex-col bg-white p-4 rounded-lg shadow-sm"
          >
            <label className="text-gray-700 font-medium mb-2">{category}</label>
            <input
              type="number"
              value={budgets[category]}
              onChange={(e) => handleBudgetChange(category, e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
              placeholder={`Set budget for ${category}`}
            />
          </div>
        ))}
      </div>

      {allBudgetsSet && (
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-pink-700 mb-4">
            Spending by Category
          </h2>
          {categoryTotals.map(({ category, total, budget }) => (
            <div key={category} className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-pink-700">{category}</span>
                <span className="font-semibold text-pink-600">
                  ${total.toFixed(2)} / ${budget.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-pink-200 rounded-full h-2.5">
                <div
                  className="bg-pink-500 h-2.5 rounded-full"
                  style={{
                    width: `${(total / budget) * 100}%`,
                  }}
                ></div>
              </div>
              {total > budget && (
                <div className="text-red-600 mt-1 text-sm">
                  Over budget by ${Math.abs(total - budget).toFixed(2)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
