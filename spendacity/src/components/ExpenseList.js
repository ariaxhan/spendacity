export default function ExpenseList({ expenses, onDeleteExpense }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 transform transition-transform hover:scale-105  mb-8 border border-solid border-gray-300">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Recent Expenses
      </h2>
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-600">
            <th className="pb-3">Title</th>
            <th className="pb-3">Category</th>
            <th className="pb-3">Amount</th>
            <th className="pb-3">Date</th>
            <th className="pb-3">Satisfaction</th>
            <th className="pb-3">Payment Type</th>
            <th className="pb-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr
              key={expense.id}
              className="border-t border-gray-200 hover:bg-gray-50"
            >
              <td className="py-3">{expense.title}</td>
              <td className="py-3">{expense.category}</td>
              <td className="py-3">${expense.amount.toFixed(2)}</td>
              <td className="py-3">{expense.date}</td>
              <td className="py-3">{expense.satisfaction} / 5</td>
              <td className="py-3">{expense.paymentType}</td>
              <td className="py-3">
                <button
                  onClick={() => onDeleteExpense(expense.id)}
                  className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transform transition-transform hover:scale-105"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
