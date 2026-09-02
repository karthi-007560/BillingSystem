import React, { useEffect, useState } from "react";

export default function Cart({
  cart,
  onRemove,
  onSave,
  saving,
  savedPreviousAmount = 0,
}) {
  const [paymentMode, setPaymentMode] = useState("offline");

  // =========================
  // PREVIOUS BALANCE
  // =========================
  const [previousAmount, setPreviousAmount] = useState(
    savedPreviousAmount ? String(savedPreviousAmount) : ""
  );

  // =========================
  // ALL ORDERS TOTAL
  // =========================
  const [savedTotalAmount, setSavedTotalAmount] = useState(() => {
    const saved = localStorage.getItem("totalOrderAmount");

    return saved ? Number(saved) : 0;
  });

  // =========================
  // UPDATE PREVIOUS BALANCE
  // =========================
  useEffect(() => {
    if (Number(savedPreviousAmount) > 0) {
      setPreviousAmount(String(savedPreviousAmount));
    } else {
      setPreviousAmount("");
    }
  }, [savedPreviousAmount]);

  // =========================
  // CURRENT ORDER TOTAL
  // =========================
  const todayTotal = cart.reduce(
    (sum, item) => sum + Number(item.subtotal || 0),
    0
  );

  // =========================
  // PREVIOUS BALANCE
  // =========================
  const previousBalance = Number(previousAmount) || 0;

  // =========================
  // CURRENT ORDER CALCULATIONS
  // =========================

  const payableAmount = Math.max(
    todayTotal - previousBalance,
    0
  );

  const balanceAmount = Math.max(
    previousBalance - todayTotal,
    0
  );

  // =========================
  // PREVIOUS BALANCE INPUT
  // =========================
  const handlePreviousAmount = (e) => {
    const value = e.target.value;

    if (value === "") {
      setPreviousAmount("");
      return;
    }

    if (Number(value) >= 0) {
      setPreviousAmount(value);
    }
  };

  // =========================
  // SAVE BILL
  // =========================
  const handleSave = () => {
    if (cart.length === 0) return;

    // Current order amount
    const currentOrderAmount = todayTotal;

    // Existing completed orders total
    const oldTotal =
      Number(localStorage.getItem("totalOrderAmount")) || 0;

    // Add current order to previous total
    const newTotal = oldTotal + currentOrderAmount;

    // Store all orders total
    localStorage.setItem(
      "totalOrderAmount",
      newTotal.toString()
    );

    // Update UI
    setSavedTotalAmount(newTotal);

    // Save bill to parent
    onSave(
      paymentMode,
      previousBalance,
      payableAmount,
      balanceAmount
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sticky top-4">

      {/* =========================
          CART TITLE
      ========================= */}

      <h2 className="font-semibold text-lg text-slate-800 mb-3">
        Cart
      </h2>

      {/* =========================
          CART ITEMS
      ========================= */}

      {cart.length === 0 ? (
        <p className="text-slate-400 text-sm">
          No items added yet.
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 max-h-80 overflow-y-auto">

          {cart.map((item) => (
            <li
              key={item.name}
              className="py-2 flex justify-between items-center text-sm"
            >
              <div>
                <p className="font-medium text-slate-700">
                  {item.name}
                </p>

                <p className="text-slate-400">
                  {item.qty} x ₹{item.price} = ₹
                  {Number(item.subtotal || 0).toFixed(2)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onRemove(item.name)}
                className="text-red-400 hover:text-red-600 text-xs font-medium"
              >
                Remove
              </button>
            </li>
          ))}

        </ul>
      )}

      {/* =========================
          TODAY'S TOTAL
      ========================= */}

      <div className="border-t border-slate-200 mt-3 pt-3 flex justify-between items-center">

        <span className="font-semibold text-slate-700">
          Today's Total
        </span>

        <span className="font-bold text-brand-600 text-lg">
          ₹{todayTotal.toFixed(2)}
        </span>

      </div>

      {/* =========================
          PREVIOUS BALANCE
      ========================= */}

      <div className="mt-4">

        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
          Previous Balance
        </label>

        <input
          type="number"
          min="0"
          value={previousAmount}
          onChange={handlePreviousAmount}
          placeholder="Enter previous balance"
          disabled={cart.length === 0}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:bg-slate-50 disabled:cursor-not-allowed"
        />

        <p className="text-xs text-slate-400 mt-1">
          Saved balance will automatically appear here.
        </p>

      </div>

      {/* =========================
          CALCULATION
      ========================= */}

      <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200">

        {/* Previous Balance */}

        <div className="flex justify-between text-sm mb-2">

          <span className="text-slate-500">
            Previous Balance
          </span>

          <span className="font-medium text-amber-600">
            ₹{previousBalance.toFixed(2)}
          </span>

        </div>

        {/* Today's Amount */}

        <div className="flex justify-between text-sm mb-2">

          <span className="text-slate-500">
            Today's Amount
          </span>

          <span className="font-medium text-slate-700">
            ₹{todayTotal.toFixed(2)}
          </span>

        </div>

        {/* Total Amount - ALL COMPLETED ORDERS */}

        <div className="border-t border-slate-200 pt-2 flex justify-between text-sm mb-2">

          <span className="font-semibold text-slate-600">
            Total Amount
          </span>

          <span className="font-semibold text-slate-800">
            ₹{savedTotalAmount.toFixed(2)}
          </span>

        </div>

        {/* Less Previous */}

        <div className="flex justify-between text-sm mb-2">

          <span className="text-slate-500">
            Less: Previous Balance
          </span>

          <span className="font-medium text-red-500">
            - ₹{previousBalance.toFixed(2)}
          </span>

        </div>

        {/* Payable */}

        <div className="flex justify-between text-sm mb-2">

          <span className="font-semibold text-slate-600">
            Payable Today
          </span>

          <span className="font-semibold text-emerald-600">
            ₹{payableAmount.toFixed(2)}
          </span>

        </div>

        {/* Remaining Balance */}

        <div className="border-t border-slate-200 pt-2 flex justify-between items-center">

          <span className="font-bold text-slate-800">
            Remaining Balance
          </span>

          <span className="font-bold text-blue-600 text-xl">
            ₹{balanceAmount.toFixed(2)}
          </span>

        </div>

      </div>

      {/* =========================
          PAYMENT MODE
      ========================= */}

      <div className="mt-4">

        <p className="text-xs font-medium text-slate-500 mb-1.5">
          Payment Mode
        </p>

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

      {/* =========================
          SAVE BILL
      ========================= */}

      <button
        type="button"
        onClick={handleSave}
        disabled={cart.length === 0 || saving}
        className="mt-4 w-full py-2 rounded-lg bg-emerald-600 text-white font-medium disabled:opacity-40 hover:bg-emerald-700 active:bg-emerald-800"
      >
        {saving ? "Saving..." : "Save Bill"}
      </button>

    </div>
  );
}