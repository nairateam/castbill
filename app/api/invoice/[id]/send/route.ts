import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { buildInvoiceEmail } from "@/lib/email/invoice";
import { renderInvoicePDF } from "@/lib/pdf";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;

        const invoice = await prisma.invoice.findUnique({
            where: { id },
            include: { items: true },
        });

        if (!invoice || invoice.userId !== session.user.id)
            return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

        if (invoice.status === "PAID")
            return NextResponse.json({ error: "Cannot send a PAID invoice" }, { status: 400 });

        const invoiceUrl = `${process.env.NEXTAUTH_URL}/invoice/${invoice.id}`;

        const dueDateFormatted = invoice.dueDate
            ? new Date(invoice.dueDate).toLocaleDateString("en-US", {
                month: "long", day: "numeric", year: "numeric",
            })
            : null;

        const pdfBuffer = await renderInvoicePDF({
            invoiceNumber: invoice.invoiceNumber,
            status: invoice.status,
            currency: invoice.currency,
            createdAt: invoice.createdAt.toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
            }),
            dueDate: dueDateFormatted ?? undefined,
            senderName: invoice.senderName,
            senderEmail: invoice.senderEmail,
            senderPhone: invoice.senderPhone ?? undefined,
            senderAddress: invoice.senderAddress ?? undefined,
            senderLogoUrl: invoice.senderLogoUrl ?? undefined,
            senderVatNumber: invoice.senderVatNumber ?? undefined,
            clientName: invoice.clientName,
            clientEmail: invoice.clientEmail,
            clientPhone: invoice.clientPhone ?? undefined,
            clientAddress: invoice.clientAddress ?? undefined,
            items: invoice.items.map((item) => ({
                description: item.description,
                quantity: item.quantity,
                rate: item.rate,
                amount: item.amount,
            })),
            notes: invoice.notes ?? "",
            subtotal: invoice.subtotal,
            tax: invoice.tax ?? 0,
            discount: invoice.discount ?? 0,
            total: invoice.total,
        });

        const { error: sendError } = await resend.emails.send({
            from: "CastBill <invoices@theundercast.com>",
            to: invoice.clientEmail,
            subject: `Invoice #${invoice.invoiceNumber} from ${invoice.senderName}`,
            html: buildInvoiceEmail({
                invoiceNumber: invoice.invoiceNumber,
                senderName: invoice.senderName,
                clientName: invoice.clientName,
                total: invoice.total,
                dueDate: dueDateFormatted,
                invoiceUrl,
                currency: invoice.currency,
            }),
            attachments: [
                {
                    filename: `invoice-${invoice.invoiceNumber}.pdf`,
                    content: Buffer.from(pdfBuffer).toString("base64"),
                },
            ],
        });

        if (sendError) {
            console.error("Resend error:", sendError);
            return NextResponse.json({ error: "Failed to send email. Please try again." }, { status: 502 });
        }

        if (invoice.status === "DRAFT") {
            await prisma.invoice.update({
                where: { id },
                data: { status: "SENT" },
            });
        }

        return NextResponse.json({
            success: true,
            message: `Invoice sent to ${invoice.clientEmail}`,
        });

    } catch (err) {
        console.error("Send invoice error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}