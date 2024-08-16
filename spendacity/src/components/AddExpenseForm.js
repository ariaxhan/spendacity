import { useState } from "react";

export default function AddExpenseForm({
  categories,
  paymentTypes,
  onAddExpense,
  onAddPaymentType, // New prop to handle adding a payment type
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [satisfaction, setSatisfaction] = useState(3);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentType, setPaymentType] = useState("");
  const [customPaymentType, setCustomPaymentType] = useState(""); // New state for custom payment type

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add custom payment type if provided
    if (customPaymentType) {
      onAddPaymentType(customPaymentType);
      setPaymentType(customPaymentType);
    }

    onAddExpense({
      id: Date.now(),
      title,
      category,
      amount: parseFloat(amount),
      date,
      satisfaction,
      paymentType: customPaymentType || paymentType,
    });

    // Reset form fields
    setTitle("");
    setCategory("");
    setAmount("");
    setSatisfaction(3);
    setDate(new Date().toISOString().split("T")[0]);
    setPaymentType("");
    setCustomPaymentType("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6 transform transition-transform hover:scale-105 "
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
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border border-olive-300 rounded"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="p-2 border border-olive-300 rounded"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 border border-olive-300 rounded"
          required
        />
        <select
          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value)}
          className="p-2 border border-olive-300 rounded"
          required
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
          />
          <span className="ml-2">{satisfaction}</span>
        </div>
        <button
          type="submit"
          className="bg-olive-600 text-white py-2 px-4 rounded hover:bg-olive-700"
        >
          Add Expense
        </button>
      </div>
    </form>
  );
}
