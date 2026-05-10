import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const client = await prisma.client.findUnique({
        where: { id },
        include: {
            invoices: {
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    invoiceNumber: true,
                    total: true,
                    currency: true,
                    status: true,
                    createdAt: true,
                },
            },
            _count: { select: { invoices: true } },
        },
    });

    if (!client || client.userId !== session.user.id)
        return NextResponse.json({ error: "Client not found" }, { status: 404 });

    return NextResponse.json({ client });
}

export async function PATCH(req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { name, email, phone, address } = await req.json();

    const client = await prisma.client.findUnique({ where: { id } });
    if (!client || client.userId !== session.user.id)
        return NextResponse.json({ error: "Client not found" }, { status: 404 });

    const updated = await prisma.client.update({
        where: { id },
        data: {
            name: name ?? client.name,
            email: email ?? client.email,
            phone: phone ?? client.phone,
            address: address ?? client.address,
        },
    });

    return NextResponse.json({ client: updated });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const client = await prisma.client.findUnique({ where: { id } });
    if (!client || client.userId !== session.user.id)
        return NextResponse.json({ error: "Client not found" }, { status: 404 });

    await prisma.client.delete({ where: { id } });

    return NextResponse.json({ message: "Client deleted" });
}