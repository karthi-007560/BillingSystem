import React, { useState } from "react";
import { DEFAULT_PRODUCTS } from "./products";
import { store } from "./storage";
import { downloadDayReport } from "./report";

import ProductCard from "./components/ProductCard";
import Cart from "./components/Cart";
import ExpenseForm from "./components/ExpenseForm";
import BillsList from "./components/BillsList";

const date = store.today();

/* =========================
   YESTERDAY DATE
========================= */

function getYesterdayDate() {
  const yesterday = new Date();

  yesterday.setDate(
    yesterday.getDate() - 1
  );

  return yesterday
    .toISOString()
    .slice(0, 10);
}

/* =========================
   GET LAST SAVED BALANCE
========================= */

function getLastSavedBalance() {
  const todayBills = store.getBills(date);

  // If today's bills already exist,
  // use the latest bill's balance
  if (todayBills.length > 0) {
    const lastBill =
      todayBills[todayBills.length - 1];

    return Number(
      lastBill.balanceAmount || 0
    );
  }

  // Otherwise get yesterday's balance
  const yesterdayDate =
    getYesterdayDate();

  const yesterdayBills =
    store.getBills(yesterdayDate);

  if (yesterdayBills.length > 0) {
    const lastYesterdayBill =
      yesterdayBills[
        yesterdayBills.length - 1
      ];

    return Number(
      lastYesterdayBill.balanceAmount || 0
    );
  }

  return 0;
}

