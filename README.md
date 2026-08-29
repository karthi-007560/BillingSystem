# Billing Software Dashboard — React (Create React App, no Vite)

Plain React project using Create React App tooling (`react-scripts`) instead
of Vite. Real component files (`.jsx`), not a single HTML file.

## Structure
```
public/index.html      base HTML shell
src/
  index.js             React entry point
  App.jsx              main app
  products.js           product list (edit prices/names here)
  storage.js            localStorage helpers (bills/expenses per day)
  report.js             client-side PDF generation (jsPDF)
  components/
    ProductCard.jsx
    Cart.jsx             includes Online/Offline payment selector
    BillsList.jsx         today's bills with Online/Offline badge
    ExpenseForm.jsx
```

## Run it
```bash
npm install
npm start
```
Opens at http://localhost:3000

## What it does
- Product cards with +/- quantity and "Add to Cart"
- Cart lets you pick **Offline (Cash)** or **Online** before "Save Bill"
- "Today's Bills" list shows each saved bill with an Online/Offline badge
- Expense form (amount, online/offline, paid to)
- "Download Day Report (PDF)" — per-bill breakdown (with payment mode),
  product-wise totals, total sales split into Online/Offline, and expenses
  split the same way, all generated in the browser (no backend needed)

## Editing
- Products: `src/products.js`
- No backend — everything is saved to the browser's localStorage per day.
