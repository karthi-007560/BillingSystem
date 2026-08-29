// Simple localStorage-backed persistence, keyed by day, so bills/expenses
// survive a page refresh without needing a backend.

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const store = {
  today: todayStr,

  getBills(date) {
    return read(`bills_${date}`, []);
  },
  saveBill(date, bill) {
    const bills = store.getBills(date);
    bills.push({ ...bill, id: Date.now().toString() + Math.random().toString(36).substring(2, 9),time: new Date().toISOString() });
    write(`bills_${date}`, bills);
    return bills;
  },

  getExpenses(date) {
    return read(`expenses_${date}`, []);
  },
  addExpense(date, expense) {
    const expenses = store.getExpenses(date);
    expenses.push({ ...expense, id: Date.now().toString() + Math.random().toString(36).substring(2, 9), time: new Date().toISOString() });
    write(`expenses_${date}`, expenses);
    return expenses;
  },
};
