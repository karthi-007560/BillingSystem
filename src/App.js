import React, { useState } from "react";
import { DEFAULT_PRODUCTS } from "./products";
import { store } from "./storage";
import { downloadDayReport } from "./report";
import ProductCard from "./components/ProductCard";
import Cart from "./components/Cart";
import ExpenseForm from "./components/ExpenseForm";
import BillsList from "./components/BillsList";

const date = store.today();

export default function App() {
  const [products] = useState(DEFAULT_PRODUCTS);
  const [qtyMap, setQtyMap] = useState({}); // productId -> pending quantity on the card
  const [cart, setCart] = useState([]); // [{ name, price, qty, subtotal }]
  const [expenses, setExpenses] = useState(() => store.getExpenses(date));
  const [bills, setBills] = useState(() => store.getBills(date));
  const [message, setMessage] = useState("");

  function changeQty(id, delta) {
    setQtyMap((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  }

  function addToCart(product) {
    const qty = qtyMap[product.id] || 0;
    if (qty === 0) return;
    setCart((prev) => {
      const existing = prev.find((i) => i.name === product.name);
      if (existing) {
        return prev.map((i) =>
          i.name === product.name
            ? { ...i, qty: i.qty + qty, subtotal: (i.qty + qty) * i.price }
            : i
        );
      }
      return [...prev, { name: product.name, price: product.price, qty, subtotal: qty * product.price }];
    });
    setQtyMap((prev) => ({ ...prev, [product.id]: 0 }));
  }

  function removeFromCart(name) {
    setCart((prev) => prev.filter((i) => i.name !== name));
  }

  function saveBill(paymentMode) {
    const total = cart.reduce((s, i) => s + i.subtotal, 0);
    const updated = store.saveBill(date, { items: cart, total, paymentMode });
    setBills(updated);
    setCart([]);
    setMessage(`Bill saved (${paymentMode}).`);
  }

  function addExpense(data) {
    const updated = store.addExpense(date, data);
    setExpenses(updated);
  }

  function downloadReport() {
    downloadDayReport(date, bills, expenses);
  }

  const expenseTotal = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Billing Dashboard</h1>
          <p className="text-sm text-slate-400">{date}</p>
        </div>
        <button
          onClick={downloadReport}
          className="px-4 py-2 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600"
        >
          Download Day Report (PDF)
        </button>
      </header>

      {message && (
        <div className="mx-6 mt-4 px-4 py-2 rounded-lg bg-amber-50 text-amber-700 text-sm">
          {message}
        </div>
      )}

      <main className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <section className="lg:col-span-3">
          <h2 className="font-semibold text-slate-700 mb-3">Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                qty={qtyMap[p.id] || 0}
                onIncrease={(id) => changeQty(id, 1)}
                onDecrease={(id) => changeQty(id, -1)}
                onAddToCart={addToCart}
              />
            ))}
          </div>

          <div className="mt-6 space-y-6">
            <BillsList bills={bills} />
            <ExpenseForm onAdd={addExpense} adding={false} />
            {expenses.length > 0 && (
              <div className="mt-3 bg-white rounded-xl border border-slate-200 p-4 text-sm">
                <p className="font-semibold text-slate-700 mb-2">
                  Today's expenses: ₹{expenseTotal}
                </p>
                <ul className="space-y-1">
                  {expenses.map((e) => (
                    <li key={e.id} className="text-slate-500">
                      {e.description} — ₹{e.amount} ({e.paymentMode}, paid to {e.paidTo})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            </div>
        </section>

        <aside className="lg:col-span-1">
          <Cart cart={cart} onRemove={removeFromCart} onSave={saveBill} saving={false} />
        </aside>
      </main>
    </div>
  );
}
