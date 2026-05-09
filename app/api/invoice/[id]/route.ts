import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

// GET /api/invoice/[id]
export async function GET(req: NextRequest, { params }: Params) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const invoice = await prisma.invoice.findUnique({
            where: { id },
            include: { items: true },
        });

        if (!invoice) {
            return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
        }

        if (invoice.userId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json({ invoice }, { status: 200 });
    } catch (error) {
        console.error("[GET /api/invoice/[id]]", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

// PATCH /api/invoice/[id] — update status
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { status } = await req.json();
        const validStatuses = ["DRAFT", "SENT", "PAID"];

        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const invoice = await prisma.invoice.findUnique({
            where: { id },
        });

        if (!invoice) {
            return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
        }

        if (invoice.userId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const updated = await prisma.invoice.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json({ invoice: updated }, { status: 200 });
    } catch (error) {
        console.error("[PATCH /api/invoice/[id]]", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

// DELETE /api/invoice/[id]
export async function DELETE(req: NextRequest, { params }: Params) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const invoice = await prisma.invoice.findUnique({ where: { id } });

        if (!invoice) {
            return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
        }

        if (invoice.userId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Delete items first, then invoice
        await prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });
        await prisma.invoice.delete({ where: { id } });

        return NextResponse.json(
            { message: "Invoice deleted" },
            { status: 200 }
        );
    } catch (error) {
        console.error("[DELETE /api/invoice/[id]]", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}