import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            clientName, clientEmail, clientPhone, clientAddress,
            senderName, senderEmail, senderPhone, senderAddress,
            senderLogoUrl, senderVatNumber,
            items, taxRate = 0, discount = 0, dueDate, notes,
            currency = "NGN", clientId,
        } = body;

        if (!clientName || !clientEmail || !senderName || !senderEmail) {
            return NextResponse.json({ error: "Client and sender details are required" }, { status: 400 });
        }

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "At least one item is required" }, { status: 400 });
        }

        const subtotal = items.reduce(
            (sum: number, item: { quantity: number; rate: number }) => sum + item.quantity * item.rate,
            0
        );
        const taxAmount = (subtotal * taxRate) / 100;
        const total = subtotal + taxAmount - discount;

        const lastInvoice = await prisma.invoice.findFirst({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            select: { invoiceNumber: true },
        });

        const lastNumber = lastInvoice
            ? parseInt(lastInvoice.invoiceNumber.replace("INV-", ""), 10)
            : 0;

        const invoiceNumber = `INV-${String(lastNumber + 1).padStart(4, "0")}`;

        const invoice = await prisma.invoice.create({
            data: {
                invoiceNumber,
                clientName, clientEmail,
                clientPhone: clientPhone || null,
                clientAddress: clientAddress || null,
                clientId: clientId || null,
                senderName, senderEmail,
                senderPhone: senderPhone || null,
                senderAddress: senderAddress || null,
                senderLogoUrl: senderLogoUrl || null,
                senderVatNumber: senderVatNumber || null,
                subtotal,
                tax: taxAmount,
                discount,
                total,
                currency,
                dueDate: dueDate ? new Date(dueDate) : null,
                notes: notes || null,
                userId: session.user.id,
                items: {
                    create: items.map((item: { description: string; quantity: number; rate: number }) => ({
                        description: item.description,
                        quantity: item.quantity,
                        rate: item.rate,
                        amount: item.quantity * item.rate,
                    })),
                },
            },
            include: { items: true },
        });

        return NextResponse.json({ invoice }, { status: 201 });
    } catch (error) {
        console.error("[POST /api/invoice]", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");

        const invoices = await prisma.invoice.findMany({
            where: {
                userId: session.user.id,
                ...(status ? { status: status as any } : {}),
            },
            include: { items: true },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ invoices }, { status: 200 });
    } catch (error) {
        console.error("[GET /api/invoice]", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}