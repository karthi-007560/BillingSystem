import React from "react";

export default function BillsList({ bills }) {
  if (bills.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <h2 className="font-semibold text-lg text-slate-800 mb-3">Today's Bills</h2>
      <ul className="divide-y divide-slate-100">
        {bills.map((bill, i) => (
          <li key={bill.id} className="py-2 flex items-center justify-between text-sm">
            <div>
              <p className="font-medium text-slate-700">
                Bill #{i + 1} · {new Date(bill.time).toLocaleTimeString()}
              </p>
              <p className="text-slate-400">
                {bill.items.map((it) => `${it.name} x${it.qty}`).join(", ")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  bill.paymentMode === "online"
                    ? "bg-brand-100 text-brand-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {bill.paymentMode === "online" ? "Online" : "Offline"}
              </span>
              <span className="font-semibold text-slate-700">₹{bill.total}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