export default function App() {

  const [products] =
    useState(DEFAULT_PRODUCTS);

  const [qtyMap, setQtyMap] =
    useState({});

  const [cart, setCart] =
    useState([]);

  const [expenses, setExpenses] =
    useState(() =>
      store.getExpenses(date)
    );

  const [bills, setBills] =
    useState(() =>
      store.getBills(date)
    );

  const [message, setMessage] =
    useState("");

  /* =========================
     SAVED PREVIOUS BALANCE
  ========================= */

  const [
    savedPreviousAmount,
    setSavedPreviousAmount
  ] = useState(
    getLastSavedBalance()
  );

  /* =========================
     CHANGE PRODUCT QUANTITY
  ========================= */

  function changeQty(id, delta) {

    setQtyMap((prev) => ({
      ...prev,

      [id]: Math.max(
        0,
        (prev[id] || 0) + delta
      ),
    }));
  }

  /* =========================
     ADD PRODUCT TO CART
  ========================= */

  function addToCart(product) {

    const qty =
      qtyMap[product.id] || 0;

    if (qty === 0) return;

    setCart((prev) => {

      const existing =
        prev.find(
          (item) =>
            item.name === product.name
        );

      if (existing) {

        return prev.map((item) =>
          item.name === product.name
            ? {
                ...item,

                qty:
                  item.qty + qty,

                subtotal:
                  (item.qty + qty) *
                  item.price,
              }
            : item
        );
      }

      return [
        ...prev,

        {
          name: product.name,

          price: product.price,

          qty,

          subtotal:
            qty * product.price,
        },
      ];
    });

    setQtyMap((prev) => ({
      ...prev,

      [product.id]: 0,
    }));
  }

  /* =========================
     REMOVE FROM CART
  ========================= */

  function removeFromCart(name) {

    setCart((prev) =>
      prev.filter(
        (item) =>
          item.name !== name
      )
    );
  }

  /* =========================
     SAVE BILL
  ========================= */

  function saveBill(
    paymentMode,
    previousAmount = 0,
    payableAmount = 0,
    balanceAmount = 0
  ) {

    if (cart.length === 0) return;

    const todayTotal =
      cart.reduce(
        (sum, item) =>
          sum +
          Number(
            item.subtotal || 0
          ),
        0
      );

    const previous =
      Number(
        previousAmount
      ) || 0;

    /* =========================
       TOTAL AMOUNT
    ========================= */

    const totalAmount =
      previous +
      todayTotal;

    /* =========================
       PAYABLE TODAY
    ========================= */

    const payable =
      Math.max(
        todayTotal -
          previous,
        0
      );

    /* =========================
       REMAINING BALANCE
    ========================= */

    const remaining =
      Math.max(
        previous -
          todayTotal,
        0
      );

    /* =========================
       BILL DATA
    ========================= */

    const billData = {

      items: cart,

      // Today's product amount
      total: todayTotal,

      // Manually entered / saved previous balance
      previousAmount: previous,

      // Previous + today's amount
      totalAmount: totalAmount,

      // Amount customer pays today
      payableAmount: payable,

      // Balance carried to next bill/day
      balanceAmount: remaining,

      paymentMode,
    };

    /* =========================
       SAVE TO STORE
    ========================= */

    const updated =
      store.saveBill(
        date,
        billData
      );

    setBills(updated);

    /* =========================
       IMPORTANT
       SAVE REMAINING BALANCE
       FOR NEXT BILL
    ========================= */

    setSavedPreviousAmount(
      remaining
    );

    /* =========================
       CLEAR CART
    ========================= */

    setCart([]);

    /* =========================
       MESSAGE
    ========================= */

    setMessage(
      `Bill saved successfully. Today Total: ₹${todayTotal.toFixed(
        2
      )} | Previous: ₹${previous.toFixed(
        2
      )} | Balance: ₹${remaining.toFixed(
        2
      )}`
    );
  }

  /* =========================
     ADD EXPENSE
  ========================= */

  function addExpense(data) {

    const updated =
      store.addExpense(
        date,
        data
      );

    setExpenses(updated);
  }

  /* =========================
     DOWNLOAD REPORT
  ========================= */

  function downloadReport() {

    downloadDayReport(
      date,
      bills,
      expenses
    );
  }

  /* =========================
     EXPENSE TOTAL
  ========================= */

  const expenseTotal =
    expenses.reduce(
      (sum, expense) =>
        sum +
        Number(
          expense.amount || 0
        ),
      0
    );

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="min-h-screen bg-slate-100">

      {/* =========================
          HEADER
      ========================= */}

      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">

        <div>

          <h1 className="text-xl font-bold text-slate-800">
            Billing Dashboard
          </h1>

          <p className="text-sm text-slate-400">
            {date}
          </p>

        </div>

        <button
          onClick={downloadReport}
          className="px-4 py-2 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600"
        >
          Download Day Report (PDF)
        </button>

      </header>

      {/* =========================
          MESSAGE
      ========================= */}

      {message && (
        <div className="mx-6 mt-4 px-4 py-2 rounded-lg bg-amber-50 text-amber-700 text-sm">
          {message}
        </div>
      )}

      {/* =========================
          MAIN
      ========================= */}

      <main className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* =========================
            PRODUCTS
        ========================= */}

        <section className="lg:col-span-3">

          <h2 className="font-semibold text-slate-700 mb-3">
            Products
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                qty={
                  qtyMap[
                    product.id
                  ] || 0
                }
                onIncrease={(id) =>
                  changeQty(id, 1)
                }
                onDecrease={(id) =>
                  changeQty(id, -1)
                }
                onAddToCart={
                  addToCart
                }
              />
            ))}

          </div>

          {/* =========================
              LOWER SECTIONS
          ========================= */}

          <div className="mt-6 space-y-6">

            <BillsList
              bills={bills}
            />

            <ExpenseForm
              onAdd={addExpense}
              adding={false}
            />

            {expenses.length > 0 && (
              <div className="mt-3 bg-white rounded-xl border border-slate-200 p-4 text-sm">

                <p className="font-semibold text-slate-700 mb-2">
                  Today's expenses: ₹
                  {expenseTotal.toFixed(2)}
                </p>

                <ul className="space-y-1">

                  {expenses.map(
                    (expense) => (
                      <li
                        key={
                          expense.id
                        }
                        className="text-slate-500"
                      >
                        {expense.description}
                        {" — ₹"}
                        {expense.amount}
                        {" ("}
                        {
                          expense.paymentMode
                        }
                        {", paid to "}
                        {expense.paidTo}
                        {")"}
                      </li>
                    )
                  )}

                </ul>

              </div>
            )}

          </div>

        </section>

        {/* =========================
            CART
        ========================= */}

        <aside className="lg:col-span-1">

          <Cart
            cart={cart}
            onRemove={
              removeFromCart
            }
            onSave={saveBill}
            saving={false}

            /* IMPORTANT */
            savedPreviousAmount={
              savedPreviousAmount
            }
          />

        </aside>

      </main>

    </div>
  );
}