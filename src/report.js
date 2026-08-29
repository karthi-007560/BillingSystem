import jsPDF from "jspdf";

// Builds the one-day sales + expense report as a downloadable PDF,
// entirely in the browser (no backend needed).
export function downloadDayReport(date, bills, expenses) {
  const doc = new jsPDF();
  let y = 15;

  doc.setFontSize(16);
  doc.text(`Daily Sales Report - ${date}`, 105, y, { align: "center" });
  y += 10;

  doc.setFontSize(13);
  doc.text("Bills Collected", 14, y);
  y += 7;

  let salesTotal = 0;
  let onlineSales = 0;
  let offlineSales = 0;
  const productTotals = {};

  if (bills.length === 0) {
    doc.setFontSize(10);
    doc.text("No bills recorded for this day.", 14, y);
    y += 7;
  }

  bills.forEach((bill, i) => {
    const mode = bill.paymentMode === "online" ? "Online" : "Offline";
    doc.setFontSize(11);
    doc.text(`Bill #${i + 1} - ${new Date(bill.time).toLocaleTimeString()} (${mode})`, 14, y);
    y += 6;
    bill.items.forEach((item) => {
      doc.setFontSize(9);
      doc.text(
        `   ${item.name}  x${item.qty}  @${item.price}  = ${item.subtotal}`,
        14,
        y
      );
      y += 5;
      if (!productTotals[item.name]) productTotals[item.name] = { qty: 0, amount: 0 };
      productTotals[item.name].qty += item.qty;
      productTotals[item.name].amount += item.subtotal;
    });
    doc.setFontSize(10);
    doc.text(`   Bill total: ${bill.total}`, 14, y);
    y += 7;
    salesTotal += bill.total;
    if (bill.paymentMode === "online") onlineSales += bill.total;
    else offlineSales += bill.total;
    if (y > 270) {
      doc.addPage();
      y = 15;
    }
  });

  y += 3;
  doc.setFontSize(13);
  doc.text("Product-wise Totals", 14, y);
  y += 7;
  Object.entries(productTotals).forEach(([name, t]) => {
    doc.setFontSize(9);
    doc.text(`${name}: ${t.qty} sold, amount = ${t.amount}`, 14, y);
    y += 5;
  });

  y += 5;
  doc.setFontSize(11);
  doc.text(`Total Sales for the day: ${salesTotal}`, 14, y);
  y += 6;
  doc.setFontSize(9);
  doc.text(`   Online: ${onlineSales}   Offline: ${offlineSales}`, 14, y);
  y += 10;

  doc.setFontSize(13);
  doc.text("Expenses", 14, y);
  y += 7;

  let onlineTotal = 0;
  let offlineTotal = 0;
  if (expenses.length === 0) {
    doc.setFontSize(9);
    doc.text("No expenses recorded for this day.", 14, y);
    y += 6;
  }
  expenses.forEach((exp) => {
    doc.setFontSize(9);
    doc.text(
      `${exp.description} - ${exp.amount} (${exp.paymentMode}) paid to ${exp.paidTo}`,
      14,
      y
    );
    y += 5;
    if (exp.paymentMode === "online") onlineTotal += exp.amount;
    else offlineTotal += exp.amount;
  });

  y += 3;
  doc.setFontSize(10);
  doc.text(`Online payments: ${onlineTotal}`, 14, y);
  y += 5;
  doc.text(`Offline payments: ${offlineTotal}`, 14, y);
  y += 5;
  doc.text(`Total expenses: ${onlineTotal + offlineTotal}`, 14, y);
  y += 8;

  doc.setFontSize(12);
  doc.text(`Net (Sales - Expenses): ${salesTotal - (onlineTotal + offlineTotal)}`, 14, y);

  doc.save(`sales-report-${date}.pdf`);
}
