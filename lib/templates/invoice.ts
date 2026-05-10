export type InvoiceTemplateData = {
  invoiceNumber: string;
  status: string;
  createdAt: string;
  dueDate?: string;
  senderName: string;
  senderEmail: string;
  clientPhone?: string;
  senderPhone?: string;
  senderAddress?: string;
  senderLogoUrl?: string;
  senderVatNumber?: string;
  clientAddress?: string;
  clientName: string;
  clientEmail: string;
  currency: string;
  items: {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes: string;
};

export function buildInvoiceHTML(data: InvoiceTemplateData): string {

  const itemRows = data.items
    .map(
      (item) => `
    <tr>
      <td class="td">${item.description}</td>
      <td class="td center">${item.quantity}</td>
      <td class="td right">${data.currency}${item.rate.toFixed(2)}</td>
      <td class="td right bold">${data.currency}${item.amount.toFixed(2)}</td>
    </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 13px;
      color: #1a1a2e;
      background: #fff;
      padding: 48px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 24px;
      border-bottom: 2px solid #e8e8f0;
    }

    .brand {
      font-size: 22px;
      font-weight: 700;
      color: #1a1a2e;
      letter-spacing: -0.5px;
    }

    .brand span { color: #6366f1; }

    .invoice-meta { text-align: right; }

    .invoice-meta h1 {
      font-size: 28px;
      font-weight: 800;
      color: #6366f1;
      letter-spacing: -1px;
    }

    .invoice-meta p {
      color: #6b7280;
      font-size: 12px;
      margin-top: 2px;
    }

    .status-badge {
      display: inline-block;
      margin-top: 6px;
      padding: 3px 10px;
      border-radius: 99px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: ${data.status === "PAID" ? "#d1fae5" : data.status === "SENT" ? "#dbeafe" : "#f3f4f6"};
      color: ${data.status === "PAID" ? "#065f46" : data.status === "SENT" ? "#1e40af" : "#374151"};
    }

    .parties {
      display: flex;
      justify-content: space-between;
      margin-bottom: 36px;
      gap: 32px;
    }

    .party { flex: 1; }

    .party-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #9ca3af;
      margin-bottom: 6px;
    }

    .party-name {
      font-size: 15px;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 2px;
    }

    .party-email { font-size: 12px; color: #6b7280; }

    .dates { text-align: right; }

    .date-row {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-bottom: 4px;
      font-size: 12px;
    }

    .date-row .label {
      color: #9ca3af;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 10px;
      letter-spacing: 0.5px;
      align-self: center;
    }

    .date-row .value { color: #1a1a2e; font-weight: 500; }

    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }

    thead tr { background: #1a1a2e; color: #fff; }

    thead th {
      padding: 10px 14px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      text-align: left;
    }

    thead th.right { text-align: right; }
    thead th.center { text-align: center; }

    .td {
      padding: 10px 14px;
      border-bottom: 1px solid #f0f0f8;
      color: #374151;
      vertical-align: top;
    }

    .td.center { text-align: center; }
    .td.right { text-align: right; }
    .td.bold { font-weight: 600; color: #1a1a2e; }

    tbody tr:last-child td { border-bottom: none; }

    .totals-wrap {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 40px;
    }

    .totals { width: 260px; }

    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      font-size: 13px;
      color: #6b7280;
      border-bottom: 1px dashed #e8e8f0;
    }

    .totals-row:last-child {
      border-bottom: none;
      margin-top: 6px;
      padding-top: 10px;
      font-size: 16px;
      font-weight: 800;
      color: #1a1a2e;
    }

    .totals-row:last-child span:last-child { color: #6366f1; }

    .footer {
      text-align: center;
      font-size: 11px;
      color: #d1d5db;
      padding-top: 24px;
      border-top: 1px solid #f0f0f8;
    }
  </style>
</head>
<body>

  <div class="header">
    <div class="brand">Invoice<span>.</span></div>
    <div class="invoice-meta">
      <h1>#${data.invoiceNumber}</h1>
      <p>Invoice Number</p>
      <span class="status-badge">${data.status}</span>
    </div>
  </div>

  <div class="parties">
    <div class="party">
      <div class="party-label">From</div>
      <div class="party-name">${data.senderName}</div>
      <div class="party-email">${data.senderEmail}</div>
    </div>
    <div class="party">
      <div class="party-label">Bill To</div>
      <div class="party-name">${data.clientName}</div>
      <div class="party-email">${data.clientEmail}</div>
    </div>
    <div class="party dates">
      <div class="date-row">
        <span class="label">Issued</span>
        <span class="value">${data.createdAt}</span>
      </div>
      ${data.dueDate ? `<div class="date-row">
        <span class="label">Due</span>
        <span class="value">${data.dueDate}</span>
      </div>` : ""}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th class="center">Qty</th>
        <th class="right">Unit Price</th>
        <th class="right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
    </tbody>
  </table>

  <div class="totals-wrap">
    <div class="totals">
      <div class="totals-row">
        <span>Subtotal</span>
        <span>${data.currency}${data.subtotal.toFixed(2)}</span>
      </div>
      <div class="totals-row">
        <span>Tax</span>
        <span>${data.currency}${data.tax.toFixed(2)}</span>
      </div>
      <div class="totals-row">
        <span>Discount</span>
        <span>-${data.currency}${data.discount.toFixed(2)}</span>
      </div>
      <div class="totals-row">
        <span>Total Due</span>
        <span>${data.currency}${data.total.toFixed(2)}</span>
      </div>
    </div>
  </div>

  <div class="footer">
    Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · Thank you for your business.
  </div>

</body>
</html>
  `;
}