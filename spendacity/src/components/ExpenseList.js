import { useState } from "react";

export default function ExpenseList({ expenses, onDeleteExpense }) {
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  const sortedExpenses = [...expenses].sort((a, b) => {
    if (!sortField) return 0;
    const valueA = a[sortField];
    const valueB = b[sortField];
    if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
    if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 transform transition-transform hover:scale-105 mb-8 border border-solid border-gray-300 overflow-x-auto">
      <h2 className="text-xl sm:text-2xl font-semibold text-pink-700 mb-4">
        Recent Expenses
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("title")}
              >
                Title
              </th>
              <th
                scope="col"
                className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("category")}
              >
                Category
              </th>
              <th
                scope="col"
                className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("amount")}
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("date")}
              >
                Date
              </th>
              <th
                scope="col"
                className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("satisfaction")}
              >
                Satisfaction
              </th>
              <th
                scope="col"
                className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("paymentType")}
              >
                Payment
              </th>
              <th
                scope="col"
                className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedExpenses.map((expense) => (
              <tr key={expense._id} className="hover:bg-gray-50">
                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-900">
                  {expense.title}
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500">
                  {expense.category}
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-900">
                  ${expense.amount.toFixed(2)}
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(expense.date).toLocaleDateString()}
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <span className="mr-2">{expense.satisfaction}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-pink-600 h-2.5 rounded-full"
                        style={{
                          width: `${(expense.satisfaction / 10) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="ml-2">/ 10</span>
                  </div>
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500">
                  {expense.paymentType}
                </td>
                <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onDeleteExpense(expense._id)}
                    className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 py-1 px-2 rounded transition duration-300 ease-in-out"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
