import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { renderInvoicePDF } from "@/lib/pdf";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    const invoice = await prisma.invoice.findFirst({
        where: { id, user: { email: session.user.email } },
        include: { items: true },
    });

    if (!invoice) {
        return new Response("Not found", { status: 404 });
    }

    const buffer = await renderInvoicePDF({
        invoiceNumber: invoice.invoiceNumber,
        status: invoice.status,
        currency: invoice.currency,
        createdAt: invoice.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        dueDate: invoice.dueDate?.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        senderName: invoice.senderName,
        senderEmail: invoice.senderEmail,
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
        items: invoice.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount,
        })),
        subtotal: invoice.subtotal,
        tax: invoice.tax ?? 0,
        discount: invoice.discount ?? 0,
        total: invoice.total,
    });

    return new Response(Buffer.from(buffer), {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`,
        },
    });
}