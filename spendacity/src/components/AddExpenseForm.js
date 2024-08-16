import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function AddExpenseForm({
  categories,
  paymentTypes,
  onAddExpense,
  onAddPaymentType,
  onAddCategory,
  isAddingExpense,
}) {
  const { getAccessTokenSilently, user } = useAuth0();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [satisfaction, setSatisfaction] = useState(3);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentType, setPaymentType] = useState("");
  const [customPaymentType, setCustomPaymentType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAddingExpense) return;

    if (customPaymentType) {
      onAddPaymentType(customPaymentType);
      setPaymentType(customPaymentType);
    }

    const finalCategory = category || newCategory;
    if (newCategory && !categories.includes(newCategory)) {
      onAddCategory(newCategory);
    }

    const newExpense = {
      userId: user.sub,
      title,
      category: finalCategory,
      amount: parseFloat(amount),
      date,
      satisfaction,
      paymentType: customPaymentType || paymentType,
    };

    try {
      const token = await getAccessTokenSilently();
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newExpense),
      });

      if (!response.ok) {
        throw new Error(`Failed to save expense: ${response.statusText}`);
      }

      const savedExpense = await response.json();
      onAddExpense(savedExpense);

      // Reset form fields
      setTitle("");
      setCategory("");
      setNewCategory("");
      setAmount("");
      setSatisfaction(3);
      setDate(new Date().toISOString().split("T")[0]);
      setPaymentType("");
      setCustomPaymentType("");

      // Reload the page to display the new expense
      window.location.reload();
    } catch (error) {
      console.error("Error adding expense:", error.message);
      // Optionally, display an error message to the user
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6 transform transition-transform hover:scale-105"
    >
      <h2 className="text-2xl font-semibold text-olive-800 mb-4">
        Add New Expense
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="p-2 border border-olive-300 rounded"
          required
          disabled={isAddingExpense}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border border-olive-300 rounded"
          disabled={isAddingExpense}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Or enter a new category"
          className="p-2 border border-olive-300 rounded"
          disabled={isAddingExpense}
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="p-2 border border-olive-300 rounded"
          required
          disabled={isAddingExpense}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 border border-olive-300 rounded"
          required
          disabled={isAddingExpense}
        />
        <select
          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value)}
          className="p-2 border border-olive-300 rounded"
          required
          disabled={isAddingExpense}
        >
          <option value="">Select Payment Type</option>
          {paymentTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={customPaymentType}
          onChange={(e) => setCustomPaymentType(e.target.value)}
          placeholder="Or enter a new payment type"
          className="p-2 border border-olive-300 rounded"
          disabled={isAddingExpense}
        />
        <div className="flex items-center">
          <label className="mr-2">Satisfaction:</label>
          <input
            type="range"
            min="0"
            max="10"
            value={satisfaction}
            onChange={(e) => setSatisfaction(parseInt(e.target.value))}
            className="w-full"
            disabled={isAddingExpense}
          />
          <span className="ml-2">{satisfaction}</span>
        </div>
        <button
          type="submit"
          className={`text-white py-2 px-4 rounded hover:bg-olive-700 bg-pink-500 hover:bg-pink-600 transform transition-transform hover:scale-105 ${
            isAddingExpense ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isAddingExpense}
        >
          {isAddingExpense ? "Adding..." : "Add Expense"}
        </button>
      </div>
    </form>
  );
}
