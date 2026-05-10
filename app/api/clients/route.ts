import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const clients = await prisma.client.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: {
            _count: { select: { invoices: true } },
        },
    });

    return NextResponse.json({ clients });
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, email, phone, address } = await req.json();

    if (!name || !email) return NextResponse.json({ error: "Name and email are required" }, { status: 400 });

    const client = await prisma.client.create({
        data: {
            name,
            email,
            phone: phone || null,
            address: address || null,
            userId: session.user.id,
        },
    });

    return NextResponse.json({ client }, { status: 201 });
}