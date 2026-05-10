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
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f4f7; padding: 40px 0; margin: 0;">
    <div style="max-width: 580px; margin: 0 auto;">

      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 20px; font-weight: 700; color: #111;">CastBill<span style="color: #6366f1;">.</span></span>
      </div>

      <div style="background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">

        <div style="background: #0d0d14; padding: 32px 40px;">
          <p style="margin: 0 0 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(255,255,255,0.4);">Invoice</p>
          <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">#${invoiceNumber}</h1>
          <p style="margin: 6px 0 0; font-size: 13px; color: rgba(255,255,255,0.5);">from ${senderName}</p>
        </div>

        <div style="padding: 36px 40px;">
          <p style="font-size: 15px; color: #374151; margin: 0 0 12px;">Hi <strong>${clientName}</strong>,</p>
          <p style="font-size: 15px; color: #6b7280; line-height: 1.6; margin: 0 0 24px;">
            You have received an invoice of
            <strong style="color: #111;">${currency}${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
            ${dueDate ? `due on <strong style="color: #111;">${dueDate}</strong>` : "with no specified due date"}.
          </p>

          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px 20px; margin-bottom: 28px;">
            <p style="margin: 0; font-size: 13px; color: #6b7280;">
              📎 The invoice PDF is attached to this email. You can download it directly or click the button below to view it online.
            </p>
          </div>

          <div style="text-align: center; margin-bottom: 32px;">
            <a
              href="${invoiceUrl}"
              style="
                display: inline-block;
                background: #6366f1;
                color: #ffffff;
                padding: 14px 36px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                font-size: 15px;
                letter-spacing: 0.2px;
              "
            >
              View Invoice Online
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 0 0 24px;" />

          <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0; line-height: 1.6;">
            This invoice was sent by <strong>${senderName}</strong> via CastBill.<br/>
            If you have any questions, reply to this email or contact ${senderName} directly.
          </p>
        </div>
      </div>

      <p style="text-align: center; font-size: 11px; color: #9ca3af; margin-top: 24px;">
        Powered by <a href="https://castbill.vercel.app" style="color: #6366f1; text-decoration: none;">CastBill</a>
      </p>
    </div>
  </body>
</html>
  `;
}