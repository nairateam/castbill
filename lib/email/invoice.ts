interface InvoiceEmailProps {
    invoiceNumber: string;
    senderName: string;
    clientName: string;
    total: number;
    dueDate: string | null;
    invoiceUrl: string;
    currency: string;
}

export function buildInvoiceEmail({
    invoiceNumber,
    senderName,
    clientName,
    total,
    dueDate,
    invoiceUrl,
    currency,
}: InvoiceEmailProps): string {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Invoice #${invoiceNumber}</title>
      </head>
      <body style="font-family: sans-serif; background: #f9f9f9; padding: 40px 0;">
        <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 8px; padding: 40px; border: 1px solid #e5e5e5;">
          
          <h2 style="margin: 0 0 4px;">Invoice #${invoiceNumber}</h2>
          <p style="color: #666; margin: 0 0 32px;">from ${senderName}</p>

          <p style="font-size: 15px;">Hi ${clientName},</p>
          <p style="font-size: 15px; color: #444;">
            You have received an invoice of <strong>${currency}${total.toFixed(2)}</strong>
            ${dueDate ? `due on <strong>${dueDate}</strong>` : ""}.
          </p>

          <div style="text-align: center; margin: 36px 0;">
            <a
              href="${invoiceUrl}"
              style="
                background: #f59e0b;
                color: #000;
                padding: 14px 32px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 600;
                font-size: 15px;
              "
            >
              View Invoice
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
          <p style="font-size: 12px; color: #999; text-align: center;">
            This email was sent by ${senderName} via CastBill.
          </p>
        </div>
      </body>
    </html>
  `;
}