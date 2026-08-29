import React, { useState } from "react";

export default function ExpenseForm({ onAdd, adding }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("offline");
  const [paidTo, setPaidTo] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!description || !amount || !paidTo) return;
    onAdd({ description, amount: Number(amount), paymentMode, paidTo });
    setDescription("");
    setAmount("");
    setPaidTo("");
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-3">
      <h2 className="font-semibold text-lg text-slate-800">Add Expense</h2>

      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Expense description"
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
      />
      <div className="flex gap-2">
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          min="0"
          placeholder="Amount"
          className="w-1/2 border border-slate-200 rounded-lg px-3 py-2 text-sm"
        />
        <select
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
          className="w-1/2 border border-slate-200 rounded-lg px-3 py-2 text-sm"
        >
          <option value="offline">Offline</option>
          <option value="online">Online</option>
        </select>
      </div>
      <input
        value={paidTo}
        onChange={(e) => setPaidTo(e.target.value)}
        placeholder="Paid to (person)"
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
      />

      <button
        type="submit"
        disabled={adding}
        className="w-full py-2 rounded-lg bg-slate-800 text-white font-medium disabled:opacity-40 hover:bg-slate-900"
      >
        {adding ? "Adding..." : "Add Expense"}
      </button>
    </form>
  );
}
