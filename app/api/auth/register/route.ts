import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        // 1. Get the data from the request body
        const { email, username, password } = await req.json();

        // 2. Check all fields are provided
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // 3. Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "An account with this email already exists" },
                { status: 400 }
            );
        }

        // 4. Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Create the user in the database
        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
            },
        });

        // 6. Return success (never return the password)
        return NextResponse.json(
            { message: "Account created successfully", userId: user.id },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}