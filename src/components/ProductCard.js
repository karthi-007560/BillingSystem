import React from "react";

export default function ProductCard({ product, qty, onIncrease, onDecrease, onAddToCart }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <h3 className="font-semibold text-slate-800 text-base">{product.name}</h3>
        <p className="text-brand-600 font-medium mt-1">₹{product.price}</p>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={() => onDecrease(product.id)}
            className="px-3 py-1 text-slate-600 hover:bg-slate-100 active:bg-slate-200"
            aria-label={`Decrease ${product.name} quantity`}
          >
            −
          </button>
          <span className="px-3 py-1 min-w-[2rem] text-center font-medium">{qty}</span>
          <button
            onClick={() => onIncrease(product.id)}
            className="px-3 py-1 text-slate-600 hover:bg-slate-100 active:bg-slate-200"
            aria-label={`Increase ${product.name} quantity`}
          >
            +
          </button>
        </div>

        <button
          onClick={() => onAddToCart(product)}
          disabled={qty === 0}
          className="ml-2 px-3 py-1.5 rounded-lg bg-brand-500 text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-600 active:bg-brand-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
