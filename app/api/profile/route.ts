import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ profile: null }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
        where: { userId: session.user.id },
    });

    return NextResponse.json({ profile });
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const profile = await prisma.profile.upsert({
        where: { userId: session.user.id },
        update: body,
        create: { userId: session.user.id, ...body },
    });

    return NextResponse.json({ profile });
}