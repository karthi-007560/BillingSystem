import React, { useState } from "react";

export default function Cart({ cart, onRemove, onSave, saving }) {
  const [paymentMode, setPaymentMode] = useState("offline");
  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sticky top-4">
      <h2 className="font-semibold text-lg text-slate-800 mb-3">Cart</h2>

      {cart.length === 0 ? (
        <p className="text-slate-400 text-sm">No items added yet.</p>
      ) : (
        <ul className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
          {cart.map((item) => (
            <li key={item.name} className="py-2 flex justify-between items-center text-sm">
              <div>
                <p className="font-medium text-slate-700">{item.name}</p>
                <p className="text-slate-400">
                  {item.qty} x ₹{item.price} = ₹{item.subtotal}
                </p>
              </div>
              <button
                onClick={() => onRemove(item.name)}
                className="text-red-400 hover:text-red-600 text-xs font-medium"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="border-t border-slate-200 mt-3 pt-3 flex justify-between items-center">
        <span className="font-semibold text-slate-700">Total</span>
        <span className="font-bold text-brand-600 text-lg">₹{total}</span>
      </div>

      <div className="mt-3">
        <p className="text-xs font-medium text-slate-500 mb-1.5">Payment mode</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPaymentMode("offline")}
            className={`flex-1 py-1.5 rounded-lg text-sm font-medium border ${
              paymentMode === "offline"
                ? "bg-slate-800 text-white border-slate-800"
                : "bg-white text-slate-600 border-slate-200"
            }`}
          >
            Offline (Cash)
          </button>
          <button
            type="button"
            onClick={() => setPaymentMode("online")}
            className={`flex-1 py-1.5 rounded-lg text-sm font-medium border ${
              paymentMode === "online"
                ? "bg-brand-600 text-white border-brand-600"
                : "bg-white text-slate-600 border-slate-200"
            }`}
          >
            Online
          </button>
        </div>
      </div>

      <button
        onClick={() => onSave(paymentMode)}
        disabled={cart.length === 0 || saving}
        className="mt-4 w-full py-2 rounded-lg bg-emerald-600 text-white font-medium disabled:opacity-40 hover:bg-emerald-700 active:bg-emerald-800"
      >
        {saving ? "Saving..." : "Save Bill"}
      </button>
    </div>
  );
}
